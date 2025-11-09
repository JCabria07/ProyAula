export interface Usuario {
  id?: string; // UID opcional si lo usas con Firebase
  identificacion: number;
  nombre: string;
  correo: string;
  telefono: string;
  departamentoId: string; // ID del departamento seleccionado
  rol: 'admin' | 'usuario';
  fechaCreacion: Date;
}