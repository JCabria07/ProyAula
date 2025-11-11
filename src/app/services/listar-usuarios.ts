import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Usuario } from 'src/app/models/usuario';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ListarUsuariosService {
  constructor(private firestore: Firestore) {}

  getUsuarios(): Observable<Usuario[]> {
    const usuariosRef = collection(this.firestore, 'Usuarios');
    return collectionData(usuariosRef, { idField: 'id' }).pipe(
      map((usuarios: any[]) =>
        usuarios.map(u => ({
          ...u,
          // Convertir el Timestamp a Date
          fechaCreacion: u.fechaCreacion instanceof Timestamp
            ? u.fechaCreacion.toDate()
            : u.fechaCreacion
        }))
      )
    );
  }

  async resetPassword(correo: string): Promise<void> {
    // lógica de restablecer contraseña
  }
}