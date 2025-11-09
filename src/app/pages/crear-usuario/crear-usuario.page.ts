import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario';
import { Departamento } from 'src/app/models/departamento';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { DepartamentoService } from 'src/app/services/departamento';
import { AuthService } from 'src/app/services/auth';
import { ToastService } from 'src/app/services/toast';
import { LogService } from 'src/app/services/log';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.page.html',
  styleUrls: ['./crear-usuario.page.scss'],
  standalone: false,
})
export class CrearUsuarioPage {
  usuarioForm: FormGroup;
  submitted = false;
  verPassword = false;
  verRepetir = false;
  departamentos: Departamento[] = [];

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private departamentoService: DepartamentoService,
    private authService: AuthService,
    private toastService: ToastService,
    private logService: LogService   // ✅ Inyectar correctamente el LogService
  ) {
    this.usuarioForm = this.fb.group({
      identificacion: [null, [Validators.required, Validators.min(1)]],
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      departamentoId: ['', Validators.required],
      rol: ['', Validators.required],
      contraseña: ['', [Validators.required, Validators.minLength(5)]],
      repetir: ['', Validators.required],
    });

    // Cargar departamentos al iniciar
    this.departamentoService.obtenerDepartamentos().subscribe(deptos => {
      this.departamentos = deptos;
    });
  }

  coincidenContrasenas(): boolean {
    return this.usuarioForm.value.contraseña === this.usuarioForm.value.repetir;
  }

  async crearUsuario() {
    this.submitted = true;
    if (this.usuarioForm.invalid || !this.coincidenContrasenas()) return;

    const { correo, contraseña, repetir, ...datosUsuario } = this.usuarioForm.value;

    try {
      const cred = await this.authService.register(correo, contraseña);
      const uid = cred.user.uid;

      const nuevoUsuario: Usuario = {
        ...datosUsuario,
        fechaCreacion: new Date(),
      };

      await addDoc(collection(this.firestore, 'Usuarios'), {
        uid,
        ...nuevoUsuario,
      });

      this.toastService.present(`Usuario ${datosUsuario.nombre} creado correctamente`, 'success');
      this.usuarioForm.reset();          // Limpia todos los campos
      this.submitted = false; 
    } catch (error) {
      console.error('Error al crear usuario:', error);
      this.toastService.present('Error al crear usuario', 'danger');
    }
  }

  async abrirModalDepartamento() {
  const nombre = prompt('Nombre del nuevo departamento:');
  if (nombre && nombre.trim()) {
    try {
      // Recuperar usuario actual desde localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const actorEmail = currentUser?.email || 'sistema';
      await this.departamentoService.crearDepartamento(nombre.trim(), actorEmail);

      this.toastService.present(`Departamento ${nombre.trim()} creado correctamente`, 'success');
    } catch (error) {
      console.error('Error al crear departamento:', error);
      this.toastService.present('Error al crear departamento', 'danger');
    }
  }
}

}