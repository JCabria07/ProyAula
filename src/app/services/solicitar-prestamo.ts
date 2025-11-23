import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, serverTimestamp, doc, updateDoc, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SolicitarPrestamoService {
  private collectionName = 'prestamos';

  constructor(private firestore: Firestore) {}

  // 🔹 Crear solicitud de préstamo
  async crearPrestamo(prestamoData: {
    activosSeleccionados: string[];
    fechaInicio: string;
    dias: number;
    fechaDevolucion: string;
    solicitanteEmail: string;
    observaciones: string;
    consecutivo: string;
  }) {
    const ref = collection(this.firestore, this.collectionName);
    const docRef = await addDoc(ref, {
      ...prestamoData,
      fechaCreacion: serverTimestamp(),
      estado: 'Por aprobar'
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const logRef = collection(this.firestore, 'log_accion');
    await addDoc(logRef, {
      usuarioId: user?.uid || null,
      correo: user?.email || null,
      accion: 'crear_prestamo',
      detalle: `Usuario con correo ${user?.email} ha creado la solicitud de préstamo ${prestamoData.consecutivo}`,
      fecha: serverTimestamp(),
      uidReferencia: docRef.id
    });

    return docRef;
  }

  // Listar todas las solicitudes
  async listarPrestamos() {
    const ref = collection(this.firestore, this.collectionName);
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Aprobar o rechazar solicitud
  async actualizarEstado(uid: string, nuevoEstado: 'Aprobado' | 'Rechazado') {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const ref = doc(this.firestore, this.collectionName, uid);
    await updateDoc(ref, {
      estado: nuevoEstado,
      aprobadoPor: user?.email || null,
      fechaAprobacion: serverTimestamp()
    });

    // Registrar log
    const logRef = collection(this.firestore, 'log_accion');
    await addDoc(logRef, {
      usuarioId: user?.uid || null,
      correo: user?.email || null,
      accion: 'actualizar_estado_prestamo',
      detalle: `Usuario con correo ${user?.email} ha cambiado el estado de la solicitud ${uid} a ${nuevoEstado}`,
      fecha: serverTimestamp(),
      uidReferencia: uid
    });
  }
}