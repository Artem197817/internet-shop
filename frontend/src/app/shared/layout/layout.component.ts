import {Component, OnInit} from '@angular/core';
import {CategoryType} from '../../types/category.types';
import {CategoryService} from '../services/category.service';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit{

  protected categories: CategoryType[]=[];
  constructor(private categoryService: CategoryService) {
  }
  ngOnInit() {
    this.categoryService.getCategories()
      .subscribe((categories: CategoryType[]) => {
        this.categories = categories;
      })
  }
}
