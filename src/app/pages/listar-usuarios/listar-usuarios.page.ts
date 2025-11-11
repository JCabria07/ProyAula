import { Component, OnInit } from '@angular/core';
import { ListarUsuariosService } from 'src/app/services/listar-usuarios';
import { SpinnerService } from 'src/app/services/spinner';
import { ToastService } from 'src/app/services/toast';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-listar-usuarios',
  templateUrl: './listar-usuarios.page.html',
  styleUrls: ['./listar-usuarios.page.scss'],
  standalone: false
})
export class ListarUsuariosPage implements OnInit {
  usuarios: Usuario[] = [];
  loading = false;

  // Variables para el modal
  modalAbierto = false;
  usuarioSeleccionado: Usuario | null = null;

  constructor(
    private listarUsuariosService: ListarUsuariosService,
    private spinnerService: SpinnerService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    // Suscribirse al estado del spinner
    this.spinnerService.loading$.subscribe(value => {
      this.loading = value;
    });

    // Mostrar spinner y cargar usuarios
    this.spinnerService.showSpinner();
    this.listarUsuariosService.getUsuarios().subscribe(data => {
      this.usuarios = data;
      // El spinner se oculta automáticamente después de 0.5s
    });
  }

  async restablecerPassword(usuario: Usuario) {
    this.spinnerService.showSpinner();
    try {
      await this.listarUsuariosService.resetPassword(usuario.correo);
      this.toastService.present(`Correo de restablecimiento enviado a ${usuario.correo}`, 'success');
    } catch (error) {
      console.error(error);
      this.toastService.present('Error al enviar correo de restablecimiento', 'danger');
    }
  }

  // Abrir modal con la info del usuario
  abrirModal(usuario: Usuario) {
    this.usuarioSeleccionado = usuario;
    this.modalAbierto = true;
  }

  // Cerrar modal
  cerrarModal() {
    this.modalAbierto = false;
    this.usuarioSeleccionado = null;
  }
}