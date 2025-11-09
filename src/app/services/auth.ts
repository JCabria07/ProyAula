import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, UserCredential} from '@angular/fire/auth';

import { 
  Firestore, 
  collection, 
  addDoc, 
  serverTimestamp 
} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  // Login con email y contraseña
async login(email: string, password: string): Promise<UserCredential> {
  const cred = await signInWithEmailAndPassword(this.auth, email, password);
  const user = cred.user;

  // Guardar datos básicos en localStorage
  const userData = { uid: user.uid, email: user.email };
  localStorage.setItem('user', JSON.stringify(userData));

  // Registrar log en la colección log_accion
  await addDoc(collection(this.firestore, 'log_accion'), {
    usuarioId: user.uid,
    correo: user.email, 
    accion: 'login',
    detalle: `Usuario con correo ${user.email} inició sesión`, 
    fecha: serverTimestamp()
  });

  return cred;
}


  /// Registro con email y contraseña
async register(email: string, password: string): Promise<UserCredential> {
  const cred = await createUserWithEmailAndPassword(this.auth, email, password);
  const user = cred.user;

  // NO guardamos en localStorage, porque el actor es el admin
  // const userData = { uid: user.uid, email: user.email };
  // localStorage.setItem('user', JSON.stringify(userData));

  // Registrar log en la colección log_accion
  await addDoc(collection(this.firestore, 'log_accion'), {
    usuarioId: user.uid,
    correo: user.email,
    accion: 'register',
    detalle: `Usuario con correo ${user.email} se registró`,
    fecha: serverTimestamp()
  });

  return cred;
}



  // Cerrar sesión
  async logout() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (user?.uid && user?.email) {
    await addDoc(collection(this.firestore, 'log_accion'), {
      usuarioId: user.uid,
      accion: 'logout',
      detalle: `Usuario con correo ${user.email} ha cerrado sesión`,
      fecha: serverTimestamp()
    });
  }
    // limpiar lokaltorage
  localStorage.removeItem('user');
  return signOut(this.auth);
}


  // Login con Google
async loginWithGoogle(): Promise<UserCredential> {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(this.auth, provider);
  const user = cred.user;

  // Guardar datos básicos en localStorage
  const userData = { uid: user.uid, email: user.email };
  localStorage.setItem('user', JSON.stringify(userData));

  // Registrar log en la colección log_accion
  await addDoc(collection(this.firestore, 'log_accion'), {
    usuarioId: user.uid,
    correo: user.email, 
    accion: 'login_google',
    detalle: `Usuario con correo ${user.email} inició sesión con Google`, 
    fecha: serverTimestamp()
  });

  return cred;
}

  



}