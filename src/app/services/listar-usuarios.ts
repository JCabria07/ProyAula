import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Usuario } from 'src/app/models/usuario';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Timestamp } from 'firebase/firestore';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';
import { LogService } from './log'; //

@Injectable({
  providedIn: 'root'
})
export class ListarUsuariosService {
  constructor(
    private firestore: Firestore,
    private auth: Auth, // inyectar Auth
    private logService: LogService // inyectar LogService
  ) {}

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
  
  await sendPasswordResetEmail(this.auth, correo);

  // Obtener el usuario actual desde localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const actorEmail = currentUser?.email || 'sistema';
  const actorUid = currentUser?.uid || null;

  // Registrar en el log con el correo del actor
  await this.logService.registrarLog(
    'restablecer_contraseña',
    `Se envió correo de restablecimiento a ${correo}`,
    { uid: actorUid, email: actorEmail }
  );
  }
}