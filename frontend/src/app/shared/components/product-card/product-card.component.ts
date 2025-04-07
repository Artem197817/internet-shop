import {Component, Input} from '@angular/core';
import {Product} from '../../../types/product.types';
import {NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {FormsModule} from '@angular/forms';
import {CountSelectorComponent} from '../count-selector/count-selector.component';

@Component({
  selector: 'product-card',
  standalone: true,
  templateUrl: './product-card.component.html',
  imports: [
    NgIf,
    RouterLink,
    FormsModule,
    CountSelectorComponent,
  ],
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: Product

 protected serverStaticPath = environment.serverStaticPath;
  public count: number = 1;
}
