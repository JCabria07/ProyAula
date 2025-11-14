import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarActivoPage } from './registrar-activo.page';

describe('RegistrarActivoPage', () => {
  let component: RegistrarActivoPage;
  let fixture: ComponentFixture<RegistrarActivoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarActivoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
