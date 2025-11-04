import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, serverTimestamp, collectionData} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private firestore = inject(Firestore);
  private collectionName = 'log_accion';

  // Registrar log
  async registrarLog(accion: string, detalle: string, usuario: any) {
    const ref = collection(this.firestore, this.collectionName);
    await addDoc(ref, {
      usuarioId: usuario?.uid || null,
      correo: usuario?.email || null,
      accion,
      detalle,
      fecha: serverTimestamp()
    });
  }

  // Obtener logs
  getLogs(): Observable<any[]> {
    const ref = collection(this.firestore, this.collectionName);
    return collectionData(ref, { idField: 'id' }) as Observable<any[]>;
  }
}