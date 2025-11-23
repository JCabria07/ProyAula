import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DevolucionPrestamoPage } from './devolucion-prestamo.page';

describe('DevolucionPrestamoPage', () => {
  let component: DevolucionPrestamoPage;
  let fixture: ComponentFixture<DevolucionPrestamoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DevolucionPrestamoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
