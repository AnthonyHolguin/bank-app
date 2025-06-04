import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const mockProducts = [
    { id: 'uno', name: 'Producto Uno', description: '...', logo: '', date_release: '', date_revision: '' },
    { id: 'dos', name: 'Producto Dos', description: '...', logo: '', date_release: '', date_revision: '' }
  ];


  const mockProduct2 = {
    id: 'p1',
    name: 'Producto 1',
    description: 'Desc 1',
    logo: 'logo.png',
    date_release: '2025-01-01',
    date_revision: '2026-01-01'
  };

  
  
  const mockProductService = {
    getProducts: jasmine.createSpy('getProducts').and.returnValue(of({
      data: [
        { id: '1', name: 'Producto 1' },
        { id: '2', name: 'Producto 2' }
      ]
    })),
    loadProducts: jasmine.createSpy().and.returnValue(of(mockProducts)),
    getProductById: jasmine.createSpy().and.returnValue(of(mockProduct2))
  };

  beforeEach(async () => {


    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [FormsModule],
      providers: [{ provide: ProductService, useValue: mockProductService },]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar productos al inicializar', () => {
    expect(component.products.length).toBe(2);
    expect(mockProductService.getProducts).toHaveBeenCalled();
  });



 it('debería buscar el producto por ID (caso exitoso)', () => {
  const mockProduct = {
    id: 'p1',
    name: 'Producto 1',
    description: 'Desc 1',
    logo: 'logo.png',
    date_release: '2025-01-01',
    date_revision: '2026-01-01'
  };
  component.searchText = 'p1';
  mockProductService.getProductById.and.returnValue(of(mockProduct)); 
  
  component.search();

  expect(mockProductService.getProductById).toHaveBeenCalledWith('p1');
  expect(component.products).toEqual([mockProduct2]);
  expect(component.errorMessage).toBe('');
});

it('debería manejar error si no encuentra el producto', () => {
  component.searchText = 'p1';
  mockProductService.getProductById.and.returnValue(throwError(() => new Error('404')));

  component.search();

  expect(mockProductService.getProductById).toHaveBeenCalledWith('p1');
  expect(component.products).toEqual([]);
  expect(component.errorMessage).toBe('No se encontró el producto.');
});

it('no debería llamar al servicio si el input está vacío', () => {
  component.searchText = '   '; 
  component.search();

  expect(mockProductService.getProductById).not.toHaveBeenCalled();
});
});
