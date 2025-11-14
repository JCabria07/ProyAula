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

  public filtroUsuario: string = '';
  public filtroAccion: string = '';

  public loading: boolean = false; // igual que en CategoriasPage

  constructor(
    private logService: LogService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit() {
    // Suscribirse al estado del spinner
    this.spinnerService.loading$.subscribe(state => this.loading = state);

    // Mostrar spinner al entrar
    this.spinnerService.showSpinner();

    
    this.logService.getLogs().subscribe(data => {
      this.logs = data.sort((a, b) => b.fecha?.seconds - a.fecha?.seconds);
      this.usuarios = [...new Set(this.logs.map(l => l.correo).filter(Boolean))];
      this.aplicarFiltros();
      
    });
  }

  aplicarFiltros() {
    this.logsFiltrados = this.logs.filter(log => {
      const coincideUsuario = this.filtroUsuario ? log.correo === this.filtroUsuario : true;
      const coincideAccion = this.filtroAccion ? log.accion === this.filtroAccion : true;
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
      default: return 'bi bi-info-circle text-muted';
    }
  }
}