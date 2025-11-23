import { Component, OnInit } from '@angular/core';
import { DevolucionPrestamo } from 'src/app/services/devolucion-prestamo';
import { ToastService } from 'src/app/services/toast';
import { ListarActivosService } from 'src/app/services/listar-activos';

@Component({
  selector: 'app-devolucion-prestamo',
  templateUrl: './devolucion-prestamo.page.html',
  styleUrls: ['./devolucion-prestamo.page.scss'],
  standalone: false
})
export class DevolucionPrestamoPage implements OnInit {

  prestamosAprobados: any[] = []; // préstamos aprobados desde Firestore
  activos: any[] = [];            // todos los activos enriquecidos
  activosSolicitud: any[] = [];   // activos filtrados de la solicitud seleccionada
  solicitudSeleccionada: any = null;
  isModalOpen: boolean = false;
  observacionesDevolucion: string = '';
  loading = false;

  constructor(
    private devolucionService: DevolucionPrestamo,
    private listarActivosService: ListarActivosService,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    this.loading = true;
    try {
      // Cargar préstamos aprobados desde el servicio
      this.prestamosAprobados = await this.devolucionService.listarPrestamosAprobados();

      // Suscribirse a activos enriquecidos
      this.listarActivosService.getActivos().subscribe((data) => {
        this.activos = data;
      });
    } catch (error) {
      console.error('Error al cargar préstamos aprobados', error);
      this.toastService.present('Error al cargar préstamos aprobados', 'danger');
    } finally {
      this.loading = false;
    }
  }

  abrirModalDevolucion(prestamo: any) {
  this.solicitudSeleccionada = prestamo;

  // Filtrar activos de la solicitud usando los UID
  this.activosSolicitud = this.activos.filter((a) =>
    prestamo.activosSeleccionados.includes(a.uid)
  );

  this.isModalOpen = true;
}


  cerrarModal() {
    this.isModalOpen = false;
    this.solicitudSeleccionada = null;
    this.activosSolicitud = [];
    this.observacionesDevolucion = '';
  }

  async confirmarDevolucion() {
    if (!this.solicitudSeleccionada) return;
    // Validar que todos los activos estén marcados como devueltos
      const todosDevueltos = this.activosSolicitud.every(a => a.devuelto === true);
      if (!todosDevueltos) {
        this.toastService.present('Error, se deben marcar todos los activos para proceder', 'danger');
        return; // detenemos el flujo
  }

  try {
    await this.devolucionService.registrarDevolucion(
      this.solicitudSeleccionada.id,
      this.observacionesDevolucion
    );

    this.toastService.present(
      `Devolución registrada correctamente para la solicitud ${this.solicitudSeleccionada.consecutivo}`,
      'success'
    );

    // Actualizar lista de préstamos aprobados
    this.prestamosAprobados = await this.devolucionService.listarPrestamosAprobados();
  } catch (error) {
    console.error('Error al registrar devolución', error);
    this.toastService.present('Error al registrar la devolución', 'danger');
  } finally {
    this.cerrarModal();
  }
}
}