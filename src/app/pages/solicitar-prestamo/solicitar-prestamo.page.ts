import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ListarActivosService } from 'src/app/services/listar-activos';
import { SolicitarPrestamoService } from 'src/app/services/solicitar-prestamo';
import { ToastService } from 'src/app/services/toast';

@Component({
  selector: 'app-solicitar-prestamo',
  templateUrl: './solicitar-prestamo.page.html',
  styleUrls: ['./solicitar-prestamo.page.scss'],
  standalone: false
})
export class SolicitarPrestamoPage implements OnInit {
  form!: FormGroup;
  consecutivo: string | null = null;
  loading = false;
  conflicto = false;

  isConfirmOpen = false;
  confirmButtons = [
    { text: 'Cancelar', role: 'cancel' },
    { text: 'Enviar', role: 'confirm', handler: () => this.procesarEnvio() }
  ];

  activosDisponibles: any[] = [];
  activosDisponiblesFiltrados: any[] = [];
  minDate: string = '';

  constructor(
    private fb: FormBuilder,
    private listarActivosService: ListarActivosService,
    private solicitarPrestamoService: SolicitarPrestamoService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    const u = localStorage.getItem('user');
    const email = u ? JSON.parse(u).email : '';

    this.form = this.fb.group({
      activosSeleccionados: this.fb.array([], Validators.required),
      fechaInicio: ['', Validators.required],
      dias: [1, [Validators.required, Validators.min(1), Validators.max(30)]],
      fechaDevolucion: [{ value: '', disabled: true }],
      solicitanteEmail: [email, [Validators.required, Validators.email]],
      observaciones: ['', [Validators.required, Validators.maxLength(500)]]
    });

    this.listarActivosService.getActivos().subscribe((data) => {
      this.activosDisponibles = data;
      this.activosDisponiblesFiltrados = data.filter(a => a.estado === 'disponible');
    });

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  get activosSeleccionados(): FormArray {
    return this.form.get('activosSeleccionados') as FormArray;
  }

  toggleActivoSeleccionado(event: any) {
    const uid = event.target.value;
    if (event.target.checked) {
      this.activosSeleccionados.push(this.fb.control(uid));
    } else {
      const index = this.activosSeleccionados.controls.findIndex(c => c.value === uid);
      this.activosSeleccionados.removeAt(index);
    }
  }

  recalcularDevolucion() {
    const fechaInicio = this.form.get('fechaInicio')?.value;
    const dias = this.form.get('dias')?.value;

    if (!fechaInicio || !dias) return;

    if (dias > 30) this.form.patchValue({ dias: 30 });
    if (dias < 1) this.form.patchValue({ dias: 1 });

    const inicio = new Date(fechaInicio);
    const devol = new Date(inicio);
    devol.setDate(inicio.getDate() + Number(this.form.get('dias')?.value));
    this.form.patchValue({ fechaDevolucion: devol.toISOString().split('T')[0] });
    this.verificarConflictos();
  }

  verificarConflictos() {
    this.conflicto = false;
  }

  generarConsecutivoTentativo() {
    const last = localStorage.getItem('ultimoConsecutivo');
    let counter = last ? parseInt(last, 10) : 0;
    counter++;
    localStorage.setItem('ultimoConsecutivo', counter.toString());
    const num = String(counter).padStart(3, '0');
    this.consecutivo = `PR-${num}`;
  }

  enviarSolicitud() {
    this.isConfirmOpen = true;
  }

  async procesarEnvio() {
    this.loading = true;
    try {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        this.loading = false;
        return;
      }

      if (!this.consecutivo) this.generarConsecutivoTentativo();

      await this.solicitarPrestamoService.crearPrestamo({
        ...this.form.value,
        consecutivo: this.consecutivo!
      });

      // Toast de éxito
      this.toastService.present(
        `Solicitud de préstamo con Código: ★[${this.consecutivo}]. Creado correctamente.`,
        'success'
      );
    } catch (e) {
      console.error('Error al enviar la solicitud', e);

      // Toast de error
      this.toastService.present(
        'Error al crear la solicitud de préstamo. Intente nuevamente.',
        'danger'
      );
    } finally {
      this.loading = false;
    }
  }

  estadoColorClass(estado: string): string {
    switch (estado) {
      case 'disponible': return 'bg-success text-white bi bi-check-circle';
      case 'prestado': return 'bg-primary text-white bi bi-arrow-left-right';
      default: return 'bg-secondary text-white bi bi-question-circle';
    }
  }
}