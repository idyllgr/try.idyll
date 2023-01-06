import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {MainStore} from "../../../shared/store/mainStore";
import {ModalDismissReasons, NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {getFormValidationErrors, SharedClasses} from "../../../shared/classes/SharedClasses";
import {Location, Appearance, GermanAddress} from '@angular-material-extensions/google-maps-autocomplete';
import PlaceResult = google.maps.places.PlaceResult;
import {toJS} from "mobx";
import {BusinessService} from "../../network/services/business.service";
import Swal from "sweetalert2";
import {ErrorsService} from "../../network/services";
import {TranslateService} from "@ngx-translate/core";
import {environment} from "../../../environments/environment";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-order-modal',
  templateUrl: './order-modal.component.html',
  styleUrls: ['./order-modal.component.scss']
})
export class OrderModalComponent implements OnInit, AfterViewInit {

  myForm: FormGroup;
  @Input()  selected_products: Array<any>;
    public appearance = Appearance;
    public zoom: number;
    public latitude: number;
    public longitude: number;
    public selectedAddress: PlaceResult;
    hiddenPhoneNumber = false;
     isSubmitting: boolean;
     blobimg;
     mobileDevice = false;
     loadingGmail: boolean;
     loadingWhatsapp: boolean;
  constructor(public modal: NgbActiveModal,
              public mainStore: MainStore,
              public fb: FormBuilder,
              private cdr: ChangeDetectorRef,
              private businessService: BusinessService,
              private errorsService: ErrorsService,
              private modalService: NgbModal,
              private translateService: TranslateService,
              private messageService: MessageService,
              ) {
      // this.myForm = this.fb.group({
      //     name: [null, Validators.compose([Validators.required])],
      //     phone: [null, Validators.compose([Validators.required])],
      //     address: [null, Validators.compose([])],
      //     size: [null, Validators.compose([])],
      //     products: this.fb.array([{
      //         product_id: null,
      //         dimension_id: null
      //     }]),

          // this.selected_products.map(item => {
          //     return {id: item.id, size: null}
          // })
      // });
  }

  ngAfterViewInit() {
      this.myForm = this.fb.group({
          name: [null, Validators.compose([Validators.required])],
          phone: [null, Validators.compose([Validators.required])],
          address: [null, Validators.compose([])],
          size: [null, Validators.compose([])],
          products: this.fb.array(this.createItems(this.selected_products)),
        });
      console.log('afterViewInit modal', this.getDimensionsControls('products'));
      this.cdr.detectChanges();
  }

    ngOnInit(): void {
      this.zoom = 10;
      // this.latitude = 52.520008;
      // this.longitude = 13.404954;
      // this.setCurrentPosition();
      this.mobileDevice = this.isMobileDevice();
  }

    isMobileDevice(){
        return SharedClasses.ismobileAndTabletCheck();
    }

    getDimensionsControls(input) {
        return this.myForm.controls[input]['controls'];
    }

    private createItems(items): FormGroup[] {
      console.log('createItems', items);
        const arr = [];
        items.forEach(item => {
            arr.push(this.createItem(item));
        })
        return arr;
    }

    private createItem(item = null): FormGroup {
        return this.fb.group({
            dimension_id: item ? item.dimension_id: null,
            product_id: item ? item.product_id : null,
            item: item ? item: null
        });
    }


    // private setCurrentPosition() {
    //     if ('geolocation' in navigator) {
    //         navigator.geolocation.getCurrentPosition((position) => {
    //             this.latitude = position.coords.latitude;
    //             this.longitude = position.coords.longitude;
    //             this.zoom = 12;
    //         });
    //     }
    // }

    onAutocompleteSelected(result: PlaceResult) {
        console.log('onAutocompleteSelected: ', result);
    }

    onLocationSelected(location: Location) {
        console.log('onLocationSelected: ', location);
        this.latitude = location.latitude;
        this.longitude = location.longitude;
    }

    onGermanAddressMapped($event: GermanAddress) {
        console.log('onGermanAddressMapped', $event);
    }

    isRequired(control) {
        return SharedClasses.isControlRequired(control);
    }

    show() {
        console.log('this.selected_products', this.selected_products);
    }

    isDisabled() {
        return !this.myForm.valid || this.isSubmitting;
    }

    async onSubmitAddOrder(type='full_order') {
        if(type === 'whatsapp'){
            this.goTowhatsapp();
        }else if(type === 'facebook'){
            this.goToMessenger();
        }
      return;
        let params: any = Object.assign({}, this.myForm.value);
        if(!params) return;
         params.products = params.products.map(item => {
            delete item['description'];
            if(item.product_id){
                return item
            }
        }).filter(item => item);
         const fd = new FormData();

        if( this.blobimg ){
            fd.append('photo',  new File([this.blobimg], 'imagedeco.png'));
        }
        console.log('params', params, this.myForm.value);
         Object.keys(params).forEach(key => {
             if(Array.isArray(params[key])){
                 for (let i=0; i<params[key].length; i++){
                     console.log('params[key][i][\'product_id\']', params[key][i]['product_id']);
                     fd.append(key + '[' + i + '][product_id]' , params[key][i]['product_id']);
                     fd.append(key + '[' + i + '][dimension_id]' , params[key][i]['dimension_id']);
                 }
             }else{
                 fd.append(key, params[key]);
             }
         });

         fd.append('type', type);
        if(type === 'whatsapp'){
            this.goTowhatsapp();
        }else if(type === 'facebook'){
            this.goToMessenger();
        }
         try {
             const res = await this.businessService.createOrder(fd).toPromise();
             if(res?.result?.data && type === 'full_order'){
                 Swal.fire({
                     title: this.translateService.instant('SUCCESSFUL OPERATION!'),
                     icon: 'success',
                     heightAuto: false
                 });
                 this.myForm.reset();
                 this.modal.close('QUERY');
             }
         }catch (e){
             const errorMessage = this.errorsService.getErrorMessage(e);
             Swal.fire({
                 title: this.translateService.instant('FAILURE!'),
                 html: errorMessage,
                 icon: 'error',
                 heightAuto: false
             });
         }finally {

         }
        console.log('onSubmitAddOrder', params, this.myForm.value);
    }

    checkForm() {
        getFormValidationErrors(this.myForm);
        this.myForm.reset();
        this.modal.close('CLOSE');
    }

    showPhone() {
        console.log(' this.hiddenPhoneNumber',  this.hiddenPhoneNumber);
        this.getBusiness('phone');
        this.onSubmitAddOrder('ask_phone');
    }

    private async getBusiness(attribute){
        try {
            const businessParams = {
                full_phone: true,
                business_id: this.mainStore.selectedBusiness?.id,
                with_categories: false,
                products: this.selected_products.map(item => item?.id)
            }
            const res = await this.businessService.getOneAsGuest(businessParams).toPromise();
                this.mainStore.selectedBusiness[attribute] = res?.result?.data[attribute];
                if(attribute === 'phone'){
                    this.hiddenPhoneNumber = false;
                }
        } catch(e) {
            console.log('e', e);
            this.hiddenPhoneNumber = true;
        }finally {
        }
    }

    goTowhatsapp(){
        const num = this.mainStore.selectedBusiness?.phone;
        const msg = this.translateService.instant('MAKE ORDER MESSAGE');
        let url = '';

        if (SharedClasses.ismobileAndTabletCheck()) {
            url = 'https://api.whatsapp.com/send?phone=' + num +
                '&text=%20' + msg;
            // url = 'https://wa.me/'+ num +'/?text='+msg
            // url = 'whatsapp://send?'
            console.log('This is mobile', url);
        } else {
            url = 'https://web.whatsapp.com/send?phone=' + num + '&text='+
                encodeURIComponent(msg);
        }
        window.open(url, '', 'menubar=false');
        // const imageURL = environment.publicPhotosBaseUrl + '' + res.result.data;
    }

    goToMessenger(){
        // let url = this.mainStore.selectedBusiness.messenger_link;
        // if (SharedClasses.ismobileAndTabletCheck()) {
        //     url = 'https://api.whatsapp.com/send?' + num +
        //         '&text=Hi,%20I%20would%20like%20to%20get%20more%20information..';
        //     console.log('This is mobile', url);
        // } else {
        //     url = 'https://web.whatsapp.com/send?' + num +
        //         '&amp;text=Hi, I would like to get more information..';
        //     console.log('This is web', url);
        // }
        // console.log('goto ', url);
        window.open('https://' + this.mainStore.selectedBusiness.messenger_link);
    }

    // sendEmail() {
    //     if(!this.business || !this.business.messenger_link){
    //         return;
    //     }
    //     this.modalService.dismissAll('QUERY');
    //     const node = this.dropArea.nativeElement;
    //     this.loadingGmail = true;
    //     domtoimage.toBlob(node, {
    //         width: this.imgBg.nativeElement.width,
    //         height: node.height})
    //         .then( (blob) => {
    //             const fd = new FormData();
    //             const merged = {...this.businessParams, ...this.emailForm.value};
    //             Object.keys(merged).forEach(key => {
    //                 if (Array.isArray(merged[key])) {
    //                     for (let i = 0; i < merged[key].length; i++) {
    //                         fd.append(key + '[' + i + ']', merged[key][i]);
    //                     }
    //                 } else {
    //                     fd.append(key, merged[key]);
    //                 }
    //             });
    //
    //             fd.append('photo',  new File([blob], 'imagedeco1.png'));
    //             fd.append('type', 'email');
    //             this.businessService.submitStat(fd).toPromise().then(async res =>  {
    //                 this.messageService.add({severity: 'success', summary: 'SUCCESS',
    //                     detail: this.translateService.instant('UPDATED SUCCESSFULLY'), sticky: false});
    //             }).catch(error => {
    //                 console.log('e', error);
    //                 const errorMessage = this.errorsService.getErrorMessage(error);
    //                 this.messageService.add({severity: 'error', summary: this.translateService.instant('FAILURE!'), detail: error, sticky: true});
    //             }).finally(() => {
    //                 this.loadingGmail = false;
    //             });
    //         })
    //         .catch( (error) => {
    //             console.error('oops, something went wrong!', error);
    //             this.loadingGmail = false;
    //         }).finally(()=>{
    //         this.loadingGmail = false;
    //     });
    // }

    // async openModalGmail(content) {
    //     this.loadingGmail = true;
    //     try{
    //         await this.getImageResult();
    //         this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    //             this.closeResult = `Closed with: ${result}`;
    //         }, (reason) => {
    //             this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    //         });
    //     }catch (e){
    //         this.loadingGmail = true;
    //     }finally {
    //         this.loadingGmail = false;
    //     }
    //
    // }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    //TODO
    /*
    //////////// when u go home
    //////////// case multiple products
     //////////// confirm order with backend
     //////////// check new orders on orders list
     //////////// make limitation on free tier
     check access to plans:
     orders, storage stats, .
        .

     */

    deleteProduct(product) {
        this.selected_products = this.selected_products.filter(item => item.id !== product.value?.item?.id);
        // this.myForm.patchValue({
        //     products: this.fb.array(this.createItems(this.selected_products)),
        // });
        this.myForm.controls['products'] = this.fb.array(this.createItems(this.selected_products));
    }

    showInformation() {
        Swal.fire({
            title: 'Information about the full version',
            html: "<div class='text-left'>This version contains only frontend side of the application and can be managed using json file located in 'src/home/data.ts'.</div>" +
                "<div class='text-left'>You can add products and backgrounds in this json file, and add theirs photos inside ‘assets/images/business_photos’.</div>" +
                "<div class='text-left'>You can also update setting and customize theme using this json file.</div>" +
                "<div class='text-left'>The full version of the application contains the following features:</div>" +
                "<div class='text-left'>1. Manage your backgrounds using the admin panel.</div>" +
                "<div class='text-left'>2. Manage your products and theirs categories using the admin panel.</div>" +
                "<div class='text-left'>3. Manage your orders and customers using the admin panel.</div>" +
                "<div class='text-left'>4. Manage your business information using the admin panel.</div>" +
                "<div class='text-left'>5. Manage your business settings using the admin panel.</div>" +
                "<di class='text-left'>6. Manage your business statistics using the admin panel.</div></br>" +
                "<di class='text-left'>Youtube playlist: https://youtube.com/playlist?list=PLssM_cSdgVjY78XC7gZL8HXWPh9Q24ggF</div></br>" +
                "<div class='text-left'>The backend part is written in Laravel and the frontend part is written in Angular. The database is Mysql.</div></br></br>"+
                "<div class='text-left'>If you want to use the full version of the application, please contact us at whatsapp: +212630931997 or gmail: chbanianass20@gmail.com</div>",
            icon: 'info',
            confirmButtonColor: '#59a6d4',
            confirmButtonText: 'Ok',
            heightAuto: false
        })
    }

    getTotalPrice(){
        let total = 0;
        this.myForm.value.products.forEach(el => {
            const dim = el.item.dimensions.find(d => d.id === el.dimension_id);
            total += dim ? dim.price: 0;
        });
        return total;
    }
}
