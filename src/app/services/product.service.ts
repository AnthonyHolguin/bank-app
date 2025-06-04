import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3002/bp/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<{ data: Product[] }> {
    return this.http.get<{ data: Product[] }>(this.apiUrl);
  }
  /**
   * Method to get products by id
   * @param id 
   * @returns 
   */
  getProductById(id: string): Observable< Product > {
   return this.http.get< Product >(`${this.apiUrl}/${id}`);
  }
  
  /**
   * Method to add new product.
   * @param data 
   * @returns 
   */
  addProduct(data: Product): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  /**
   * Method to update product
   * @param id 
   * @param product 
   * @returns 
   */
  updateProduct(id: string, product: Product): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product);
  }

  /**
   * Method to delete product
   * @param id 
   * @returns 
   */
  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Method to check if an if exists
   * @param id 
   * @returns 
   */
  checkIdExists(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verification/${id}`);
  }



}