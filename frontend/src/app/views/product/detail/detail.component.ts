import {Component, OnInit} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {Product} from '../../../types/product.types';
import {ProductService} from '../../../shared/services/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import { environment } from '../../../../environments/environment';
import {count} from 'rxjs';

@Component({
  selector: 'app-detail',
  standalone: false,
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {

  count:number = 1
  protected bestProducts: Product[] = [];
  protected product!: Product;
  protected serverStaticPath = environment.serverStaticPath;
  protected customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    margin: 26,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },

      940: {
        items: 4
      }
    },
    nav: false
  }

  constructor(private productService: ProductService,
              private router: Router,
              private activatedRoute: ActivatedRoute,) {}


  ngOnInit() {
    this.activatedRoute.params
    .subscribe(params => {
      this.productService.getProduct(params['url'])
      .subscribe((data: Product) => {
        this.product= data;
      })
    })


    this.productService.getProductsBest()
      .subscribe((bestProducts: Product[]) => {
        this.bestProducts = bestProducts;
      })
  }
  updateCount(value: number){
    this.count = value;
  }

  addToCart(){

  }
}
