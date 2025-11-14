import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarActivosPage } from './listar-activos.page';

describe('ListarActivosPage', () => {
  let component: ListarActivosPage;
  let fixture: ComponentFixture<ListarActivosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarActivosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
