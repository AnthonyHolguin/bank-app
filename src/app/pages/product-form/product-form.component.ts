import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  form!: FormGroup;
  serverError = '';
  isEdit = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute,private productService: ProductService,private router: Router ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!id;

    this.form = this.fb.group({
      id: this.fb.control(
      { value: '', disabled: this.isEdit },
      [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
      this.isEdit ? [] : [this.idAsyncValidator()]),
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, this.futureOrTodayValidator()]],
      date_revision: ['', Validators.required],
      
    }, {
      validators: this.dateDiffValidator()
    });

    if (this.isEdit && id) {
      this.productService.getProductById(id).subscribe(data => {
        this.form.patchValue(data);
      });
    }
  }
  /**
   * Method to valid release date
   * @returns 
   */
futureOrTodayValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const inputDate = new Date(value+ 'T00:00:00');
    inputDate.setHours(0, 0, 0, 0); // ← Esto es clave

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log(today)
    console.log(inputDate)

    return inputDate >= today ? null : { invalidReleaseDate: true };
  };
}




  /**
   * Metho to validate revision date
   * @returns 
   */
 dateDiffValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const release = group.get('date_release')?.value;
    const revision = group.get('date_revision')?.value;

    if (!release || !revision) return null;

    const releaseDate = new Date(release);
    const revisionDate = new Date(revision);

    const isExactlyOneYear =
      revisionDate.getFullYear() === releaseDate.getFullYear() + 1 &&
      revisionDate.getMonth() === releaseDate.getMonth() &&
      revisionDate.getDate() === releaseDate.getDate();

    return isExactlyOneYear ? null : { invalidRevisionDate: true };
  };
}
  /**
   * Method to submit form
   */
  submit(): void {
    if (this.form.valid) {
    const product = this.form.getRawValue(); // para incluir ID deshabilitado
    const id = this.route.snapshot.paramMap.get('id');

    const request$ = this.isEdit
      ? this.productService.updateProduct(id!, product)
      : this.productService.addProduct(product);

    request$.subscribe({
      next: () => {
        alert(this.isEdit ? 'Producto actualizado' : 'Producto creado');
        this.router.navigate(['/home']);
      },
      error: err => {
        this.serverError = err.error?.message || 'Error al guardar';
      }
    });
  }
  }

  /** 
   * Reset form
  */
  reset(): void {
    this.form.reset();
  }

  /**
   * Get back home page
   */
  getBack(): void {
    this.router.navigate(['/home']);
  }

  /**
   * Method to valid id with async service
   * @returns 
   */
  idAsyncValidator(): AsyncValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value || control.value.length < 3) {
      return of(null); // no validar si es inválido localmente
    }

    return this.productService.checkIdExists(control.value).pipe(
      map((exists: boolean) => exists ? { idTaken: true } : null),
      catchError(() => of(null)) // evita bloquear si el backend falla
    );
  };
}


}
