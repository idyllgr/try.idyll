import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AgoPipe } from './pipes/ago.pipe';
import {NgxPermissionsModule, NgxPermissionsRestrictStubModule} from 'ngx-permissions';
import { GeneratePhotoPipe } from './pipes/generatePhoto.pipe';
import { DateMessagePipe } from './pipes/dateMessage.pipe';
import { PaginatePipe } from './pipes/paginate.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import {TranslateModule} from '@ngx-translate/core';
import {DateTimeMessagePipe} from './pipes/dateTimeMessage.pipe';
import {RouterModule} from '@angular/router';
import { ButtonComponent } from './components/button/button.component';
import {NgbActiveModal, NgbToastModule} from "@ng-bootstrap/ng-bootstrap";
import {PaginationComponent} from "./components/pagination/pagination.component";
import {MomentPipe} from "./pipes/MomentPipe";
import {GetPhotoPipe} from "./pipes/getPhoto.pipe";
import {CentredMessageComponent} from "./components/centred-message/centred-message.component";
import {ClickStopPropagationDirective} from "./directives/stop.propagation.directive";
import {SidebareMenuComponent} from "./components/sidebaremenu/sidebareMenu.component";
import {BreadcrumbModule} from "primeng/breadcrumb";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        NgxPermissionsModule,
        RouterModule,
        NgbToastModule,
        ReactiveFormsModule,
        NgxPermissionsRestrictStubModule,
        BreadcrumbModule,
    ],
  declarations: [
    AgoPipe,
    GeneratePhotoPipe,
    ClickStopPropagationDirective,
    DateMessagePipe,
    DateTimeMessagePipe,
    PaginatePipe,
    FilterPipe,
    PaginationComponent,
    ButtonComponent,
    CentredMessageComponent,
    GetPhotoPipe,
    MomentPipe,
    SidebareMenuComponent,
  ],
  exports: [
    AgoPipe,
    DateMessagePipe,
    DateTimeMessagePipe,
    GeneratePhotoPipe,
    PaginatePipe,
    FilterPipe,
    NgxPermissionsModule,
    PaginationComponent,
    ClickStopPropagationDirective,
    SidebareMenuComponent,
    ButtonComponent,
    CentredMessageComponent,
    GetPhotoPipe,
    MomentPipe,
  ],
  providers: [

  ]
})
export class SharedModule { }
