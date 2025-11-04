import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Categoria } from '../models/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private firestore = inject(Firestore);
  private collectionName = 'Categorias';

  // Para la gráfica
  getCategoriasChart(): Observable<{ asset: string; amount: number }[]> {
    const ref = collection(this.firestore, this.collectionName);
    return collectionData(ref, { idField: 'id' }).pipe(
      map((categorias: any[]) =>
        categorias.map((c: Categoria) => ({
          asset: c.nombre_categoria,
          amount: 1
        }))
      )
    );
  }

  // Para el listado en acordeón
  getCategoriasList(): Observable<Categoria[]> {
    const ref = collection(this.firestore, this.collectionName);
    return collectionData(ref, { idField: 'id' }) as Observable<Categoria[]>;
  }

  // Guardar categoría y registrar log
  async addCategoria(categoria: Categoria) {
    const ref = collection(this.firestore, this.collectionName);
    const docRef = await addDoc(ref, {
      ...categoria,
      fecha_creacion: serverTimestamp()
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');

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

  // Eliminar categoría y registrar log
  async deleteCategoria(id: string, nombre: string) {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    await deleteDoc(docRef);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const logRef = collection(this.firestore, 'log_accion');
    await addDoc(logRef, {
      usuarioId: user?.uid || null,
      correo: user?.email || null,
      accion: 'eliminar_categoria',
      detalle: `Usuario con correo ${user?.email} ha eliminado la categoría "${nombre}"`,
      fecha: serverTimestamp()
    });
  }

  // Editar categoría y registrar log
  async updateCategoria(id: string, data: Partial<Categoria>) {
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    await updateDoc(docRef, {
      ...data,
      fecha_actualizacion: serverTimestamp()
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const logRef = collection(this.firestore, 'log_accion');
    await addDoc(logRef, {
      usuarioId: user?.uid || null,
      correo: user?.email || null,
      accion: 'editar_categoria',
      detalle: `Usuario con correo ${user?.email} ha editado la categoría "${data.nombre_categoria}"`,
      fecha: serverTimestamp()
    });
  }
}