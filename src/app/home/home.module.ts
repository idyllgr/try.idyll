import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import {TranslateModule} from '@ngx-translate/core';
import {HeaderComponent} from '../../shared/components/header/header.component';
import {FooterComponent} from '../../shared/components/footer/footer.component';
import {LanguageComponent} from '../../shared/components/language/language.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxStarsModule} from 'ngx-stars';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxPermissionsAllowStubModule} from 'ngx-permissions';
import {MatButtonModule} from '@angular/material/button';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {Main2Component} from "./main2/main.component";
import {GalleryModule} from "ngx-doe-gallery";
import {MatInputModule} from "@angular/material/input";
import {WebcamModule} from "ngx-webcam";
import { PinchZoomModule } from 'ngx-pinch-zoom';
import {DragresizeComponent} from "./dragresize/dragresize.component";
import {StepsModule} from 'primeng/steps';
import {SharedModule} from "../../shared/shared.module";
import {NgxUiLoaderModule} from "ngx-ui-loader";
import { OrderModalComponent } from './order-modal/order-modal.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatGoogleMapsAutocompleteModule} from "@angular-material-extensions/google-maps-autocomplete";
import {AgmCoreModule} from "@agm/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {LAZYLOAD_IMAGE_HOOKS, LazyLoadImageModule, ScrollHooks} from "ng-lazyload-image";

@NgModule({
    declarations:
        [
            // MainComponent,
        Main2Component,
        HeaderComponent,
        FooterComponent,
            DragresizeComponent,
        LanguageComponent,
        OrderModalComponent],
    exports: [
        HeaderComponent,
        FooterComponent
    ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        TranslateModule,
        FormsModule,
        NgxStarsModule,
        NgbModule,
        NgxPermissionsAllowStubModule,
        MatButtonModule,
        SweetAlert2Module,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        WebcamModule,
        PinchZoomModule,
        StepsModule,
        GalleryModule,
        SharedModule,
        NgxUiLoaderModule,
        MatTooltipModule,
        NgSelectModule,
        AgmCoreModule,
        MatGoogleMapsAutocompleteModule,
        LazyLoadImageModule,
    ],
    providers: [
        { provide: LAZYLOAD_IMAGE_HOOKS, useClass: ScrollHooks }
    ],
    entryComponents: [
        DragresizeComponent, OrderModalComponent
    ]
})
export class HomeModule { }
