import { Component, OnInit } from '@angular/core';
import { SolicitarPrestamoService } from 'src/app/services/solicitar-prestamo';
import { ToastService } from 'src/app/services/toast';
import { ListarActivosService } from 'src/app/services/listar-activos';

@Component({
  selector: 'app-historial-aprobaciones',
  templateUrl: './historial-aprobaciones.page.html',
  styleUrls: ['./historial-aprobaciones.page.scss'],
  standalone: false
})
export class HistorialAprobacionesPage implements OnInit {
  prestamos: any[] = [];
  activos: any[] = []; // todos los activos enriquecidos
  activosSolicitud: any[] = []; // activos filtrados de la solicitud seleccionada
  loading = false;

  isModalOpen = false;
  solicitudSeleccionada: any = null;

  constructor(
    private solicitarPrestamoService: SolicitarPrestamoService,
    private listarActivosService: ListarActivosService,
    private toastService: ToastService
  ) {}

  async ngOnInit() {
    this.loading = true;
    try {
      // Cargar solicitudes
      this.prestamos = await this.solicitarPrestamoService.listarPrestamos();

      // Suscribirse a activos enriquecidos
      this.listarActivosService.getActivos().subscribe((data) => {
        this.activos = data;
      });

      this.toastService.present('Historial de solicitudes cargado correctamente.', 'success');
    } catch (error) {
      console.error('Error al cargar historial de préstamos:', error);
      this.toastService.present('Error al cargar historial de solicitudes.', 'danger');
    } finally {
      this.loading = false;
    }
  }

  abrirModal(solicitud: any) {
    this.solicitudSeleccionada = solicitud;

    // Filtrar activos de la solicitud
    this.activosSolicitud = this.activos.filter((a) =>
      solicitud.activosSeleccionados.includes(a.uid)
    );

    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
    this.solicitudSeleccionada = null;
    this.activosSolicitud = [];
  }

  async aprobarSolicitud(solicitud: any) {
    try {
      await this.solicitarPrestamoService.actualizarEstado(solicitud.id, 'Aprobado');
      this.toastService.present(
        `Solicitud ${solicitud.consecutivo} aprobada correctamente.`,
        'success'
      );
      this.cerrarModal();
      this.ngOnInit();
    } catch (error) {
      console.error('Error al aprobar solicitud:', error);
      this.toastService.present('Error al aprobar la solicitud.', 'danger');
    }
  }

  async rechazarSolicitud(solicitud: any) {
    try {
      await this.solicitarPrestamoService.actualizarEstado(solicitud.id, 'Rechazado');
      this.toastService.present(
        `Solicitud ${solicitud.consecutivo} rechazada correctamente.`,
        'warning'
      );
      this.cerrarModal();
      this.ngOnInit();
    } catch (error) {
      console.error('Error al rechazar solicitud:', error);
      this.toastService.present('Error al rechazar la solicitud.', 'danger');
    }
  }


  confirmarAccion(tipo: 'aprobar' | 'rechazar') {
  const consecutivo = this.solicitudSeleccionada?.consecutivo;
  let mensaje = '';

  if (tipo === 'aprobar') {
    mensaje = `Se procederá a aprobar la solicitud #${consecutivo}. ¿Desea continuar?`;
  } else {
    mensaje = `Se procederá a rechazar la solicitud #${consecutivo}. ¿Desea continuar?`;
  }

  const confirmado = window.confirm(mensaje);

  if (confirmado) {
    if (tipo === 'aprobar') {
      this.aprobarSolicitud(this.solicitudSeleccionada);
    } else {
      this.rechazarSolicitud(this.solicitudSeleccionada);
    }
  }
}

}