import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, serverTimestamp, doc, updateDoc, getDoc, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SolicitarPrestamoService {
  private collectionName = 'prestamos';

  constructor(private firestore: Firestore) {}

  // Crear solicitud de préstamo
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

  // Obtener el documento para leer consecutivo y activos seleccionados
  const snap = await getDoc(ref);
  const data: any = snap.exists() ? snap.data() : {};
  const consecutivo = data?.consecutivo || uid; // fallback al uid si no existe
  const activosSeleccionados: string[] = data?.activosSeleccionados || [];

  // Actualizar estado de la solicitud
  await updateDoc(ref, {
    estado: nuevoEstado,
    aprobadoPor: user?.email || null,
    fechaAprobacion: serverTimestamp()
  });

  // Si la solicitud se aprueba, marcar los activos como Prestado
  if (nuevoEstado === 'Aprobado' && activosSeleccionados.length > 0) {
    for (const activoId of activosSeleccionados) {
      const activoRef = doc(this.firestore, 'activo', activoId);
      await updateDoc(activoRef, { estado: 'Prestado' });
    }
  }

  // Registrar log con el consecutivo
  const logRef = collection(this.firestore, 'log_accion');
  await addDoc(logRef, {
    usuarioId: user?.uid || null,
    correo: user?.email || null,
    accion: 'actualizar_estado_prestamo',
    detalle: `Usuario con correo ${user?.email} ha cambiado el estado de la solicitud ${consecutivo} a ${nuevoEstado}`,
    fecha: serverTimestamp(),
    uidReferencia: uid
  });
}


}