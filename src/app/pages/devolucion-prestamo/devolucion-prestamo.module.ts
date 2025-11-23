import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DevolucionPrestamoPageRoutingModule } from './devolucion-prestamo-routing.module';

import { DevolucionPrestamoPage } from './devolucion-prestamo.page';
import { SharedModule } from 'src/app/shared/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DevolucionPrestamoPageRoutingModule,
    SharedModule
  ],
  declarations: [DevolucionPrestamoPage]
})
export class DevolucionPrestamoPageModule {}
