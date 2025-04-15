import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {PaymentType} from '../../../types/payment.types';
import {DeliveryType} from '../../../types/delivery.types';
import {UserService} from '../../../shared/services/user.service';
import {DefaultErrorResponse} from '../../../types/default-error.type';
import {UserInfoType} from '../../../types/user-info.types';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-info',
  standalone: false,
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoComponent implements OnInit {

  userInfoForm: FormGroup;
  deliveryType: DeliveryType = DeliveryType.delivery;
  deliveryTypes = DeliveryType;
  paymentTypes = PaymentType;


  constructor(private fb: FormBuilder,
              private userService: UserService,
              private snackBar: MatSnackBar,) {
    this.userInfoForm = this.fb.group({

      firstName: [''],
      lastName: [''],
      fatherName: [''],
      phone: [''],
      paymentType: [PaymentType.cashToCourier],
      email: [''],
      street: [''],
      house: [''],
      entrance: [''],
      apartment: [''],

    })
  }

  ngOnInit(): void {
    this.userService.getUserInfo()
    .subscribe((data: UserInfoType | DefaultErrorResponse) => {
      if((data as DefaultErrorResponse).error !== undefined){
        throw new Error((data as DefaultErrorResponse).message);
      }
     const userInfo = data as UserInfoType;
      const paramsToUpdate = {
        firstName: userInfo.firstName? userInfo.firstName : '',
        lastName: userInfo.lastName? userInfo.lastName : '',
        fatherName: userInfo.fatherName? userInfo.fatherName : '',
        phone: userInfo.phone? userInfo.phone : '',
        paymentType: userInfo.paymentType? userInfo.paymentType : PaymentType.cashToCourier,
        email: userInfo.email? userInfo.email : '',
        street: userInfo.street? userInfo.street : '',
        house: userInfo.house? userInfo.house : '',
        entrance: userInfo.entrance? userInfo.entrance : '',
        apartment: userInfo.apartment? userInfo.apartment : '',
      }
      this.deliveryType = userInfo.deliveryType? userInfo.deliveryType : DeliveryType.delivery;

      this.userInfoForm.setValue(paramsToUpdate);
    })

  }

  changeDeliveryType(type: DeliveryType) {
    this.deliveryType = type;
    this.userInfoForm.markAsDirty();

  }

  updateUserInfo() {
    if (this.userInfoForm.valid) {
      const paramsObject: UserInfoType = {
        deliveryType: this.deliveryType,
        paymentType: this.userInfoForm.get('paymentType')?.value,
      }
      if (this.userInfoForm.value.firstName) {
        paramsObject.firstName = this.userInfoForm.value.firstName;
      }
      if (this.userInfoForm.value.lastName) {
        paramsObject.lastName = this.userInfoForm.value.lastName;
      }
      if (this.userInfoForm.value.phone) {
        paramsObject.phone = this.userInfoForm.value.phone;
      }
      if (this.userInfoForm.value.email) {
        paramsObject.email = this.userInfoForm.value.email;
      }
      if (this.userInfoForm.value.street) {
        paramsObject.street = this.userInfoForm.value.street;
      }
      if (this.userInfoForm.value.house) {
        paramsObject.house = this.userInfoForm.value.house;
      }
      if (this.userInfoForm.value.entrance) {
        paramsObject.entrance = this.userInfoForm.value.entrance;
      }
      if (this.userInfoForm.value.apartment) {
        paramsObject.apartment = this.userInfoForm.value.apartment;
      }
      if (this.userInfoForm.value.fatherName) {
        paramsObject.fatherName = this.userInfoForm.value.fatherName;
      }

      this.userService.updateUserInfo(paramsObject)
        .subscribe({
          next: (data: DefaultErrorResponse) => {
            if (data.error) {
              this.snackBar.open(data.message);
              throw new Error(data.message);
            }
            this.snackBar.open(data.message);
            this.userInfoForm.markAsPristine();
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this.snackBar.open(errorResponse.error.message);
            } else {
              this.snackBar.open('Ошибка сохранения');
            }
          }
        })
    }
  }
}
