import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrarActivoPage } from './registrar-activo.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrarActivoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrarActivoPageRoutingModule {}
