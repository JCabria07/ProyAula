import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitarPrestamoPage } from './solicitar-prestamo.page';

describe('SolicitarPrestamoPage', () => {
  let component: SolicitarPrestamoPage;
  let fixture: ComponentFixture<SolicitarPrestamoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitarPrestamoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
