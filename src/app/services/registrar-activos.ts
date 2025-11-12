import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc } from '@angular/fire/firestore';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as QRCode from 'qrcode';
import { environment } from 'src/environments/environment';
import { LogService } from './log';

@Injectable({
  providedIn: 'root'
})
export class RegistrarActivosService {
  private supabase: SupabaseClient;

  constructor(private firestore: Firestore, private logService: LogService) {
    this.supabase = createClient(environment.supabase.url, environment.supabase.anonKey);
  }

  // Subir una imagen al bucket
  private async uploadImage(fileName: string, base64: string): Promise<string | null> {
    try {
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
    } catch (err) {
      console.error('Error en uploadImage:', err);
      return null;
    }
  }

  // 🔹 Registrar activo completo
  async registrarActivo(activoData: {
    nombre: string;
    descripcion: string;
    estado: string;
    categoriaId: string;
    fotosBase64: string[];
  }) {
    try {
      // 1. Subir imágenes al bucket
      const urls: string[] = [];
      for (let i = 0; i < activoData.fotosBase64.length; i++) {
        const fileName = `activo_${Date.now()}_${i}.png`;
        const url = await this.uploadImage(fileName, activoData.fotosBase64[i]);
        if (url) urls.push(url);
      }

      // 2. Crear documento en Firestore
      const fecha_creacion = new Date();
      const docRef = await addDoc(collection(this.firestore, 'activo'), {
        nombre: activoData.nombre,
        descripcion: activoData.descripcion,
        estado: activoData.estado,
        categoriaId: activoData.categoriaId,
        urls,
        fecha_creacion
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

      return { uid, urls, qrUrl };
    } 
    
    catch (error) {
      console.error('Error al registrar activo:', error);
      throw error;
    }
  }
}