import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../shared/services/product.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {Product} from '../../types/product.types';
import {OwlOptions} from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-main',
  standalone: false,
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'

})
export class MainComponent implements OnInit{

  protected bestProducts: Product[] = [];
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    margin: 24,
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

 protected reviews = [
   {
     name: 'Ирина',
     image: 'rev-1.png',
     text: 'В ассортименте я встретила все комнатные растения, которые меня интересовали. Цены - лучшие в городе. Доставка - очень быстрая и с заботой о растениях. '
   },
   {
     name: 'Анастасия',
     image: 'rev-2.png',
     text: 'Спасибо огромное! Цветок арека невероятно красив - просто бомба! От него все в восторге! Спасибо за сервис - все удобно сделано, доставили быстро. И милая открыточка приятным бонусом.'
   },
   {
     name: 'Илья',
     image: 'rev-3.png',
     text: 'Магазин супер! Второй раз заказываю курьером, доставлено в лучшем виде. Ваш ассортимент комнатных растений впечатляет! Спасибо вам за хорошую работу!'
   },
   {
     name: 'Аделина',
     image: 'rev-4.png',
     text: 'Хочу поблагодарить всю команду за помощь в подборе подарка для моей мамы! Все просто в восторге от мини-сада! А самое главное, что за ним удобно ухаживать, ведь в комплекте мне дали целую инструкцию.'
   },
   {
     name: 'Яника',
     image: 'rev-5.png',
     text: 'Спасибо большое за мою обновлённую коллекцию суккулентов! Сервис просто на 5+: быстро, удобно, недорого. Что ещё нужно клиенту для счастья?'
   },
   {
     name: 'Марина',
     image: 'rev-6.png',
     text: 'Для меня всегда важным аспектом было наличие не только физического магазина, но и онлайн-маркета, ведь не всегда есть возможность прийти на место. Ещё нигде не встречала такого огромного ассортимента!'
   },
   {
     name: 'Станислав',
     image: 'rev-7.png',
     text: 'Хочу поблагодарить консультанта Ирину за помощь в выборе цветка для моей жены. Я ещё никогда не видел такого трепетного отношения к весьма непростому клиенту, которому сложно угодить! Сервис – огонь!'
   },
 ]
  constructor(private productService: ProductService,
              private snackBar: MatSnackBar,
              private router: Router) {
  }

  ngOnInit(): void {
    this.productService.getProductsBest()
      .subscribe((bestProducts: Product[]) => {
        this.bestProducts = bestProducts;
      })
  }
}
