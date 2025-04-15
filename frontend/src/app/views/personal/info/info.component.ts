import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentType } from '../../../types/payment.types';
import { DeliveryType } from '../../../types/delivery.types';

@Component({
  selector: 'app-info',
  standalone: false,
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoComponent implements OnInit{

  userInfoForm: FormGroup;
  deliveryType: DeliveryType = DeliveryType.delivery;
  deliveryTypes = DeliveryType;
  paymentTypes = PaymentType;

  constructor(private fb: FormBuilder){
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

    
  }

  changeDeliveryType(type: DeliveryType) {
    this.deliveryType = type;
    this.userInfoForm.markAsDirty();

  }
  updateUserInfo(){

  }
}
