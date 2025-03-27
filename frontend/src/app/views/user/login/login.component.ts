import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../../core/auth/auth.service';
import {LoginResponseType} from '../../../types/login-response.type';
import {DefaultErrorResponse} from '../../../types/default-error.type';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  protected loginForm: FormGroup;

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService,
              readonly snackBar: MatSnackBar,) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
    });

  }

  protected login(): void {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password, !!this.loginForm.value.rememberMe)
        .subscribe(
          {
            next: (data: LoginResponseType | DefaultErrorResponse) => {
              let error = null;
              if ((data as DefaultErrorResponse).error !== undefined) {
                error = (data as DefaultErrorResponse).message;
              }
              const loginResponse = data as LoginResponseType;

              if (!loginResponse.accessToken
                || !loginResponse.refreshToken
                || !loginResponse.userId) {
                error = 'Ошибка авторизации';
              }
              if (error) {
                this.snackBar.open(error);
                throw new Error(error)
              }
              this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
              this.authService.userId = loginResponse.userId;

              this.snackBar.open('Добро пожаловать');
              this.router.navigate(['/']);

            },
            error: (err: HttpErrorResponse) => {
              if (err.error && err.error.message) {
                this.snackBar.open(err.error.message);
              } else {
                this.snackBar.open('Ошибка авторизации');
              }
            }
          })
    }
  }
}
