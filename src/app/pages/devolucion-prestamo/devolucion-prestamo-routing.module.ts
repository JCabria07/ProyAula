import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevolucionPrestamoPage } from './devolucion-prestamo.page';

const routes: Routes = [
  {
    path: '',
    component: DevolucionPrestamoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevolucionPrestamoPageRoutingModule {}
