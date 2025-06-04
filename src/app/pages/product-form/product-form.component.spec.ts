import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { ProductFormComponent } from './product-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { of, throwError } from 'rxjs';
export const mockProductService = {
  addProduct: jasmine.createSpy('addProduct').and.returnValue(of({})),
  updateProduct: jasmine.createSpy('updateProduct').and.returnValue(of({})),
  getProductById: jasmine.createSpy('getProductById').and.returnValue(of({})),
  loadProducts: jasmine.createSpy('loadProducts').and.returnValue(of([])),
  checkIdExists: jasmine.createSpy('checkIdExists').and.returnValue(of({ exists: true }))
};

export const mockRouter = {
  navigate: jasmine.createSpy('navigate')
};

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;

  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductFormComponent ],
        imports: [ReactiveFormsModule, HttpClientTestingModule],
        providers: [
      { provide: ProductService, useValue: mockProductService },
      { provide: Router, useValue: mockRouter },
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: { paramMap: { get: () => null } } // simular sin ID
        }
      }
    ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form initially', () => {
    expect(component.form.valid).toBe(false);
  });

  it('should validate name field with valid input', () => {
    const nameControl = component.form.get('name');
    nameControl?.setValue('Nombre válido');
    expect(nameControl?.valid).toBe(true);
  });

  it('should validate ID length', () => {
    const idControl = component.form.get('id');
    idControl?.setValue('ab');
    expect(idControl?.valid).toBe(false);
  });



  it('should detect invalid revision date (not 1 year apart)', () => {
    component.form.get('date_release')?.setValue('2025-01-01');
    component.form.get('date_revision')?.setValue('2025-06-01');
    expect(component.form.errors?.['invalidRevisionDate']).toBe(true);
  });

  it('debería enviar el formulario y navegar si es exitoso (creación)', fakeAsync(() => {
  const mockProduct = { id: '1234', name: 'Tests2', description: 'Descripcion de ', logo: 'logo.png', date_release: '2025-06-10', date_revision: '2026-06-10' };
  component.isEdit = false;
  component.form.setValue(mockProduct);

  mockProductService.addProduct.and.returnValue(of({}));

  component.submit();

  expect(mockProductService.addProduct).toHaveBeenCalledWith(mockProduct);
  expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
}));

it('debería mostrar error del servidor si ocurre un error al guardar', fakeAsync(() => {
  const mockProduct = { id: '1', name: 'Test', description: 'Desc', logo: 'logo.png', date_release: '2025-01-01', date_revision: '2026-01-01' };
  const errorMsg = '';
  component.isEdit = false;
  component.form.setValue(mockProduct);

  mockProductService.addProduct.and.returnValue(throwError(() => ({
    error: { message: errorMsg }
  })));

  component.submit();

  expect(component.serverError).toBe(errorMsg);
}));


});
