import { TestBed } from '@angular/core/testing';

import { Product, ProductService } from './product.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProduct: Product = {
    id: 'p1',
    name: 'Producto 1',
    description: 'Desc 1',
    logo: 'logo.png',
    date_release: '2025-01-01',
    date_revision: '2026-01-01'
  };
  const mockProduct2: any = {
  data: [
    {
      id: 'p1',
      name: 'Producto 1',
      description: 'Desc 1',
      logo: 'logo.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01'
    }
  ]
};



  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]});
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debería obtener todos los productos', () => {
    service.getProducts().subscribe(products => {
      console.log('Recibido:', products.data);
      if(products.data !== undefined && products.data.length !== undefined){
        expect(products.data.length).toBe(1);
      }
      if(products.data !== undefined && products.data.length !== undefined){
        expect(products.data[0].id).toBe('p1');
      }
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products');
    expect(req.request.method).toBe('GET');
    req.flush([mockProduct2]);
  });

  it('debería obtener un producto por id', () => {
    service.getProductById('p1').subscribe(product => {
      expect(product.name).toBe('Producto 1');
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products/p1');
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('debería crear un producto', () => {
    service.addProduct(mockProduct).subscribe(p => {
      expect(p.id).toBe('p1');
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products');
    expect(req.request.method).toBe('POST');
    req.flush(mockProduct);
  });

  it('debería actualizar un producto', () => {
    service.updateProduct('p1',mockProduct).subscribe(p => {
      expect(p.id).toBe('p1');
    });

    const req = httpMock.expectOne(`http://localhost:3002/bp/products/${mockProduct.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockProduct);
  });

  it('debería eliminar un producto', () => {
    service.deleteProduct('p1').subscribe(res => {
      expect(res).toEqual({});
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products/p1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('debería consultar', () => {
    service.checkIdExists('p1').subscribe(p => {
       expect(p).toBeTrue();
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products/verification/p1');
    expect(req.request.method).toBe('GET');
    req.flush( true );
  });
});
