import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { ProductCardComponent } from "./product-card.component";
import { CartService } from "../../services/cart.service";
import { FavoriteService } from "../../services/favorite.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AuthService } from "../../../core/auth/auth.service";
import { of } from "rxjs";
import { Product } from "../../../types/product.types";
import { NO_ERRORS_SCHEMA } from "@angular/compiler";

describe('product card component', () => {

    let productCard: ProductCardComponent;
    let fixture: ComponentFixture<ProductCardComponent>;
    let product: Product;

    beforeEach(() => {
        const cartServiceSpy = jasmine.createSpyObj('CartService', ['updateCart']);
        const authServiceSpy = jasmine.createSpyObj('AuthService', ['getIsLoggedIn']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
        const favoriteServiceSpy = jasmine.createSpyObj('FavoriteService', ['removeFavorite', 'addFavorite'])

        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [ProductCardComponent],
            providers: [
                { provide: CartService, useValue: cartServiceSpy },
                { provide: AuthService, useValue: authServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: MatSnackBar, useValue: snackBarSpy },
                { provide: FavoriteService, useValue: favoriteServiceSpy },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
        fixture = TestBed.createComponent(ProductCardComponent);
        productCard = fixture.componentInstance;
        product = {
            id: 'string',
            name: 'string',
            price: 10,
            image: 'string',
            lightning: 'string',
            humidity: 'string',
            temperature: 'string',
            height: 10,
            diameter: 10,
            url: 'string',
            type: {
                id: 'string',
                name: 'string',
                url: 'string',
            },
        };
        productCard.product = product;
    })

    it('should init count 1 ', () => {
        expect(productCard.count).toBe(1);

    })
    it('should have count set ', () => {
        productCard.countInCart = 5;
        fixture.detectChanges();
        expect(productCard.count).toBe(5);

    })

    it('should init count 1 ', () => {
        let cartServiceSpy = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
        cartServiceSpy.updateCart.and.returnValue(of({
            items: [{
                product: {
                    id: 'string',
                    name: 'string',
                    price: 140,
                    image: 'string',
                    url: 'string',
                },
                quantity: 4,
            }]
        }))
        productCard.removeFromCart();
        expect(cartServiceSpy.updateCart).toHaveBeenCalledOnceWith(product.id, 0);
    })
    it('should init count 1 ', () => {
       productCard.isLight = true;
       fixture.detectChanges();

       const componentElement: HTMLElement = fixture.nativeElement;
       const productCartInfo: HTMLElement | null = componentElement.querySelector('product-card-info');
       const productCartExtra: HTMLElement | null = componentElement.querySelector('product-card-extra');

       expect(productCartInfo).toBe(null);
       expect(productCartExtra).toBe(null);
    })
    it('should init count 1 ', () => {
        productCard.isLight = true;
        fixture.detectChanges();

        let routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        productCard.navigate();
        expect(routerSpy.navigate).toHaveBeenCalled();

    })
    it('should init count 1 ', () => {
        productCard.isLight = false;
        fixture.detectChanges();

        let routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        productCard.navigate();
        expect(routerSpy.navigate).not.toHaveBeenCalled();

    })

})