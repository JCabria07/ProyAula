import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-solicitar-prestamo',
  templateUrl: './solicitar-prestamo.page.html',
  styleUrls: ['./solicitar-prestamo.page.scss'],
  standalone: false
})
export class SolicitarPrestamoPage implements OnInit {
  form = {
    activoId: null,
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
    { uid: 'A1', nombre_activo: 'Laptop Dell', estado: 'disponible' },
    { uid: 'A2', nombre_activo: 'Proyector Epson', estado: 'disponible' },
    { uid: 'A3', nombre_activo: 'Router Cisco', estado: 'mtto' }
  ];

  constructor() {}

  ngOnInit() {
    const u = localStorage.getItem('user');
    this.form.solicitanteEmail = u ? JSON.parse(u).email : '';
  }

  recalcularDevolucion() {
    if (!this.form.fechaInicio || !this.form.dias) return;
    const inicio = new Date(this.form.fechaInicio);
    const devol = new Date(inicio);
    devol.setDate(inicio.getDate() + Number(this.form.dias));
    this.form.fechaDevolucion = devol.toISOString().split('T')[0];
    this.verificarConflictos();
  }

  verificarConflictos() {
    // Aquí podrías consultar préstamos existentes
    this.conflicto = false;
  }

  generarConsecutivoTentativo() {
    const f = new Date();
    const ymd = `${f.getFullYear()}${String(f.getMonth() + 1).padStart(2, '0')}${String(f.getDate()).padStart(2, '0')}`;
    const rand = Math.floor(Math.random() * 9000) + 1000;
    this.consecutivo = `PR-${ymd}-${rand}`;
  }

  guardarBorrador() {
    if (!this.consecutivo) this.generarConsecutivoTentativo();
    console.log('Borrador guardado:', this.form, this.consecutivo);
    alert('Borrador guardado correctamente');
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
}