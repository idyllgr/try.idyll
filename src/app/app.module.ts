import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MainStore} from '../shared/store/mainStore';
import {NgbActiveModal, NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxPermissionsModule} from 'ngx-permissions';
import {HttpTokenInterceptor} from './network/interceptors/http.token.interceptor';
import {ApiService, ErrorsService, UserService} from './network/services';
import {JwtStore} from '../shared/store/jwt.store';
import {UserStore} from '../shared/store/user.store';
import {HomeModule} from './home/home.module';
import {ProductService} from "./network/services/product.service";
import {BusinessService} from "./network/services/business.service";
import {MessageService} from "primeng/api";
import { SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import { GalleryModule } from 'ngx-doe-gallery';
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { AgmCoreModule } from '@agm/core';
import {ImageService} from "./network/services/images.service";

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        NgbModule,
        // AuthModule,
        NgxPermissionsModule.forRoot(),
        HomeModule,
        SweetAlert2Module.forRoot(),
        GalleryModule,
        MatInputModule,
        MatButtonModule,
        MatGoogleMapsAutocompleteModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyB_-RUe4KjjmhwD7F-mNhuVkOdPubJj57c',
            libraries: ['places']
        }),
    ],
  providers: [
  	{
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true
    },
      MainStore,
      TranslateService,
      UserService,
      BusinessService,
      UserStore,
      JwtStore,
      ApiService,
      ErrorsService,
      ProductService,
      MessageService,
      ImageService,
      NgbActiveModal,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
