import { Component, OnInit } from '@angular/core';
import { LogService } from 'src/app/services/log';
import { SpinnerService } from 'src/app/services/spinner';

@Component({
  selector: 'app-log',
  templateUrl: './log.page.html',
  styleUrls: ['./log.page.scss'],
  standalone: false,
})
export class LogPage implements OnInit {
  public logs: any[] = [];
  public logsFiltrados: any[] = [];
  public usuarios: string[] = [];
  public acciones: string[] = [];

  public filtroUsuario: string = '';
  public filtroAccion: string = '';

  public loading: boolean = false;

  constructor(
    private logService: LogService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit() {
    this.spinnerService.loading$.subscribe(state => (this.loading = state));
    this.spinnerService.showSpinner();

    this.logService.getLogs().subscribe(data => {
      this.logs = data.sort((a, b) => b.fecha?.seconds - a.fecha?.seconds);

      // Usuarios únicos
      this.usuarios = [...new Set(this.logs.map(l => l.correo).filter(Boolean))];

      // Acciones únicas
      this.acciones = [...new Set(this.logs.map(l => l.accion).filter(Boolean))];

      this.aplicarFiltros();
    });
  }

  aplicarFiltros() {
    this.logsFiltrados = this.logs.filter(log => {
      const coincideUsuario = this.filtroUsuario
        ? log.correo === this.filtroUsuario
        : true;
      const coincideAccion = this.filtroAccion
        ? log.accion === this.filtroAccion
        : true;
      return coincideUsuario && coincideAccion;
    });
  }

  setFiltroUsuario(usuario: string) {
    this.filtroUsuario = usuario;
    this.aplicarFiltros();
  }

  setFiltroAccion(accion: string) {
    this.filtroAccion = accion;
    this.aplicarFiltros();
  }

  // Mapa de nombres amigables
  getAccionLabel(accion: string): string {
    const map: Record<string, string> = {
      crear_categoria: 'Crear categoría',
      editar_categoria: 'Editar categoría',
      eliminar_categoria: 'Eliminar categoría',
      login: 'Login',
      logout: 'Logout',
      login_google: 'Login con Google',
      register: 'Registro',
      crear_departamento: 'Crear departamento',
      crear_activo: 'Crear activo',
      restablecer_contraseña: 'Restablecer contraseña',
      registrar_devolucion: 'Registrar devolución',
      actualizar_estado_prestamo: 'Actualizar estado préstamo',
      crear_prestamo: 'Crear préstamo',
      editar_activo: 'Editar activo',
      baja_activo: 'Dar de baja activo',
      crear_usuario: 'Crear usuario',
    };
    return map[accion] || accion;
  }


  getIcon(accion: string): string {
    switch (accion) {
      case 'crear_categoria': return 'bi bi-plus-circle text-success';
      case 'editar_categoria': return 'bi bi-pencil-square text-warning';
      case 'eliminar_categoria': return 'bi bi-trash text-danger';
      case 'login': return 'bi bi-box-arrow-in-right text-primary';
      case 'logout': return 'bi bi-box-arrow-right text-secondary';
      case 'login_google': return 'bi bi-google text-danger';
      case 'register': return 'bi bi-person-plus text-success';
      case 'crear_departamento': return 'bi bi-building text-success';
      case 'crear_activo': return 'bi bi-balloon-heart-fill text-success';
      case 'restablecer_contraseña': return 'bi bi-key-fill text-warning';
      case 'registrar_devolucion': return 'bi bi-arrow-counterclockwise text-info';
      case 'actualizar_estado_prestamo': return 'bi bi-arrow-repeat text-info';
      case 'crear_prestamo': return 'bi bi-cart-plus text-success';
      case 'editar_activo': return 'bi bi-pencil-square text-warning';
      case 'baja_activo': return 'bi bi-trash text-danger';
      case 'crear_usuario': return 'bi bi-person-plus text-success';
      default: return 'bi bi-info-circle text-muted';
    }
  }
}