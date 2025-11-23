import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'categorias',
    loadChildren: () => import('./pages/categorias/categorias.module').then( m => m.CategoriasPageModule)
  },
  {
    path: 'log',
    loadChildren: () => import('./pages/log/log.module').then( m => m.LogPageModule)
  },
  {
    path: 'crear-usuario',
    loadChildren: () => import('./pages/crear-usuario/crear-usuario.module').then( m => m.CrearUsuarioPageModule)
  },
  {
    path: 'listar-usuarios',
    loadChildren: () => import('./pages/listar-usuarios/listar-usuarios.module').then( m => m.ListarUsuariosPageModule)
  },
  {
    path: 'registrar-activo',
    loadChildren: () => import('./pages/registrar-activo/registrar-activo.module').then( m => m.RegistrarActivoPageModule)
  },
  {
    path: 'listar-activos',
    loadChildren: () => import('./pages/listar-activos/listar-activos.module').then( m => m.ListarActivosPageModule)
  },  {
    path: 'solicitar-prestamo',
    loadChildren: () => import('./pages/solicitar-prestamo/solicitar-prestamo.module').then( m => m.SolicitarPrestamoPageModule)
  },
  {
    path: 'historial-aprobaciones',
    loadChildren: () => import('./pages/historial-aprobaciones/historial-aprobaciones.module').then( m => m.HistorialAprobacionesPageModule)
  },
  {
    path: 'devolucion-prestamo',
    loadChildren: () => import('./pages/devolucion-prestamo/devolucion-prestamo.module').then( m => m.DevolucionPrestamoPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
