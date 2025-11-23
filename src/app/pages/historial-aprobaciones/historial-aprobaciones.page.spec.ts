import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialAprobacionesPage } from './historial-aprobaciones.page';

describe('HistorialAprobacionesPage', () => {
  let component: HistorialAprobacionesPage;
  let fixture: ComponentFixture<HistorialAprobacionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialAprobacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
