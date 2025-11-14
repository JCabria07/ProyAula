import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListarActivosPageRoutingModule } from './listar-activos-routing.module';

import { ListarActivosPage } from './listar-activos.page';
import { SharedModule } from 'src/app/shared/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListarActivosPageRoutingModule,
    SharedModule
  ],
  declarations: [ListarActivosPage]
})
export class ListarActivosPageModule {}
