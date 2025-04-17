import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../../core/auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoginResponseType} from '../../../types/login-response.type';
import {DefaultErrorResponse} from '../../../types/default-error.type';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  protected signupForm: FormGroup;

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService,
              readonly snackBar: MatSnackBar,) {

    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$')]],
      passwordRepeat: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$')]],
      agree: [false, Validators.requiredTrue],
    });
  }

  private passwordMatchValidator(formGroup: FormGroup): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const passwordRepeat = formGroup.get('passwordRepeat')?.value;

    if (password !== passwordRepeat) {
      formGroup.get('passwordRepeat')?.setErrors({passwordMismatch: true});
      return {passwordMismatch: true};
    } else {
      formGroup.get('passwordRepeat')?.setErrors(null);
      return null;
    }
  }

  protected signup(): void {
    if (this.signupForm.valid && this.signupForm.value.email && this.signupForm.value.password && this.signupForm.value.passwordRepeat) {
      this.authService.signup(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.passwordRepeat)
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
                error = 'Ошибка регистрации';
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
                this.snackBar.open('Ошибка регистрации');
              }
            }
          })
    }
  }
}
