import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { createSwapy } from 'swapy';
import { DashboardService } from 'src/app/services/dashboard';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false
})
export class DashboardPage implements OnInit, AfterViewInit {

  @ViewChild('dashboardContainer') dashboardContainer!: ElementRef<HTMLElement>;

  // KPIs
  totalPrestamos = 0;
  prestamosAprobados = 0;
  prestamosDevueltos = 0;
  prestamosPendientes = 0;
  activosDisponibles = 0;
  totalCategorias = 0;

  // Usuario
  uid: string | null = null;
  correo: string | null = null;

  // Fecha y hora
  fechaActual: Date = new Date();

  // Listas
  ultimasSolicitudes: any[] = [];
  logs: any[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    // Actualizar fecha cada minuto
    setInterval(() => {
      this.fechaActual = new Date();
    }, 60000);

    // Usuario desde localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        this.uid = parsed.uid || null;
        this.correo = parsed.email || null;
      } catch (error) {
        console.error('Error al parsear datos de usuario desde localStorage:', error);
      }
    }

    // Categorías
    this.dashboardService.getCategorias().subscribe(categorias => {
      this.totalCategorias = categorias.length;
    });

    // Préstamos
    this.dashboardService.getPrestamos().subscribe(prestamos => {
      this.totalPrestamos = prestamos.length;
      this.prestamosPendientes = prestamos.filter(p => p.estado === 'pendiente').length;
      this.prestamosAprobados = prestamos.filter(p => p.estado === 'aprobado').length;
      this.prestamosDevueltos = prestamos.filter(p => p.estado === 'Devuelto').length;

      // Últimas solicitudes (ejemplo: últimos 5)
      this.ultimasSolicitudes = prestamos.slice(-5);
    });

    // Activos
    this.dashboardService.getActivos().subscribe(activos => {
      this.activosDisponibles = activos.filter(a => a.estado === 'disponible').length;
    });

   // Logs
    this.dashboardService.getLogs().subscribe(logs => {
    this.logs = logs; // ya vienen ordenados y limitados a 3
    });
  }

  ngAfterViewInit(): void {
    const swapy = createSwapy(this.dashboardContainer.nativeElement, { animation: 'dynamic' });

    swapy.onSwap((event) => {
      console.log('Nuevo orden:', event.newSlotItemMap.asArray);
      // Aquí podrías guardar el orden en localStorage o Firestore
    });
  }
}