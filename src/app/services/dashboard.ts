import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, query, orderBy, limit } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  constructor(private firestore: Firestore) {}

  // Categorías
  getCategorias(): Observable<any[]> {
    const ref = collection(this.firestore, 'Categorias');
    return collectionData(ref, { idField: 'id' }) as Observable<any[]>;
  }

  // Usuarios
  getUsuarios(): Observable<any[]> {
    const ref = collection(this.firestore, 'Usuarios');
    return collectionData(ref, { idField: 'id' }) as Observable<any[]>;
  }

  // Activos
  getActivos(): Observable<any[]> {
    const ref = collection(this.firestore, 'activo');
    return collectionData(ref, { idField: 'id' }) as Observable<any[]>;
  }

  // Departamentos
  getDepartamentos(): Observable<any[]> {
    const ref = collection(this.firestore, 'departamentos');
    return collectionData(ref, { idField: 'id' }) as Observable<any[]>;
  }

 // Últimos 3 logs ordenados por fecha descendente
  getLogs(): Observable<any[]> {
    const ref = collection(this.firestore, 'log_accion'); // nombre de tu colección
    const q = query(ref, orderBy('fecha', 'desc'), limit(3));
    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }


  // Préstamos
  getPrestamos(): Observable<any[]> {
    const ref = collection(this.firestore, 'prestamos');
    return collectionData(ref, { idField: 'id' }) as Observable<any[]>;
  }
}