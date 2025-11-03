import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, serverTimestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Categoria } from '../models/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private firestore = inject(Firestore);
  private collectionName = 'Categorias';

  // Obtener categorías para la gráfica
  getCategorias(): Observable<{ asset: string; amount: number }[]> {
    const ref = collection(this.firestore, this.collectionName);
    return collectionData(ref, { idField: 'id' }).pipe(
      map((categorias: any[]) =>
        categorias.map((c: Categoria) => ({
          asset: c.nombre_categoria,
          amount: 1 // cada categoría cuenta como 1
        }))
      )
    );
  }

  // Guardar categoría y registrar log
  async addCategoria(categoria: Categoria) {
    const ref = collection(this.firestore, this.collectionName);
    const docRef = await addDoc(ref, {
      ...categoria,
      fecha_creacion: serverTimestamp()
    });

    // Obtener usuario desde localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Registrar log
    const logRef = collection(this.firestore, 'log_accion');
    await addDoc(logRef, {
      usuarioId: user?.uid || null,
      correo: user?.email || null,
      accion: 'crear_categoria',
      detalle: `Usuario con correo ${user?.email} ha creado la categoría "${categoria.nombre_categoria}"`,
      fecha: serverTimestamp()
    });

    return docRef;
  }
}