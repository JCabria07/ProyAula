import { Injectable } from '@angular/core';
import { Firestore, doc, updateDoc, getDoc, collection, addDoc, serverTimestamp, getDocs, query, where } from '@angular/fire/firestore';
import { ToastService } from './toast';

@Injectable({
  providedIn: 'root',
})
export class DevolucionPrestamo {
  private collectionName = 'prestamos';

  constructor(
    private firestore: Firestore,
    private toastService: ToastService
  ) {}

  // Listar préstamos aprobados
  async listarPrestamosAprobados(): Promise<any[]> {
    const ref = collection(this.firestore, this.collectionName);
    const q = query(ref, where('estado', '==', 'Aprobado'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      await this.toastService.present('No hay préstamos pendientes por devolución', 'warning');
      return [];
    }

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Registrar devolución de préstamo
  async registrarDevolucion(uid: string, observacionesDevolucion: string = ''): Promise<void> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const ref = doc(this.firestore, this.collectionName, uid);

    // Obtener datos de la solicitud
    const snap = await getDoc(ref);
    const data: any = snap.exists() ? snap.data() : {};
    const consecutivo = data?.consecutivo || uid;
    const activosSeleccionados: string[] = data?.activosSeleccionados || [];

    // Actualizar estado de la solicitud
    await updateDoc(ref, {
      estado: 'Devuelto',
      fechaDevolucionReal: serverTimestamp(),
      observacionesDevolucion,
      devueltoPor: user?.email || null
    });

    // Cambiar activos a "Disponible"
    if (activosSeleccionados.length > 0) {
      for (const activoId of activosSeleccionados) {
        const activoRef = doc(this.firestore, 'activo', activoId);
        await updateDoc(activoRef, { estado: 'disponible' });
      }
    }

    // Registrar log
    const logRef = collection(this.firestore, 'log_accion');
    await addDoc(logRef, {
      usuarioId: user?.uid || null,
      correo: user?.email || null,
      accion: 'registrar_devolucion',
      detalle: `Usuario con correo ${user?.email} ha registrado la devolución de la solicitud ${consecutivo}`,
      fecha: serverTimestamp(),
      uidReferencia: uid
    });

    // Toast de éxito
    await this.toastService.present(
      `Devolución registrada correctamente para la solicitud ${consecutivo}`,
      'success'
    );
  }
}