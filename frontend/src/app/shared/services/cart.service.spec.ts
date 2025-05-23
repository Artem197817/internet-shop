import { of } from "rxjs";
import { CartService } from "./cart.service";
import { HttpClient } from "@angular/common/http";
import {environment} from '../../../environments/environment';
import { TestBed } from "@angular/core/testing";

describe('cart service',()=>{
    

    let cartService: CartService;
    const countValue = 3;
    let valueServiceSpy:jasmine.SpyObj<HttpClient>;
 
    beforeEach(()=>{
         valueServiceSpy = jasmine.createSpyObj('HttpClient',['get'])
        valueServiceSpy.get.and.returnValue(of({count: countValue}))
        

        TestBed.configureTestingModule({
            providers:[ 
                CartService,
                {provide: HttpClient, useValue: valueServiceSpy}
            ]
        })
        cartService = TestBed.inject(CartService);
    });
 
     it('should emit new count value ',(done: DoneFn)=>{

        cartService.count$.subscribe(value => {
            expect(value).toBe(countValue);
            done();
         })
         cartService.getCartCount().subscribe();
     });
     
     it('should emit false value ',(done: DoneFn)=>{
        cartService.getCart().subscribe(()=>{
           expect(valueServiceSpy.get).toHaveBeenCalledOnceWith(environment.api + 'cart', {withCredentials: true});
           done();     
        });

        });
    
      })