import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../shared/services/product.service';
import {Product} from '../../../types/product.types';
import {CategoryService} from '../../../shared/services/category.service';
import {CategoryWithTypes} from '../../../types/category.types';

@Component({
  selector: 'app-catalog',
  standalone: false,
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit {

  protected products: Product[] = [];
  protected categoriesWithTypes: CategoryWithTypes[] = [];


  constructor(private productService: ProductService,
              private router: Router,
              private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params =>{
      
    })

    this.productService.getProducts()
      .subscribe(products => {
        this.products = products.items;
      })

    this.categoryService.getCategoriesWithTypes()
    .subscribe(categories => {
        this.categoriesWithTypes = categories;
    })
  }

}
