import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria } from '../../models/categoria';
import { SpinnerService } from 'src/app/services/spinner';
import { CategoriasService } from 'src/app/services/categorias';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
  standalone: false,
})
export class CategoriasPage implements OnInit {
  public formCategoria!: FormGroup;
  public formEditarCategoria!: FormGroup;
  public loading: boolean = false;
  public categorias: Categoria[] = [];
  public categoriaOriginal!: Categoria;
  public cambioDetectado: boolean = false;
  public isEditOpen: boolean = false; 

  constructor(
    private fb: FormBuilder,
    private spinnerService: SpinnerService,
    private categoriasService: CategoriasService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    // Formulario de creación
    this.formCategoria = this.fb.group({
      nombre_categoria: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      descripcion_categoria: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
    });

    // Formulario de edición
    this.formEditarCategoria = this.fb.group({
      nombre_categoria: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      descripcion_categoria: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
    });

    // Detectar cambios en el formulario de edición
    this.formEditarCategoria.valueChanges.subscribe(val => {
      this.cambioDetectado = this.categoriaOriginal
        ? val.nombre_categoria !== this.categoriaOriginal.nombre_categoria ||
          val.descripcion_categoria !== this.categoriaOriginal.descripcion_categoria
        : false;
    });

    this.spinnerService.loading$.subscribe(state => this.loading = state);
    this.spinnerService.showSpinner();

    // Suscribirse a las categorías
    this.categoriasService.getCategoriasList().subscribe(data => {
      this.categorias = data;
    });
  }

  // Guardar categoría
  async guardarCategoria() {
    if (this.formCategoria.invalid) return;

    const nuevaCategoria: Categoria = this.formCategoria.value;

    try {
      await this.categoriasService.addCategoria(nuevaCategoria);

      const toast = await this.toastCtrl.create({
        message: 'Registro exitoso',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();

      this.formCategoria.reset();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      const toast = await this.toastCtrl.create({
        message: 'Error al registrar la categoría',
        duration: 2000,
        color: 'danger',
        position: 'bottom'
      });
      await toast.present();
    }
  }

  // Confirmación y eliminación de categoría
  async eliminarCategoria(cat: Categoria) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmación',
      message: `¿Desea eliminar la categoría: [${cat.nombre_categoria}]?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await this.categoriasService.deleteCategoria(cat.id!, cat.nombre_categoria);
              const toast = await this.toastCtrl.create({
                message: 'Categoría eliminada correctamente',
                duration: 2000,
                color: 'success',
                position: 'bottom'
              });
              await toast.present();
            } catch (error) {
              console.error('Error al eliminar categoría:', error);
              const toast = await this.toastCtrl.create({
                message: 'Error al eliminar la categoría',
                duration: 2000,
                color: 'danger',
                position: 'bottom'
              });
              await toast.present();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  // Abrir modal de edición
  abrirModalEditar(cat: Categoria) {
    this.categoriaOriginal = { ...cat };
    this.formEditarCategoria.patchValue({
      nombre_categoria: cat.nombre_categoria,
      descripcion_categoria: cat.descripcion_categoria
    });
    this.isEditOpen = true; 
  }

  // Cerrar modal
  cerrarModalEditar() {
    this.isEditOpen = false;
  }

  // Guardar cambios de edición
  async guardarEdicion() {
    if (!this.categoriaOriginal?.id || this.formEditarCategoria.invalid || !this.cambioDetectado) return;

    try {
      await this.categoriasService.updateCategoria(this.categoriaOriginal.id, this.formEditarCategoria.value);

      const toast = await this.toastCtrl.create({
        message: 'Categoría editada correctamente',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();

      this.cerrarModalEditar();
    } catch (error) {
      console.error('Error al editar categoría:', error);
      const toast = await this.toastCtrl.create({
        message: 'Error al editar la categoría',
        duration: 2000,
        color: 'danger',
        position: 'bottom'
      });
      await toast.present();
    }
  }
}