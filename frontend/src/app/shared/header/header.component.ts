import {Component, Input, OnInit} from '@angular/core';
import {CategoryType} from '../../types/category.types';
import {AuthService} from '../../core/auth/auth.service';
import {DefaultErrorResponse} from '../../types/default-error.type';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  protected headerTopMenuList = [
    {title: 'Главная', link: 'main'},
    {title: 'Каталог', link: 'catalog'},
    {title: 'Отзывы', link: 'reviews'},
    {title: 'Доставка и оплата', link: 'delivery'},
  ]
  isLoggedIn: boolean = false;

  @Input() categories: CategoryType[] = [];

  constructor(private authService: AuthService,
              private snackBar: MatSnackBar,
              private router: Router,) {
    this.isLoggedIn = authService.getisLoggedIn();
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    })
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: (data: DefaultErrorResponse) => {
          this.doLogout()

        },
        error: (err: HttpErrorResponse) => {
          this.doLogout()
        }
      })
  }

  private doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this.snackBar.open('Logout')
    this.router.navigate(['/'])
  }
}

// this.authService.logout()
//   .subscribe({
//     next: (data: DefaultErrorResponse) => {
//       if (data.error) {
//         this.snackBar.open('Error logout')
//         throw new Error(data.message)
//       }
//
//     },
//     error: (err: HttpErrorResponse) => {
//       if (err.error && err.error.message) {
//         this.snackBar.open(err.error.message);
//       } else {
//         this.snackBar.open('Error logout')
//       }
//     }
//   })
