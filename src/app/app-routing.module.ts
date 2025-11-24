import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, noAuthGuard } from './guards/auth-guard';

const routes: Routes = [
  // Home y Login = solo si NO estás logueado
  {
    path: 'home',
    canActivate: [noAuthGuard],
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },

  // Dashboard y demás privadas = requieren sesión
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule)
  },
  {
    path: 'categorias',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/categorias/categorias.module').then(m => m.CategoriasPageModule)
  },
  {
    path: 'log',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/log/log.module').then(m => m.LogPageModule)
  },
  {
    path: 'crear-usuario',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/crear-usuario/crear-usuario.module').then(m => m.CrearUsuarioPageModule)
  },
  {
    path: 'listar-usuarios',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/listar-usuarios/listar-usuarios.module').then(m => m.ListarUsuariosPageModule)
  },
  {
    path: 'registrar-activo',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/registrar-activo/registrar-activo.module').then(m => m.RegistrarActivoPageModule)
  },
  {
    path: 'listar-activos',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/listar-activos/listar-activos.module').then(m => m.ListarActivosPageModule)
  },
  {
    path: 'solicitar-prestamo',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/solicitar-prestamo/solicitar-prestamo.module').then(m => m.SolicitarPrestamoPageModule)
  },
  {
    path: 'historial-aprobaciones',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/historial-aprobaciones/historial-aprobaciones.module').then(m => m.HistorialAprobacionesPageModule)
  },
  {
    path: 'devolucion-prestamo',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/devolucion-prestamo/devolucion-prestamo.module').then(m => m.DevolucionPrestamoPageModule)
  },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}