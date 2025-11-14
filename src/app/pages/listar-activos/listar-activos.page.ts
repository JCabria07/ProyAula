import { Component, OnInit } from '@angular/core';
import { ListarActivosService } from 'src/app/services/listar-activos';
import { CategoriasService } from 'src/app/services/categorias';

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

  isQrOpen = false;
  isEditOpen = false;

  constructor(
    private listarActivosService: ListarActivosService,
    private categoriasService: CategoriasService
  ) {}

  ngOnInit() {
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
    this.isEditOpen = true;
  }

  cerrarEditarModal() {
    this.isEditOpen = false;
    this.activoSeleccionado = null;
  }

  async guardarCambios() {
    if (!this.activoSeleccionado) return;
    await this.listarActivosService.editarActivo(this.activoSeleccionado.uid, {
      categoriaId: this.activoSeleccionado.categoriaId,
      descripcion: this.activoSeleccionado.descripcion,
      estado: this.activoSeleccionado.estado,
      nombre_activo: this.activoSeleccionado.nombre_activo
    });
    this.cerrarEditarModal();
    console.log(`Activo ${this.activoSeleccionado.uid} actualizado correctamente`);
  }

  async darDeBaja(uid: string) {
    await this.listarActivosService.darDeBaja(uid);
    console.log(`Activo ${uid} dado de baja`);
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