import {Component, Input} from '@angular/core';
import {CategoryWithTypes} from '../../types/category.types';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  protected footerTopMenuList = [
    {title: 'Главная', link: '/', fragment: ''},
    {title: 'Каталог', link: '/catalog', fragment: ''},
    {title: 'Доставка и оплата', link: '/', fragment: 'delivery'},
    {title: 'Новости', link: '/', fragment: ''},
    {title: 'Отзывы', link: '/', fragment: 'reviews'},
  ]
  @Input() categories: CategoryWithTypes[] = [];

  protected email: string = 'homedecor@gmail.com'
}
