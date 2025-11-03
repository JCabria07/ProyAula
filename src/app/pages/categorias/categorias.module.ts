import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoriasPageRoutingModule } from './categorias-routing.module';

import { CategoriasPage } from './categorias.page';
import { SharedModule } from 'src/app/shared/shared/shared-module';
import { DonutschartComponent } from 'src/app/components/donutschart/donutschart.component';

import { AgChartsModule } from 'ag-charts-angular';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriasPageRoutingModule,
    SharedModule,
    AgChartsModule
    
  ],
  declarations: [CategoriasPage, DonutschartComponent]
})
export class CategoriasPageModule {}
