import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilePickerService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabase.url, environment.supabase.anonKey);
  }


  /**
   * Sube un archivo al bucket "IMGs" de Supabase Storage
   * @param fileName nombre con el que se guardará en el bucket
   * @param base64 contenido base64 de la imagen
   * @returns URL pública del archivo subido
   */
  async uploadPhoto(fileName: string, base64: string): Promise<string | null> {
    try {
      // Convertir base64 a Blob
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });

      // Subir al bucket "IMGs"
      const { data, error } = await this.supabase.storage
        .from('IMGs')
        .upload(fileName, blob, {
          contentType: 'image/png',
          upsert: true
        });

      if (error) {
        console.error('Error al subir imagen:', error.message);
        return null;
      }

      // Obtener URL pública
      const { data: publicUrlData } = this.supabase.storage
        .from('IMGs')
        .getPublicUrl(fileName);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.error('Error en uploadPhoto:', err);
      return null;
    }
  }
}