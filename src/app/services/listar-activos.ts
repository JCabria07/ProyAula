import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, doc, updateDoc } from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CategoriasService } from './categorias';

@Injectable({
  providedIn: 'root',
})
export class ListarActivosService {
  constructor(
    private firestore: Firestore,
    private categoriasService: CategoriasService
  ) {}

  // Devuelve activos enriquecidos con nombre de categoría
  getActivos(): Observable<any[]> {
    const activosRef = collection(this.firestore, 'activo'); // nombre exacto de la colección
    const activos$ = collectionData(activosRef, { idField: 'uid' }) as Observable<any[]>;
    const categorias$ = this.categoriasService.getCategoriasList();

    return combineLatest([activos$, categorias$]).pipe(
      map(([activos, categorias]) => {
        // Mapa UID -> nombre de categoría
        const catMap = new Map<string, string>();
        (categorias || []).forEach((c: any) => {
          const uid = c?.id; // viene de idField: 'id'
          const nombre = c?.nombre ?? c?.nombre_categoria ?? '';
          if (uid) catMap.set(uid, nombre);
        });

        return (activos || []).map((activo: any) => {
          // fecha_registro: Timestamp -> Date (o deja el valor si ya es Date/string)
          const fecha =
            activo?.fecha_registro?.toDate
              ? activo.fecha_registro.toDate()
              : activo?.fecha_registro ?? null;

          // urls: asegurar array
          const urls = Array.isArray(activo?.urls) ? activo.urls : [];

          // resolver nombre de categoría por UID (fallback al UID si no existe)
          const categoriaUid = activo?.categoriaId ?? '';
          const categoriaNombre = catMap.get(categoriaUid) ?? categoriaUid;

          return {
            ...activo,
            fecha_registro: fecha,
            urls,
            categoriaNombre,
          };
        });
      })
    );
  }

  // Editar activo: actualizar los campos clave
  async editarActivo(uid: string, cambios: {
    categoriaId: string;
    descripcion: string;
    estado: string;
    nombre_activo: string;
  }): Promise<void> {
    const ref = doc(this.firestore, `activo/${uid}`);
    await updateDoc(ref, {
      categoriaId: cambios.categoriaId,
      descripcion: cambios.descripcion,
      estado: cambios.estado,
      nombre_activo: cambios.nombre_activo,
    });
  }

  // Dar de baja: cambiar estado a "dado de baja"
  async darDeBaja(uid: string): Promise<void> {
    const ref = doc(this.firestore, `activo/${uid}`);
    await updateDoc(ref, { estado: 'dado de baja' });
  }
}