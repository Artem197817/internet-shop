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

  protected userInfoForm: FormGroup;
  protected deliveryType: DeliveryType = DeliveryType.delivery;
  protected deliveryTypes = DeliveryType;
  protected paymentTypes = PaymentType;


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
        }
        this.deliveryType = userInfo.deliveryType ? userInfo.deliveryType : DeliveryType.delivery;

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
      };

      // List of optional fields to include if they have values
      const optionalFields = [
        'firstName',
        'lastName',
        'phone',
        'email',
        'street',
        'house',
        'entrance',
        'apartment',
        'fatherName'
      ];

      optionalFields.forEach(field => {
        const value = this.userInfoForm.get(field)?.value;
        if (value) {
          (paramsObject as any)[field] = value;
        }
      });

      this.userService.updateUserInfo(paramsObject).subscribe({
        next: (data: DefaultErrorResponse) => {
          if (data.error) {
            this.snackBar.open(data.message);
            throw new Error(data.message);
          }
          this.snackBar.open(data.message);
          this.userInfoForm.markAsPristine();
        },
        error: (errorResponse: HttpErrorResponse) => {
          const message = errorResponse.error?.message || 'Ошибка сохранения';
          this.snackBar.open(message);
        }
      });
    }
  }
}
