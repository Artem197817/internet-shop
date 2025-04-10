import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
//import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from '@angular/material/snack-bar';


export const authGuard: CanActivateFn = (route, state) => {
 // const _snackBar = inject(MatSnackBarModule)
  const authService = inject(AuthService);
  const isLogged = authService.getisLoggedIn();
 // _snackBar.open('JR')
  return isLogged;

};
