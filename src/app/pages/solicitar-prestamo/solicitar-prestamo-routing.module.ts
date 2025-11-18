import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitarPrestamoPage } from './solicitar-prestamo.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitarPrestamoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitarPrestamoPageRoutingModule {}
