import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { LayoutComponent } from './shared/layout/layout.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { MainComponent } from './views/main/main.component';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatMenuModule} from '@angular/material/menu';
import {ProductCardComponent} from './shared/components/product-card/product-card.component';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthInterceptor} from './core/auth/auth.interseptor';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { LoaderComponent } from "./shared/components/loader/loader.component";


@NgModule({
    declarations: [
        AppComponent,
        LayoutComponent,
        HeaderComponent,
        FooterComponent,
        MainComponent,
    ],
    imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatMenuModule,
    HttpClientModule,
    CarouselModule,
    AppRoutingModule,
    ProductCardComponent,
    FormsModule,
    ReactiveFormsModule,
    LoaderComponent
],
    providers: [
        {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
      {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    ],
    exports: [

    ],
    bootstrap: [AppComponent]

})
export class AppModule { }
