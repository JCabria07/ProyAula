import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialAprobacionesPage } from './historial-aprobaciones.page';

const routes: Routes = [
  {
    path: '',
    component: HistorialAprobacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialAprobacionesPageRoutingModule {}
