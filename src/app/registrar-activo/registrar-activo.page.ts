import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Firestore } from '@angular/fire/firestore';
import { CategoriasService } from 'src/app/services/categorias';
import { Categoria } from 'src/app/models/categoria';
import { ToastService } from 'src/app/services/toast';
import { LogService } from 'src/app/services/log';

@Component({
  selector: 'app-registrar-activo',
  templateUrl: './registrar-activo.page.html',
  styleUrls: ['./registrar-activo.page.scss'],
  standalone: false
})
export class RegistrarActivoPage implements OnInit {
  activoForm: FormGroup;
  categorias: Categoria[] = [];
  loading = false;

  // Ahora arrays para múltiples imágenes
  fotoPreview: string[] = [];
  fotoBase64: string[] = [];

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private categoriasService: CategoriasService,
    private toastService: ToastService,
    private logService: LogService
  ) {
    this.activoForm = this.fb.group({
      nombre_activo: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      estado: ['', Validators.required],
      categoriaId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.categoriasService.getCategoriasList().subscribe((cats) => {
      this.categorias = cats;
    });
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

  // Selección de archivos (múltiples imágenes)
  FileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) {
      this.fotoPreview = [];
      this.fotoBase64 = [];
      return;
    }

    this.fotoPreview = [];
    this.fotoBase64 = [];

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        this.fotoPreview.push(dataUrl);
        this.fotoBase64.push(dataUrl.split(',')[1]); // solo base64
      };
      reader.readAsDataURL(file);
    });
  }

  // Resetear imágenes seleccionadas
  resetFoto() {
    this.fotoPreview = [];
    this.fotoBase64 = [];
  }

  async registrarActivo() {
    if (this.activoForm.invalid) {
      this.activoForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const activo = {
      ...this.activoForm.value,
      fotos: this.fotoBase64, // ahora es un array
      fecha_registro: new Date()
    };

    try {
      // 🚧 Persistencia (Firestore o Supabase) va aquí
      console.log('Activo registrado:', activo);

      // Feedback y logs (descomenta si tus servicios están listos)
      // this.toastService.success('Activo registrado correctamente');
      // this.logService.log('registro_activo', { ...activo, fotos: this.fotoBase64.length });

      // Limpieza
      this.activoForm.reset();
      this.resetFoto();
    } catch (error) {
      console.error(error);
      // this.toastService.error('Error al registrar activo');
    } finally {
      this.loading = false;
    }
  }
}