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
    if(this.orderForm.valid){
    this.dialogRef = this.dialog.open(this.popup);
    this.dialogRef.backdropClick()
      .subscribe(() => {
        this.router.navigate(['/']);
      })
    }
  }

  closePopup() {
    this.dialogRef?.close();
    this.router.navigate(['/']);
  }
}
