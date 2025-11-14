import { Component, OnInit } from '@angular/core';
import { ListarActivosService } from 'src/app/services/listar-activos';
import { CategoriasService } from 'src/app/services/categorias';
import { ToastService } from 'src/app/services/toast';
import { LogService } from 'src/app/services/log';
import { SpinnerService } from 'src/app/services/spinner';
import type { OverlayEventDetail } from '@ionic/core';

@Component({
  selector: 'app-listar-activos',
  templateUrl: './listar-activos.page.html',
  styleUrls: ['./listar-activos.page.scss'],
  standalone: false,
})
export class ListarActivosPage implements OnInit {
  activos: any[] = [];
  categorias: any[] = [];
  activoSeleccionado: any = null;
  activoOriginal: any = null;

  loading: boolean = false; 

  isQrOpen = false;
  isEditOpen = false;
  isConfirmOpen = false;
  isConfirmBajaOpen = false;

  alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        this.toastService.present('Cambios cancelados', 'danger');
      },
    },
    {
      text: 'Aceptar',
      role: 'confirm',
      handler: () => {
        this.confirmarGuardado();
      },
    },
  ];

  alertBajaButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        this.toastService.present('Acción cancelada', 'danger');
      },
    },
    {
      text: 'Dar de baja',
      role: 'confirm',
      handler: () => {
        this.confirmarBaja();
      },
    },
  ];

  constructor(
    private listarActivosService: ListarActivosService,
    private categoriasService: CategoriasService,
    private toastService: ToastService,
    private logService: LogService,
    private spinnerService: SpinnerService 
  ) {}

  ngOnInit() {
    // Suscribirse al estado del spinner
    this.spinnerService.loading$.subscribe(state => this.loading = state);

    // Mostrar spinner al entrar
    this.spinnerService.showSpinner();

    // Cargar activos
    this.listarActivosService.getActivos().subscribe((data) => {
      this.activos = data;
    });

    // Cargar categorías
    this.categoriasService.getCategoriasList().subscribe((cats) => {
      this.categorias = cats;
    });
  }

  abrirQrModal(activo: any) {
    this.activoSeleccionado = { ...activo };
    this.isQrOpen = true;
  }

  cerrarQrModal() {
    this.isQrOpen = false;
    this.activoSeleccionado = null;
  }

  abrirEditarModal(activo: any) {
    this.activoSeleccionado = { ...activo };
    this.activoOriginal = { ...activo };
    this.isEditOpen = true;
  }

  cerrarEditarModal() {
    this.isEditOpen = false;
    this.activoSeleccionado = null;
    this.activoOriginal = null;
  }

  async guardarCambios() {
    if (!this.activoSeleccionado) return;

    const iguales = JSON.stringify(this.activoSeleccionado) === JSON.stringify(this.activoOriginal);
    if (iguales) {
      this.toastService.present('No se detectaron cambios', 'warning');
      return;
    }

    this.isConfirmOpen = true;
  }

  async confirmarGuardado() {
    try {
      await this.listarActivosService.editarActivo(this.activoSeleccionado.uid, {
        categoriaId: this.activoSeleccionado.categoriaId,
        descripcion: this.activoSeleccionado.descripcion,
        estado: this.activoSeleccionado.estado,
        nombre_activo: this.activoSeleccionado.nombre_activo
      });

      const userData = localStorage.getItem('user');
      const email = userData ? JSON.parse(userData).email : null;

      await this.logService.registrarLog(
        'editar_activo',
        `Activo "${this.activoSeleccionado.nombre_activo}" actualizado`,
        { uid: this.activoSeleccionado.uid, email }
      );

      this.toastService.present(`Activo "${this.activoSeleccionado.nombre_activo}" actualizado correctamente`, 'success');
      this.cerrarEditarModal();
    } catch (error) {
      this.toastService.present('Error al guardar los cambios', 'danger');
    }
  }

  onConfirmDismiss(event: CustomEvent<OverlayEventDetail>) {
    this.isConfirmOpen = false;
  }

  abrirConfirmBaja(activo: any) {
    this.activoSeleccionado = { ...activo };
    this.isConfirmBajaOpen = true;
  }

  async confirmarBaja() {
    try {
      await this.listarActivosService.darDeBaja(this.activoSeleccionado.uid);

      const userData = localStorage.getItem('user');
      const email = userData ? JSON.parse(userData).email : null;

      await this.logService.registrarLog(
        'baja_activo',
        `Activo "${this.activoSeleccionado.nombre_activo}" dado de baja`,
        { uid: this.activoSeleccionado.uid, email }
      );

      this.toastService.present(`Activo "${this.activoSeleccionado.nombre_activo}" dado de baja`, 'success');
      this.activoSeleccionado = null;
    } catch (error) {
      this.toastService.present('Error al dar de baja el activo', 'danger');
    }
  }

  onConfirmBajaDismiss(event: CustomEvent<OverlayEventDetail>) {
    this.isConfirmBajaOpen = false;
  }

  estadoColorClass(estado: string): string {
    switch (estado) {
      case 'disponible': return 'bg-success text-white';
      case 'prestado': return 'bg-primary text-white';
      case 'mtto': return 'bg-warning text-dark';
      case 'dado de baja': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  }

  estadoIcon(estado: string): string {
    switch (estado) {
      case 'disponible': return 'bi bi-check-circle';
      case 'prestado': return 'bi bi-arrow-left-right';
      case 'mtto': return 'bi bi-tools';
      case 'dado de baja': return 'bi bi-x-circle';
      default: return 'bi bi-question-circle';
    }
  }
}