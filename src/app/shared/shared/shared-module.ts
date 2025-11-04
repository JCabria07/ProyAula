import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';

@NgModule({
  declarations: [NavbarComponent, FooterComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NavbarComponent,
    FooterComponent
  ]
})
export class SharedModule {}