import {Component, OnInit} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {Product} from '../../../types/product.types';
import {ProductService} from '../../../shared/services/product.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-detail',
  standalone: false,
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {

  protected bestProducts: Product[] = [];
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
              ) {}

  ngOnInit() {
    this.productService.getProductsBest()
      .subscribe((bestProducts: Product[]) => {
        this.bestProducts = bestProducts;
      })
  }
}
