import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialAprobacionesPageRoutingModule } from './historial-aprobaciones-routing.module';

import { HistorialAprobacionesPage } from './historial-aprobaciones.page';
import { SharedModule } from 'src/app/shared/shared/shared-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialAprobacionesPageRoutingModule,
    SharedModule
  ],
  declarations: [HistorialAprobacionesPage]
})
export class HistorialAprobacionesPageModule {}
