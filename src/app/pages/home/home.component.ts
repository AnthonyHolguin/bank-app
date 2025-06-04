import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  productToDelete: Product | null = null;
  openMenuId: string | null = null;
  searchText: string = '';
  errorMessage = '';
  products: Product[] = [];
  paginatedProducts: Product[] = [];
  pageSize = 5;
  pageSizes = [5, 10, 20];

  showDeleteModal = false;

  constructor(private productService: ProductService,private router: Router ) {}

  ngOnInit(): void {
    this.loadProducts();
  }
  search(): void {
if (!this.searchText.trim()) return;

  this.productService.getProductById(this.searchText.trim()).subscribe({
    next: (resp) => {
      this.products =  [resp];
      console.log(this.products)

      this.errorMessage = '';
    },
    error: () => {
      this.products = [];
      this.errorMessage = 'No se encontró el producto.';
    }
  });
  }

  

  updatePagination(): void {
  this.paginatedProducts = this.products.slice(0, this.pageSize);
  }
  
  
  /**
   * toggle to expand menu
   * @param id 
   */
  toggleMenu(id: string): void {
    this.openMenuId = this.openMenuId === id ? null : id;
  }
  /**
   * method to redirect to form editar
   * @param id 
   */
  editProduct(id: string): void {
    this.router.navigate(['/editar', id]);
  }

  /**
   * Method to open modal
   * @param product 
   */
openDeleteModal(product: Product): void {
  this.productToDelete = product;
  this.showDeleteModal = true;
}

/**
 * Method to confirm delete
 * @returns 
 */
confirmDelete(): void {
  if (!this.productToDelete) return;

  this.productService.deleteProduct(this.productToDelete.id).subscribe({
    next: () => {
      alert(`Producto "${this.productToDelete?.name}" eliminado.`);
      this.showDeleteModal = false;
      this.productToDelete = null;
      this.loadProducts(); // recarga la tabla
    },
    error: () => {
      alert('No se pudo eliminar el producto.');
      this.showDeleteModal = false;
    }
  });
}

/**
 * Method to cancel delete
 */
cancelDelete(): void {
  this.showDeleteModal = false;
  this.productToDelete = null;
}

/**
 * Method to load products
 */
loadProducts(){
  this.productService.getProducts().subscribe(response => {
      this.products = response.data;
      this.updatePagination();
    });

    this.productService.getProducts().subscribe({
      next: (resp) =>{
         this.products = resp.data;
        this.updatePagination();
      },
      error: () => {
        alert('No se pudieron obtener los productos. Error de servidor.');
        this.showDeleteModal = false;
      }
  });
}
}
