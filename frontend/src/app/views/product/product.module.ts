import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { CatalogComponent } from './catalog/catalog.component';
import { DetailComponent } from './detail/detail.component';
import {ProductCardComponent} from "../../shared/components/product-card/product-card.component";
import {CategoryFiltersComponent} from '../../shared/components/category-filters/category-filters.component';
import {CarouselModule} from "ngx-owl-carousel-o";
import {CountSelectorComponent} from "../../shared/components/count-selector/count-selector.component";


@NgModule({
  declarations: [
    CatalogComponent,
    DetailComponent
  ],
    imports: [
        CommonModule,
        ProductRoutingModule,
        ProductCardComponent,
        CategoryFiltersComponent,
        CarouselModule,
        CountSelectorComponent
    ]
})
export class ProductModule { }
