import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Firestore, collection, addDoc, doc, updateDoc } from '@angular/fire/firestore';
import { CategoriasService } from 'src/app/services/categorias';
import { Categoria } from 'src/app/models/categoria';
import { ToastService } from 'src/app/services/toast';
import { LogService } from 'src/app/services/log';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as QRCode from 'qrcode';
import { environment } from 'src/environments/environment';

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

  fotoPreview: string[] = [];
  fotoBase64: string[] = [];

  private supabase: SupabaseClient;

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private categoriasService: CategoriasService,
    private toastService: ToastService,
    private logService: LogService
  ) {
    this.supabase = createClient(environment.supabase.url, environment.supabase.anonKey);

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
        this.fotoBase64.push(dataUrl.split(',')[1]);
      };
      reader.readAsDataURL(file);
    });
  }

  resetFoto() {
    this.fotoPreview = [];
    this.fotoBase64 = [];
  }

  private async uploadImage(fileName: string, base64: string): Promise<string | null> {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });

    const { error } = await this.supabase.storage.from('IMGs').upload(fileName, blob, {
      contentType: 'image/png',
      upsert: true
    });

    if (error) {
      console.error('Error al subir imagen:', error.message);
      return null;
    }

    const { data } = this.supabase.storage.from('IMGs').getPublicUrl(fileName);
    return data.publicUrl;
  }

  async registrarActivo() {
  if (this.activoForm.invalid) {
    this.activoForm.markAllAsTouched();
    return;
  }

  this.loading = true;

  try {
    // 1. Subir imágenes al bucket
    const urls: string[] = [];
    for (let i = 0; i < this.fotoBase64.length; i++) {
      const fileName = `activo_${Date.now()}_${i}.png`;
      const url = await this.uploadImage(fileName, this.fotoBase64[i]);
      if (url) urls.push(url);
    }

    // 2. Crear documento en Firestore
    const fecha_registro = new Date();
    const docRef = await addDoc(collection(this.firestore, 'activo'), {
      ...this.activoForm.value,
      urls,
      fecha_registro
    });

    const uid = docRef.id;

    // 3. Generar QR y subirlo
    const qrDataUrl = await QRCode.toDataURL(uid);
    const qrBase64 = qrDataUrl.split(',')[1];
    const qrFileName = `qr_${uid}.png`;
    const qrUrl = await this.uploadImage(qrFileName, qrBase64);

    if (qrUrl) {
      await updateDoc(doc(this.firestore, 'activo', uid), { urlQr: qrUrl });
    }

    // 4. Log de transacción con usuario de localStorage
    const userStr = localStorage.getItem('user');
    const usuario = userStr ? JSON.parse(userStr) : null;

    await this.logService.registrarLog(
      'crear_activo',
      `Activo ${this.activoForm.value.nombre_activo} creado correctamente`,
      usuario
    );

    // toast
    await this.toastService.present(
      `Activo ${this.activoForm.value.nombre_activo} creado correctamente`,
      'success'
    );

    this.activoForm.reset();
    this.resetFoto();
  } catch (error) {
    console.error(error);
    await this.toastService.present('Error al registrar activo', 'danger');
  } finally {
    this.loading = false;
  }
}

}