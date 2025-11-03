import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria } from '../../models/categoria';
import { SpinnerService } from 'src/app/services/spinner';
import { CategoriasService } from 'src/app/services/categorias';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
  standalone: false,
})
export class CategoriasPage implements OnInit {
  public formCategoria!: FormGroup;
  public loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private spinnerService: SpinnerService,
    private categoriasService: CategoriasService,   
    private toastCtrl: ToastController              
  ) {}

  ngOnInit() {
    this.formCategoria = this.fb.group({
      nombre_categoria: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      descripcion_categoria: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
    });

    this.spinnerService.loading$.subscribe(state => {
      this.loading = state;
    });

    this.spinnerService.showSpinner();
  }

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
}