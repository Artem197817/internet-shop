import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CartService} from '../../../shared/services/cart.service';
import {CartType} from '../../../types/cart.types';
import {DefaultErrorResponse} from '../../../types/default-error.type';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeliveryType} from '../../../types/delivery.types';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PaymentType} from '../../../types/payment.types';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { OrderService } from '../../../shared/services/order.service';
import { OrderType } from '../../../types/order-form.types';
import { HttpErrorResponse } from '@angular/common/http';
import {UserService} from '../../../shared/services/user.service';
import {UserInfoType} from '../../../types/user-info.types';
import {AuthService} from '../../../core/auth/auth.service';

@Component({
  selector: 'app-order',
  standalone: false,
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {

  cart: CartType | null = null;
  totalAmount: number = 0;
  totalCount: number = 0;
  deliveryType: DeliveryType = DeliveryType.delivery;
  deliveryTypes = DeliveryType;
  paymentTypes = PaymentType;
  orderForm: FormGroup;
  dialogRef: MatDialogRef<any> | null = null;
  @ViewChild('popup') popup!: TemplateRef<ElementRef>;

  constructor(private cartService: CartService,
              private orderService: OrderService,
              private userService: UserService,
              private authService: AuthService,
              private router: Router,
              private snackBar: MatSnackBar,
              private fb: FormBuilder,
              private dialog: MatDialog,) {


    this.orderForm = this.fb.group({

      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      fatherName: [''],
      phone: ['', Validators.required],
      paymentType: [PaymentType.cashToCourier, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      street: [''],
      house: [''],
      entrance: [''],
      apartment: [''],
      comment: [''],
    })
    this.updateDeliveryTypeValidation();
  }


  ngOnInit(): void {

    this.cartService.getCart()
      .subscribe((data: CartType | DefaultErrorResponse) => {
        if ((data as DefaultErrorResponse).error !== undefined) {
          const error = (data as DefaultErrorResponse).message;
          throw new Error(error);
        }
        this.cart = data as CartType;
        if (!this.cart || (this.cart && this.cart.items.length === 0)) {
          this.router.navigate(['/']);
          this.snackBar.open('В корзине отсутствуют товары')
          return;
        }
        this.calculateTotal();
      })

    if(this.authService.getisLoggedIn()) {
      this.userService.getUserInfo()
        .subscribe((data: UserInfoType | DefaultErrorResponse) => {
          if ((data as DefaultErrorResponse).error !== undefined) {
            throw new Error((data as DefaultErrorResponse).message);
          }
          const userInfo = data as UserInfoType;
          const paramsToUpdate = {
            firstName: userInfo.firstName ? userInfo.firstName : '',
            lastName: userInfo.lastName ? userInfo.lastName : '',
            fatherName: userInfo.fatherName ? userInfo.fatherName : '',
            phone: userInfo.phone ? userInfo.phone : '',
            paymentType: userInfo.paymentType ? userInfo.paymentType : PaymentType.cashToCourier,
            email: userInfo.email ? userInfo.email : '',
            street: userInfo.street ? userInfo.street : '',
            house: userInfo.house ? userInfo.house : '',
            entrance: userInfo.entrance ? userInfo.entrance : '',
            apartment: userInfo.apartment ? userInfo.apartment : '',
            comment: ''
          }
          this.deliveryType = userInfo.deliveryType ? userInfo.deliveryType : DeliveryType.delivery;

          this.orderForm.setValue(paramsToUpdate);
        })
    }
  }

  calculateTotal() {
    this.totalAmount = 0;
    this.totalCount = 0;
    if (this.cart) {
      this.cart.items.forEach(item => {
        this.totalAmount += item.quantity * item.product.price;
        this.totalCount += item.quantity;
      })
    }
  }

  changeDeliveryType(type: DeliveryType) {
    this.deliveryType = type;
    this.updateDeliveryTypeValidation();

  }

  updateDeliveryTypeValidation() {
    if (this.deliveryType === DeliveryType.delivery) {
      this.orderForm.get('street')?.setValidators(Validators.required);
      this.orderForm.get('house')?.setValidators(Validators.required);
    } else {
      this.orderForm.get('street')?.removeValidators(Validators.required);
      this.orderForm.get('house')?.removeValidators(Validators.required);
      this.orderForm.get('street')?.setValue('');
      this.orderForm.get('house')?.setValue('');
      this.orderForm.get('entrance')?.setValue('');
      this.orderForm.get('apartment')?.setValue('');
    }
    this.orderForm.get('street')?.updateValueAndValidity;
    this.orderForm.get('house')?.updateValueAndValidity;
  }

  createOrder() {
    if(this.orderForm.valid && this.orderForm.value.firstName && this.orderForm.value.lastName
      && this.orderForm.value.phone && this.orderForm.value.paymentType
      && this.orderForm.value.email){

        const paramsObject: OrderType ={
        deliveryType: this.deliveryType,
        firstName: this.orderForm.value.firstName ,
        lastName:this.orderForm.value.lastName ,
        phone: this.orderForm.value.phone ,
        paymentType: this.orderForm.value.paymentType,
        email: this.orderForm.value.email ,
      }
      if(this.deliveryType === DeliveryType.delivery){
          if(this.orderForm.value.street){
            paramsObject.street = this.orderForm.value.street;
          }
          if(this.orderForm.value.house){
            paramsObject.house = this.orderForm.value.house;
          }
          if(this.orderForm.value.entrance){
            paramsObject.entrance = this.orderForm.value.entrance;
          }
          if(this.orderForm.value.apartment){
            paramsObject.apartment = this.orderForm.value.apartment;
          }
      }
      if(this.orderForm.value.comment){
        paramsObject.comment = this.orderForm.value.comment;
      }
      if(this.orderForm.value.fatherName){
        paramsObject.fatherName = this.orderForm.value.fatherName;
      }

      this.orderService.createOrder(paramsObject)
      .subscribe({
        next: (data: OrderType | DefaultErrorResponse)=> {
          if((data as DefaultErrorResponse).error !== undefined){
            throw new Error((data as DefaultErrorResponse).message);
          }
          this.dialogRef = this.dialog.open(this.popup);
          this.dialogRef.backdropClick()
            .subscribe(() => {
              this.router.navigate(['/']);
            })
            this.cartService.setCount(0);
        },
        error: (errorResponse: HttpErrorResponse) => {
          if(errorResponse.error && errorResponse.error.message){
            this.snackBar.open(errorResponse.error.message);
          }else{
            this.snackBar.open('Ошибка заказа');
          }
        }
      })

    } else {
      this.orderForm.markAllAsTouched();
      this.snackBar.open('Заполните необходимые поля')
    }
  }

  closePopup() {
    this.dialogRef?.close();
    this.router.navigate(['/']);
  }
}
