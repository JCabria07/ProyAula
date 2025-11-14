import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListarActivosPage } from './listar-activos.page';

const routes: Routes = [
  {
    path: '',
    component: ListarActivosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListarActivosPageRoutingModule {}
