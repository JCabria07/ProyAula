import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrarActivoPageRoutingModule } from './registrar-activo-routing.module';

import { RegistrarActivoPage } from './registrar-activo.page';
import { SharedModule } from '../shared/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrarActivoPageRoutingModule,
    SharedModule
  ],
  declarations: [RegistrarActivoPage]
})
export class RegistrarActivoPageModule {}
