import {Component, OnInit} from '@angular/core';
import {FavoriteService} from '../../../shared/services/favorite.service';
import {DefaultErrorResponse} from '../../../types/default-error.type';
import {FavoriteType} from '../../../types/favorite.types';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-favorite',
  standalone: false,
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent implements OnInit {

  products: FavoriteType[] = [];

  protected serverStaticPath = environment.serverStaticPath;

  constructor(private favoriteService: FavoriteService,) {
  }

  ngOnInit(): void {
    this.favoriteService.getFavorites()
      .subscribe((data: FavoriteType[] | DefaultErrorResponse) => {
        if ((data as DefaultErrorResponse).error !== undefined) {
          const error = (data as DefaultErrorResponse).message;
          throw new Error(error);
        }
        this.products = data as FavoriteType[];
      })
  }

  removeFromFavorites(id: string) {
    this.favoriteService.removeFavorites(id)
      .subscribe(data => {
        if (data.error) {
          throw new Error(data.message);
        }
        this.products = this.products.filter(item => item.id !== id);
      })
  }
}
