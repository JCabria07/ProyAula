import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialAprobacionesPageRoutingModule } from './historial-aprobaciones-routing.module';

import { HistorialAprobacionesPage } from './historial-aprobaciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialAprobacionesPageRoutingModule
  ],
  declarations: [HistorialAprobacionesPage]
})
export class HistorialAprobacionesPageModule {}
