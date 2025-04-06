import {Component, OnInit} from '@angular/core';
import {CategoryType, CategoryWithTypes} from '../../types/category.types';
import {CategoryService} from '../services/category.service';
import {map} from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit{

  protected categories: CategoryWithTypes[]=[];
  constructor(private categoryService: CategoryService) {
  }
  ngOnInit() {
    this.categoryService.getCategoriesWithTypes()
      .subscribe((categories: CategoryWithTypes[]) => {
        this.categories = categories
          .map(item => {
          return Object.assign({typesUrl: item.types.map(item => item.url)}, item)
        });
      })
  }
}
