import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-solicitar-prestamo',
  templateUrl: './solicitar-prestamo.page.html',
  styleUrls: ['./solicitar-prestamo.page.scss'],
  standalone: false
})
export class SolicitarPrestamoPage implements OnInit {
  form = {
    activosSeleccionados: [] as string[], // varios activos
    fechaInicio: '',
    dias: 1,
    fechaDevolucion: '',
    solicitanteEmail: '',
    observaciones: ''
  };

  consecutivo: string | null = null;
  loading: boolean = false;
  conflicto: boolean = false;

  isConfirmOpen = false;
  confirmButtons = [
    { text: 'Cancelar', role: 'cancel' },
    { text: 'Enviar', role: 'confirm', handler: () => this.procesarEnvio() }
  ];

  activosDisponibles: any[] = [
    { uid: 'A1', nombre_activo: 'Laptop Dell', estado: 'disponible', url: 'assets/img/laptop.png' },
    { uid: 'A2', nombre_activo: 'Proyector Epson', estado: 'disponible', url: 'assets/img/proyector.png' },
    { uid: 'A3', nombre_activo: 'Router Cisco', estado: 'mtto', url: 'assets/img/router.png' }
  ];

  constructor() {}

  ngOnInit() {
    const u = localStorage.getItem('user');
    this.form.solicitanteEmail = u ? JSON.parse(u).email : '';
  }

  // Selección múltiple de activos
  toggleActivoSeleccionado(event: any) {
    const uid = event.target.value;
    if (event.target.checked) {
      this.form.activosSeleccionados.push(uid);
    } else {
      this.form.activosSeleccionados = this.form.activosSeleccionados.filter(id => id !== uid);
    }
  }

  // Recalcular fecha devolución
  recalcularDevolucion() {
    if (!this.form.fechaInicio || !this.form.dias) return;
    const inicio = new Date(this.form.fechaInicio);
    const devol = new Date(inicio);
    devol.setDate(inicio.getDate() + Number(this.form.dias));
    this.form.fechaDevolucion = devol.toISOString().split('T')[0];
    this.verificarConflictos();
  }

  // Verificar conflictos (ejemplo simple)
  verificarConflictos() {
    this.conflicto = false;
  }

  // Generar consecutivo tentativo
  generarConsecutivoTentativo() {
    const f = new Date();
    const ymd = `${f.getFullYear()}${String(f.getMonth() + 1).padStart(2, '0')}${String(f.getDate()).padStart(2, '0')}`;
    const rand = Math.floor(Math.random() * 9000) + 1000;
    this.consecutivo = `PR-${ymd}-${rand}`;
  }

  enviarSolicitud() {
    this.isConfirmOpen = true;
  }

  async procesarEnvio() {
    this.loading = true;
    try {
      if (!this.consecutivo) this.generarConsecutivoTentativo();
      console.log('Solicitud enviada:', this.form, this.consecutivo);
      alert('Solicitud enviada correctamente');
    } catch (e) {
      alert('Error al enviar la solicitud');
    } finally {
      this.loading = false;
    }
  }

  // Control de fechas válidas en ion-datetime
  isDateEnabled = (dateIsoString: string) => {
  const today = new Date();
  const date = new Date(dateIsoString);
  // Permite solo fechas >= hoy
  return date >= new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };


  estadoColorClass(estado: string): string {
    switch (estado) {
      case 'disponible': return 'bg-success text-white';
      case 'prestado': return 'bg-primary text-white';
      case 'mtto': return 'bg-warning text-dark';
      case 'dado de baja': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  }
}