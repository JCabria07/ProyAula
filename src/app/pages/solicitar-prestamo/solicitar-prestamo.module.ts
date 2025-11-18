import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitarPrestamoPageRoutingModule } from './solicitar-prestamo-routing.module';

import { SolicitarPrestamoPage } from './solicitar-prestamo.page';
import { SharedModule } from 'src/app/shared/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitarPrestamoPageRoutingModule,
    SharedModule
  ],
  declarations: [SolicitarPrestamoPage]
})
export class SolicitarPrestamoPageModule {}
