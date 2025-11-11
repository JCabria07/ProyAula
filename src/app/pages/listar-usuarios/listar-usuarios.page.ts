import { Component, OnInit } from '@angular/core';
import { ListarUsuariosService } from 'src/app/services/listar-usuarios';
import { SpinnerService } from 'src/app/services/spinner';
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

  // 🔹 Variables para el modal
  modalAbierto = false;
  usuarioSeleccionado: Usuario | null = null;

  constructor(
    private listarUsuariosService: ListarUsuariosService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit() {
    // 🔹 Suscribirse al estado del spinner
    this.spinnerService.loading$.subscribe(value => {
      this.loading = value;
    });

    // 🔹 Mostrar spinner y cargar usuarios
    this.spinnerService.showSpinner();
    this.listarUsuariosService.getUsuarios().subscribe(data => {
      this.usuarios = data;
      // El spinner se oculta automáticamente después de 0.5s (por tu servicio)
    });
  }

  async restablecerPassword(usuario: Usuario) {
    this.spinnerService.showSpinner();
    try {
      await this.listarUsuariosService.resetPassword(usuario.correo);
      console.log(`Correo de restablecimiento enviado a ${usuario.correo}`);
    } catch (error) {
      console.error(error);
    }
  }

  // 🔹 Abrir modal con la info del usuario
  abrirModal(usuario: Usuario) {
    this.usuarioSeleccionado = usuario;
    this.modalAbierto = true;
  }

  // 🔹 Cerrar modal
  cerrarModal() {
    this.modalAbierto = false;
    this.usuarioSeleccionado = null;
  }
}