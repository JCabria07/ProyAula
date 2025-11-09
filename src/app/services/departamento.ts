import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Departamento } from 'src/app/models/departamento';
import { Observable } from 'rxjs';
import { LogService } from 'src/app/services/log'; // ✅ Importa tu LogService

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  private coleccionRef = collection(this.firestore, 'departamentos');

  constructor(
    private firestore: Firestore,
    private logService: LogService,
    
  ) {}

  
  obtenerDepartamentos(): Observable<Departamento[]> {
    return collectionData(this.coleccionRef, { idField: 'id' }) as Observable<Departamento[]>;
  }

  
  async crearDepartamento(nombre: string, usuarioEmail: string): Promise<void> {
  const nuevo: Omit<Departamento, 'id'> = { nombre };
  const docRef = await addDoc(this.coleccionRef, nuevo);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

 
  await this.logService.registrarLog(
    'crear_departamento',
    `Departamento ${nombre} creado por ${usuarioEmail}`,
    currentUser
  );
}

}