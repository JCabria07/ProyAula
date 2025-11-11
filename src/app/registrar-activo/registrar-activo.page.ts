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
    // Cargar categorías desde el servicio
    this.categoriasService.getCategoriasList().subscribe(cats => {
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

  loading = false;

async registrarActivo() {
  this.loading = true;
  // 🚧 Aquí irá la lógica del servicio
  this.loading = false; }

}