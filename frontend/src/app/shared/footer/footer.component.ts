import {Component, Input} from '@angular/core';
import {CategoryType, CategoryWithTypes} from '../../types/category.types';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  protected footerTopMenuList = [
    {title: 'Главная', link: '/'},
    {title: 'Каталог', link: '/catalog'},
    {title: 'Доставка и оплата', link: '/delivery'},
    {title: 'Новости', link: '/news'},
    {title: 'Отзывы', link: '/reviews'},
  ]
  @Input() categories: CategoryWithTypes[]=[];

 protected email:string='homedecor@gmail.com'
}
