import {
    AfterContentChecked, AfterViewChecked, AfterViewInit,
    ChangeDetectorRef,
    Component, ComponentFactoryResolver,
    ElementRef, EmbeddedViewRef, EventEmitter,
    HostListener,
    OnDestroy, Output,
    ViewChild, ViewContainerRef
} from '@angular/core';
// import { LoaderService } from 'src/shared/services/loader/loader.service';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, NavigationEnd, NavigationStart, Router} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {$screenSize, MainStore} from '../../../shared/store/mainStore';
import {BusinessService} from "../../network/services/business.service";
import domtoimage from 'dom-to-image-more-scroll-fix';
import {saveAs} from 'file-saver';
import {environment} from "../../../environments/environment";
import {ErrorsService, UserService} from "../../network/services";
import {SharedClasses} from "../../../shared/classes/SharedClasses";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";
import {GalleryComponent, GalleryImage} from "ngx-doe-gallery";
import {WebcamImage, WebcamInitError} from 'ngx-webcam';
import {Subject} from 'rxjs/Subject';
import Swal from "sweetalert2";
import {DragresizeComponent} from "../dragresize/dragresize.component";
import { MatStepper} from "@angular/material/stepper";
import {Subscription} from "rxjs";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {toJS} from "mobx";
import {OrderModalComponent} from "../order-modal/order-modal.component";
import {ImageService} from "../../network/services/images.service";
import { Observable, of } from "rxjs";
import {StateChange} from "ng-lazyload-image";
import {data} from "../../../../data";
// const path = require('path');

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    // encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('widthGrow', [
            state('closed', style({
                width: 0,
            })),
            state('open', style({
                width: 400
            })),
            transition('* => *', animate(150))
        ]),
    ]
})

export class Main2Component implements OnDestroy, AfterContentChecked, AfterViewInit, AfterViewChecked{
    title = 'base';
    errorLoadBusiness: boolean;
    loadingBusiness: boolean;
    private isLoading = false;
    public isModuleLoading = true;
    public showDimensionsPanel = 'closed';
    mobileDevice = false;
    bgWidth;
    bgheight;
    @ViewChild('workSpaceElement') workSpaceElement: ElementRef;
    @ViewChild('dropArea') dropArea: ElementRef;
    @ViewChild('objectTrash') objectTrash: ElementRef;
    @ViewChild('doeGalleryGb') doeGalleryGb: GalleryComponent;
    // @ViewChild('doeGalleryObjects') doeGalleryObjects: GalleryComponent;
    @ViewChild('stepper') stepper: MatStepper;

    @ViewChild('workSpaceElement', {static: false, read: ViewContainerRef }) entry: ViewContainerRef;
    @ViewChild('imgBg') imgBg: ElementRef;
    workspaceImage: any;
    backgroundSrc = null;
    backgroundzoom = 1;

    selectedMoveable;
    backgroundList = [];
    objectslist = [];
    _dock = true;
    business: any;
    businessParams: any = {
        // business_id: null,
        business_name: null,
        // id: environment.business_id,
        full_phone: false,
        with_categories: true,
        selected_products: []
    };
    hiddenPhoneNumber = true;
    emailForm: FormGroup;
    containerWidth: number;
    allowCamera = false;
    // for camera **********************************
    @Output() public pictureTaken = new EventEmitter<WebcamImage>();

    // toggle webcam on/off
    public showWebcam = true;
    public allowCameraSwitch = true;
    public multipleWebcamsAvailable = false;
    public deviceId: string;

    public errors: WebcamInitError[] = [];

    // webcam snapshot trigger
    private trigger: Subject<void> = new Subject<void>();
    // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
    private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

    //********************************************
    closeResult;
    blobresult;
    submittingEmailForm = false;
    //lllllllllllllllllllllll
    images: any[];
    imagesObjects: any[];
    @ViewChild('contentElement') contentElement: ElementRef;
    //lllllllllllllllllllllll
    showCamera: boolean;
    width: number;
    height: number;
    objectFit = 'contain'; // contain / cover
    loadingWhatsapp: boolean;
    loadingGmail: boolean;
     paramsSubscription: Subscription;
    private entryObservable = new Subject();
    private objectsComponentRefs = [];
    loadingStateBG: "setup" | "observer-emit" | "start-loading" | "mount-image" | "loading-failed" | "loading-succeeded" | "finally";
    @HostListener('window:resize', ['$event'])
    onResize(event?: Event) {
        this.width = this.contentElement?.nativeElement?.offsetWidth;
        this.height =this.contentElement?.nativeElement?.offsetHeight;
        this.objectFit = this.mainStore.screenSize > $screenSize.TABLET ? 'contain': 'contain';
        // this.orientation =  this.mainStore.screenSize > $screenSize.TABLET ? 'left': 'bottom';
        this.orientation =  window.innerWidth > window.innerHeight ? 'left': 'bottom';
    }
    isDraggingAnObject: any;
    isTrashing: any;
    $screenSize = $screenSize;
    orientation = 'bottom';
    selectedBackgroundIndex = 0;
    selectedStepperIndex = 0;
    stepperItems = [{
        label: this.translate.instant('ADD_BACKGROUND'),
        step_id: 1,
        command: (event: any) => {
            this.navigate(1);
        }
    },
        {
            label: this.translate.instant('ADD_OBJECTS'),
            step_id: 2,
            command: (event: any) => {
                this.navigate(2);
            }
        },
        {
            label: this.translate.instant('DOWNLOAD_DECO_AS_IMAGE'),
            step_id: 3,
            command: (event: any) => {
                this.navigate(3);
            }
        },
    ];
    whatsappLink = ''
    facebookLink = ''
    messengerLink = ''
    constructor(
        private translate: TranslateService,
        private ref: ChangeDetectorRef,
        private router: Router,
        public mainStore: MainStore,
        private changeDtc: ChangeDetectorRef,
        private businessService: BusinessService,
        private fb: FormBuilder,
        public userService: UserService,
        private modalService: NgbModal,
        private messageService: MessageService,
        private resolver: ComponentFactoryResolver,
        private errorsService: ErrorsService,
        private route: ActivatedRoute,
        private loader: NgxUiLoaderService,
        private IS: ImageService
    ) {
        this.onResize();
        this.translate.addLangs(['en', 'fr']);
        this.translate.setDefaultLang('en');
        const localLang: string = localStorage?.getItem('lang');
        if (['fr', 'en'].includes(localLang)){
            this.translate.use(localLang);
        } else {
            this.translate.use('en');
        }

        this.mobileDevice = this.isMobileDevice();
        // this.getBusiness();
        this.emailForm = this.fb.group({
            customer_email: [this.business?.email, Validators.compose([Validators.required, SharedClasses.emailValidator])],
            customer_message: [this.translate.instant('MAKE ORDER MESSAGE')]
        });
        this.route.params.subscribe(params => {
            console.log('params', params);
            this.businessParams.business_name = params.business_name;
            this.getBusiness();
        });
        translate.setDefaultLang('en');
        translate.use('en');
    }

    isMobileDevice(){
        return SharedClasses.ismobileAndTabletCheck();
    }

    ngAfterContentChecked() {
        // console.log('stepper', this.stepper);
        // this.stepper.selectedIndex = this.mainStore.step;
        this.stepperItems.findIndex(item => item.step_id === this.mainStore.step) ;
        // console.log('this.entry ngAfterContentChecked', this.entry);

    }

    setLang(){
        console.log('hello anass', this.mainStore.selectedBusiness);
        this.translate.addLangs(['en', 'fr']);
        const lang =  this.mainStore.selectedBusiness?.parameter?.can_update_settings ?
            this.mainStore.selectedBusiness?.parameter?.lang: localStorage?.getItem('lang');
        if (['fr', 'en'].includes(lang)){
            this.translate.use(lang);
            this.mainStore.selectedLanguage = lang;
        } else {
            this.translate.use('en');
        }
    }

    ngAfterViewInit() {
        // console.log('stepper', this.stepper);
        // setTimeout(() => {
        //     this.stepper.selectedIndex = 2;
        //
        //     console.log('ngAfterViewInit, selectedIndex', this.stepper.selectedIndex, 'this.mainStore.step', this.mainStore.step);
        //     this.changeDtc.detectChanges();
        // }, 1);
        console.log('this.entry ngAfterViewInit', this.translate.instant('DOWNLOAD_DECO_AS_IMAGE'));

    }

    ngAfterViewChecked() {
        // console.log('this.entry ngAfterViewChecked', this.entry);
        // if(this.entry){
        //     if(!this.business.loaded){
        //         this.getBusiness();
        //     }
        // }
        // this.entryObservable = new Observable(observer =>{
        //     if(this.entry){
        //         observer.next(this.entry);
        //         // observer.complete();
        //     }
        // })

        if(this.entry && !this.entryObservable.isStopped){
            this.stepperItems = [{
                label: this.translate.instant('ADD_BACKGROUND'),
                step_id: 1,
                command: (event: any) => {
                    this.navigate(1);
                }
            },
                {
                    label: this.translate.instant('ADD_OBJECTS'),
                    step_id: 2,
                    command: (event: any) => {
                        this.navigate(2);
                    }
                },
                {
                    label: this.translate.instant('DOWNLOAD_DECO_AS_IMAGE'),
                    step_id: 3,
                    command: (event: any) => {
                        this.navigate(3);
                    }
                },
            ];
            this.entryObservable.next(true);
        }
    }

    initBGList(){
        this.images = this.backgroundList.map(item => {
            const photo = this.getPhotoUrl(item);
            const photo_thumb = this.getPhotoUrl(item, true);
            return new GalleryImage(photo, photo_thumb, null, null, null, item.id);
        });
        if(this.images && this.images.length>0){
            this.selection(this.images[this.selectedBackgroundIndex]);
        }
    }

     initObjectList(){
        console.log('this.objectslist', this.objectslist);
        this.imagesObjects = this.objectslist.filter(item => item.photo ).map(  (item) => {
                const photo = this.getPhotoUrl(item);
                const photo_thumb = this.getPhotoUrl(item, true);
                item.src = photo;
                console.log('anass', item.photo?.split('.').slice(0, -1).join('.'));
                return new GalleryImage(photo, photo_thumb, null, null, null, item.id);
        // , item.photo, item
        });
    }

    get loading() {
        return this.isLoading;
    }

    ngOnDestroy(): void {
    }

    drop($event) {
        console.log('hello', $event);
        this.backgroundSrc = null;
    }

    getMeta(url) {
        const img = new Image();
        img.src = url;
        img.onload = (e:any) => {
            // alert('Width:' + this.bgImageWidth + '   Height: ' + this.bgImageheight);
            console.log('img.onload', e?.path[0]?.naturalWidth);
            if(e && e.path && e.path.length>0){
                this.containerWidth = e.path[0].naturalWidth;
                this.changeDtc.detectChanges();
            }
        };

    }

    async chooseBg(item?) {

        // this.zoom(3);
        // const {clientWidth, clientHeight, currentSrc} = event.target;
        // // console.log('event', event.target.currentSrc);
        // let dimensionStyle = '';
        // if (clientWidth > clientHeight){
        //     //     // this.workSpaceElement.nativeElement.innerHTML = "<img [src]=\"'../assets/images/painting-'+item+'.jpeg'\" />"
        //     dimensionStyle = 'height: 100%';
        // } else {
        //     dimensionStyle = 'width: 100%';
        // }
        // dimensionStyle = 'height: 100%';
        // console.log('setting bg', item.url);
        // const oImg: any = document.createElement('img');
        // oImg.setAttribute('src',  item.url );
        // oImg.setAttribute('id',  'backgroundworkspace' );
        // oImg.setAttribute('style',   'z-index: 1;position: absolute;\n' +
        //     '    top: 0;\n' +
        //     '    left: 0; ' + dimensionStyle );
        console.log('chooseBg', item);
        this.workspaceImage = item;
            // of(
            // await this.IS.getCSSBackgroundImageURL(item)
        // );
        // const image: Observable<Blob> = this.IS.fetchImage(item);
        // image.subscribe(b => {
        //     this.IS.saveImageToDatabase(item, b);
        // });
        // this.images.unshift(new GalleryImage(item, item));
        // this.selectedBackgroundIndex = 0;

        console.log('SELECTING item', this.workspaceImage);
        this.getMeta(item);
        this.removeBg();
        // if( this.workSpaceElement)
        // this.workSpaceElement.nativeElement.appendChild(oImg);
    }

    removeBg(){
        const oldbg = document.getElementById('backgroundworkspace');
        if(oldbg){
            oldbg.remove();
        }
    }

    clearChoosenObjects(){
        this.objectslist.forEach(item => item.selected = false);
        this.entry?.clear();
        this.businessParams.selected_products = [];
    }

     chooseObject(item) {
        console.log("chooseObject", item);
        if(!this.business?.parameter?.multiple_products_by_order){
            this.clearChoosenObjects();
        }
        if(!item){
            return;
        }
        if(item.selected){
            return;
        }
        item.selected = true;
        if(!this.businessParams.selected_products){
            this.businessParams.selected_products = [];
        }
        this.businessParams.selected_products.push(item);
        const posMin = 5;
        const posMax = 50;

        // const oImg: any = document.createElement('app-drag-resize');
        // oImg.setAttribute('src',   item.photo );
        // oImg.setAttribute('style',   'position: absolute;' +
        //     '                                             top: ' + (Math.random() * (posMax - posMin) + posMin) +'%;' +
        //     '                                             left: ' + (Math.random() * (posMax - posMin) + posMin) +'%;' +
        //     '                                             z-index: 2; ' +
        //     '                                             width: 15%; ' +
        //     '                                             box-shadow: 0px 0px 2px 2px;'  );

        // this.entry.clear();

        const factory = this.resolver.resolveComponentFactory(DragresizeComponent);
        let componentRef = this.entry.createComponent(factory);

         const domElems = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes;

         domElems.forEach(node => {
             this.workSpaceElement.nativeElement.appendChild(node);//(componentRef);
         })
        // componentRef.instance.src = await (new GetPhotoPipe(this.userService)).transform(item.photo);
        componentRef.instance.src = item.src;
         console.log('item', item);
        componentRef.instance.product = item;
        componentRef.instance.parentElement = this.imgBg;
        componentRef.instance.objectTrash = this.objectTrash;
        componentRef.instance.delete.subscribe(ev => {
            if(ev){
                this.businessParams.selected_products = this.businessParams.selected_products.filter(el => el !== ev);
                console.log('delete', ev,  this.objectsComponentRefs);
                ev.selected = false;
                componentRef.destroy();
                console.log('destroyed', componentRef);

                 this.objectsComponentRefs = this.objectsComponentRefs.filter(el => el?.instance !== componentRef.instance);
                console.log('delete delete',  this.objectsComponentRefs);
            }
        });
        componentRef.instance.isDragging.subscribe(ev => {
            console.log('dragging emit', ev);

            this.isDraggingAnObject = ev ? componentRef: null;
        });
        // isDraggingAnObject
        this.objectsComponentRefs.push(componentRef);
    }

    deleteObject(){
        console.log('deleteObject', this.isDraggingAnObject, this.objectsComponentRefs);
        if(this.isDraggingAnObject){
            // this.isDraggingAnObject.destroy();
            delete this.objectsComponentRefs[this.isDraggingAnObject];
            this.isDraggingAnObject.instance.delete.emit(this.isDraggingAnObject.instance.product);
        }
        console.log('deleteObject deleted', this.isDraggingAnObject, this.objectsComponentRefs);
    }

    zoom(type) {
        if(this.workspaceImage){
            if(type === 1){

                this.backgroundzoom += 0.05;
                if(this.workspaceImage && this.workspaceImage.style) this.workspaceImage.style.transform =  'scale(' + this.backgroundzoom + ')';
            }else if(type === 2){
                this.backgroundzoom -= 0.05;

                if(this.workspaceImage && this.workspaceImage.style) this.workspaceImage.style.transform =  'scale(' + this.backgroundzoom + ')';
            }else{ //reset

                this.backgroundzoom = 1;
                if(this.workspaceImage && this.workspaceImage.style) this.workspaceImage.style.transform =  null;
            }
        }
    }

    uploadFile(event: any) { //Angular 11, for stricter type
        let  msg = '';
        if(!event.target.files[0] || event.target.files[0].length === 0) {
            msg = 'You must select an image';
            return;
        }
        const mimeType = event.target.files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            msg = 'Only images are supported';
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = () => {
            msg = '';
            // url = reader.result;
            console.log('reader.result', reader.result);
            this.backgroundList.unshift( {
                photo: reader.result
            });
            console.log('event.target.files[0]', event.target.files[0]);
            const images = this.images;
            images.unshift(new GalleryImage(reader.result, reader.result));
            // images.unshift(new GalleryImage(reader.result, reader.result));
            this.images = [];
            this.images = images;
            // this.selectedBackgroundIndex = 0;
            this.doeGalleryGb.select(1);
            this.doeGalleryGb.select(0);

            // this.chooseBg(reader.result);
            this.changeDtc.detectChanges();
        }
        console.log('msg upload', msg);
        // this.chooseBg(event);
    }

    showTools() {
        return [1, 2].includes(this.mainStore.step);
    }

    downloadImage() {
        console.log('downloading ..');
        // saveAsPng(this.workSpaceElement.nativeElement, {  filename: 'decozin', printDate: true });
        // const node = this.contentElement.nativeElement;
        const node = this.dropArea.nativeElement;

        domtoimage.
            toBlob(node, {
                width: this.imgBg.nativeElement.width,
            height: this.imgBg.nativeElement.height,


            })
            .then( (blob) => {
                saveAs(blob, 'decotok.png');
                 // const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                // window.location.href=image;
                // saveAs(image, 'decozin.png');
            })
            .catch( (error) => {
                console.error('oops, something went wrong!', error);
            });
        const imageTarget = document.getElementById('target')
        // nodeToDataURL({
        //     targetNode: node,
        //     customStyle: '.highlighted-element { background: red; }'
        // })
        //     .then((url) => {
        //         imageTarget.setAttribute('src', url);
        //     })
    }

    changeDimensionsState(): void {
        (this.showDimensionsPanel === 'closed') ? this.showDimensionsPanel = 'open' : this.showDimensionsPanel = 'closed';
    }

    reset() {
        this.initBGList();
        this.initObjectList();
        this.removeBg();
        this.mainStore.setStep(1);
        this.bgWidth = null;
        this.bgheight = null;
        const children = this.workSpaceElement.nativeElement.children;
        Array.from(children).forEach((child: HTMLElement) => {
            if(child.classList.contains('objImg')){
                this.workSpaceElement.nativeElement.removeChild(child);
            }
        })
    }

    async getImageResult() {
        const node = this.dropArea.nativeElement;
        this.blobresult = await domtoimage.toPng(node);
    }

    // getUrlInformation(){
    //     if(this.paramsSubscription){
    //         this.paramsSubscription.unsubscribe();
    //     }
    //     this.paramsSubscription = this.route.params.subscribe(params => {
    //         if(params.idProduct){
    //             this.mainStore.step = 2;
    //         }
    //         if(params.idBg){
    //
    //         }
    //     });
    // }
    private  getBusiness(attribute=null){
        try {
            this.loadingBusiness = true;
            this.errorLoadBusiness = false;
            this.businessParams.business_name = this.route.snapshot?.params?.business_name;
            if(!this.businessParams.business_name){
                this.businessParams.business_name = 'decozin';
            }
            // const res = await this.businessService.getOneAsGuest(this.businessParams).toPromise();
            // this.business.loaded = this.entry !== null;
            const res = {
                result: {
                    data: data
                }
            };
            console.log('res', res);
            this.loader.start();
            if (attribute) {
                this.business[attribute] = res?.result?.data[attribute];
                if(attribute === 'phone'){
                    this.hiddenPhoneNumber = false;
                }
            } else {
                this.business = res?.result?.data;
                this.mainStore.selectedBusiness = this.business;
                console.log('this.business', this.business);
                if(this.business && this.business.backgrounds){
                    this.backgroundList = this.business.backgrounds;
                    this.initBGList();
                    // this.mainStore.setStep(1);
                    console.log('after this.initBGList()', this.images);
                    if(this.route.snapshot?.params?.idBg){
                        const bg = this.backgroundList.find(item => item.id == this.route.snapshot.params.idBg);
                        this.selection(this.images.find(img => bg && img.alt === bg.photo));
                    }else{
                        this.selection(this.images[0]);
                    }
                }
                if(this.business && this.business.products){
                    this.objectslist = this.business.products;
                    this.initObjectList();
                    console.log('this.initObjectLis', this.imagesObjects, this.mainStore.step);
                    if(this.route.snapshot?.params?.idProduct){
                        // this.mainStore.setStep(1);
                        const objImage = this.objectslist.find(item => item.id == this.route.snapshot.params.idProduct);
                        // this.selectObject(this.images.find(img => img.alt === objImage.photo));
                        console.log('objImage anass', objImage, this.route.snapshot.params.idProduct, this.objectslist);
                        this.entryObservable.subscribe(ready => {
                            if(ready){
                                // this.doeGalleryObjects.select(this.imagesObjects.findIndex(img => img.src === objImage?.src));
                                const selected = this.imagesObjects.findIndex(img => img.src === objImage?.src); //hello
                                if(selected){
                                    // this.imagesObjects.unshift()
                                    this.imagesObjects.splice(0,0,this.imagesObjects.splice(selected,1)[0]);
                                }
                                this.chooseObject(this.imagesObjects[0]);
                                this.entryObservable.complete();
                                this.changeDtc.detectChanges();
                            }
                        })
                    }
                }
                if(this.business?.parameter?.can_update_settings){

                    this.mainStore.disabledSteps = [];
                    if(!this.business.parameter.show_first_step){
                        this.mainStore.disabledSteps.push(1);
                    }
                    if(!this.business.parameter.show_second_step){
                        this.mainStore.disabledSteps.push(2);
                    }
                    if(!this.business.parameter.show_third_step){
                        this.mainStore.disabledSteps.push(3);
                    }
                    try{
                        if(this.mainStore.disabledSteps?.length>0){
                            this.stepperItems = this.stepperItems.filter(item =>
                                !this.mainStore.disabledSteps.includes(item.step_id));
                            console.log('bilan', toJS(this.mainStore.disabledSteps),
                                toJS(this.business.parameter.startup_step),
                                this.stepperItems,
                                this.stepperItems.filter(item =>
                                    !this.mainStore.disabledSteps.includes(item.step_id))
                            );
                        }
                        this.navigate(Number(this.business.parameter.startup_step));

                        this.setLang();
                        this.changeDtc.detectChanges();
                    }catch (error){
                        console.log('error', error);
                    }

                }else{
                    this.navigate(1);
                }

            }
        } catch(e) {
            console.log('error getting data', e);
            this.hiddenPhoneNumber = true;
            this.errorLoadBusiness = true;
        }finally {
            this.loadingBusiness = false;
            this.loader.stop();
        }
    }



    showInformation() {
        if (!this.business) {
            return;
        }
        const hidderBlure = {
            'hidden-blure': this.hiddenPhoneNumber
        }


        this.hiddenPhoneNumber = true;
        // this.businessParams.selected_products = [
        //     this.imagesObjects[3],
        //     // this.imagesObjects[4]
        // ];
        console.log('show showInformation', this.businessParams.selected_products);

        if(this.businessParams.selected_products && this.businessParams.selected_products.length>0){
           this.openOrderModal();
       }

    }



    openOrderModal() {
        const modalRef = this.modalService.open(OrderModalComponent, { size: 'xl' , centered: true, windowClass: 'myModal', backdrop: 'static'});
        modalRef.componentInstance.selected_products = this.businessParams.selected_products;

        domtoimage.toBlob(this.dropArea.nativeElement, {
            width: this.imgBg.nativeElement.width,
            height: this.imgBg.nativeElement.height,
        }).then( (blob) => {
                modalRef.componentInstance.blobimg = blob;
            }).finally(()=>{
            modalRef.result.then(result => {
                console.log('closed', result);
                if (result === 'QUERY' ) {
                    // this.getAll( );
                }
            }, reason => {
                console.log('closed', SharedClasses.getModalDissmissReason(reason));
            });
        });
    }

    thumbClick($event) {
        console.log('thumbClick', $event)
    }

    selection($event) {
        console.log('selection bg', $event);
        if($event)
        this.chooseBg($event.src);
    }

    selectObject($event) {
        console.log('selectObject anass', $event, this.objectslist);
        this.chooseObject(this.objectslist.find(item=>item.id === $event.data));
    }

    getPhotoUrl(item, isThumb = false){
            const regexp_upload = /^data:?[a-z]{5}\/[a-z]*;.*/;
            const patternLink = /^((http|https|ftp):\/\/)/;
            if(!item) return null;
            if (regexp_upload.test(item.photo)) {
                return item.photo;
            }
            if(patternLink.test(item.photo)) {
                return item.photo;
            }
            let photo = item.photo;
            if(isThumb && item.photo_thumb){
                photo = item.photo_thumb;
            }
            // return environment.photosBaseUrl+this.business?.name+'/'+photo;
            return 'assets/images/business_photos/'+photo;
    }

    // Form camera ************************************************************
    showCameraScreen() {
        // @ts-ignore
        navigator.getUserMedia({ video: true ,audio:true}, (stream) => {
            if(stream.getVideoTracks().length > 0){
                //code for when none of the devices are available
                console.log('HAVE ACCESS');
                this.showCamera = !this.showCamera;
            }else{
                // code for when both devices are available
                console.log('NO ACCESS');
            }
        }, error => {
            console.log('error getUserMedia', error)
            Swal.fire({
                title: this.translate.instant('FAILURE!'),
                html: error,
                icon: 'error',
                heightAuto: false
            });
        });

        console.log('showCameraScreen', this.showCamera);
    }

    public triggerSnapshot(): void {
        this.trigger.next();
    }

    public toggleWebcam(): void {
        this.showWebcam = !this.showWebcam;
    }

    public handleInitError(error: WebcamInitError): void {
        this.errors.push(error);
        console.log('errors', this.errors);

          Swal.fire({
            title: this.translate.instant('FAILURE!'),
            html: error?.message,
            icon: 'error',
            heightAuto: false
          });

    }

    public showNextWebcam(directionOrDeviceId: boolean|string): void {
        // true => move forward through devices
        // false => move backwards through devices
        // string => move to device with given deviceId
        this.nextWebcam.next(directionOrDeviceId);
    }

    public handleImage(webcamImage: WebcamImage): void {
        this.pictureTaken.emit(webcamImage);
        // const file = SharedClasses.from64ToImageFile(webcamImage.imageAsDataUrl);
        // console.log('file', file);
        this.images.unshift(new GalleryImage(webcamImage.imageAsDataUrl, webcamImage.imageAsDataUrl));
         this.selectedBackgroundIndex = 0;
         this.chooseBg(webcamImage.imageAsDataUrl);
         this.showCameraScreen();
    }

    public cameraWasSwitched(deviceId: string): void {
        console.log('active device: ' + deviceId);
        this.deviceId = deviceId;
    }

    public get triggerObservable(): Observable<void> {
        return this.trigger.asObservable();
    }

    public get nextWebcamObservable(): Observable<boolean|string> {
        return this.nextWebcam.asObservable();
    }

    //******************************************************************


    //******************************************************************
    // imageloadingPlaceholder = 'assets/images/place_1.png';
    imageloadingPlaceholder = 'assets/images/loading_5.gif';


    navigate(step) {
        // if(step === 3 && this.businessParams?.selected_products?.length>0){
        //     return;
        // }
        this.objectsComponentRefs.forEach(el => el.instance.disabled = step === 3);
        console.log('this.workspace', this.objectsComponentRefs);
        if(step === 1){
            // this.objectslist.forEach(item => item.selected = false);
            // console.log('this.objectslist', this.objectslist);
            // this.entry.clear();
        }

        // this.stepper.reset();

        this.mainStore.setStep(step);
        this.selectedStepperIndex = this.stepperItems.findIndex(item => item.step_id === this.mainStore.step) ;
        // this.selectedStepperIndex = 2;
        // this.stepper.linear = false;
        //
        // setTimeout(() => {
        //     this.stepper.selectedIndex = step - 1;
        //     this.stepper.linear = true;
        // }, 1);
        // console.log('this.stepper.selectedIndex hi', this.stepper.selectedIndex, 'step', step);
        console.log(' this.selectedStepperIndex',  this.selectedStepperIndex);
        this.changeDtc.detectChanges();
    }

    stepperSelectionChanged($event) {
        console.log('event', $event);
    }

    getSelectedIndex() {
        return this.mainStore.step - 1;
    }

    showPreview() {
        return true;
        const test = this.mainStore.step - 1;
        return test > 0 && !this.mainStore.disabledSteps?.includes(test);
    }

    showNext() {
        return true;
        const test = this.mainStore.step + 1;
        return test <= 3 && !this.mainStore.disabledSteps?.includes(test);
    }

    loadingBGImage($event: StateChange) {
        console.log('evet', $event);
        this.loadingStateBG = $event.reason;
    }

//     evet {reason: 'setup'}
// main.component.ts:888 evet {reason: 'observer-emit', data: ''}
// main.component.ts:888 evet {reason: 'start-loading'}
// main.component.ts:888 evet {reason: 'mount-image'}
// main.component.ts:888 evet {reason: 'loading-succeeded'}
// main.component.ts:888 evet {reason: 'finally'}
}

// TO DO
/*
Home page description
Rating
Images from backend
tooltips
drag select movable

Create laravel application

    + images user<<->>images
    + only super can see ratings
 */

// TODO 2
/*

Afficher les options convenables pour chaque screen
    ++++++++++++ toggle switch camera
    ++++++++++++ si camera:
        +++++++++++ toggle hide camera barré ligne rouge
        ++++++++++++ rotation
        ++++++++++++ take picture
    + si no camera
        + debugging on devive
        +++++++++++++++++++++++ ameliorer drag and drop
        ++++++++++++ + zoom avant arriere fonctionnel
       + camera si background fonctionnel
       + import from device si background
       +++++++++++++ dimensions si background
       +++++++++++++++++++++++ get data from backend background and objects
       ++++++++++++++++++++++ clean up


       TODO
      +++++++++++++++++++++ Fix upload photo

       +++++++++++++++++++++fix aws new accounnt




     Pricinnng plan
     Migration pricing
     Seeding

     Get pricinng plans
     + on demand
     + free tier

     + on demande
        ->get terms from
            + conversion
                + get connversion from pricinng table USA for now

            + storage
                + add column to pricinngs gb_price_usd


         -> get pricing planns with pricing attached to it
            -> show it in front ennd


         NO APPLY BUTTON
         -> registered user
         -> 5 Go for free
         -> 5 USD for free
         For 1 month

            every user
            get sum files size on every single monnth

            if he is over the size on his first month he is charged on dditionnnal files size with notification
            disable connversion price on first month


            HOW TO TRACK USAGE ON STORAGE
            //get user storage user from disk()->business_name returned with user enntity

            Create table storage usege
            -> business_id
            -> storage_size
            event on add-delete files from storage
            -> event add_file delete_file
            -> type product/background/order
            -> id_file
            -> size
            -> total size (from storage) compare it with calculated storage
              -> if good okay
              -> if not ...


              solution 2:
              select product, background, order table
              where  deleted  = null
              we get current items on database
              check if photo exists really on storage
              -> if no ignore it
              -> if yes get the size of this file
              -> sum up all sizes
                -> to sum up get difference between deleted at and created at for the current month for every file
                -> we get
                {
                    for_month: 7,
                    size: 4 Go,
                    duration: 456 secondes,
                    charge: 4 usd,
                    from: dateTime,
                    To: from+1month,
                }

                add this innnformation to amount to pay
                payment_table:
                    column for connversion
                    column for storage
                    amount to pay as sum no coulmn amount_to_pay

                    change amounnt to pay column to amount_coonversion
                    add column amount_storage ola blach get the informationn directly from state controller
                    set this value on login where null and past
                    make this happen for super user button 'synchronize' to check for all users

                    onn evry upload  execute function check freeTier
                    execute state function: if still -> do it else return alert
                    if confirm than do it

                    on every get state execute check free tier
                    do substraction price for storage
                    if negative yes if not alert
                    confirmation boolean value sent with upload update user connfirm_over_free_tier = true








       Commercialisation


   failure sceen after hebergement
 */


//TODO LISt
/*
    Make sure whtp, gmail, fb are workinng well
        + local
        + prod
    Replace swal ask phonne with modal
        + list images of selected products
        + show price and dimennsions of any of them
        + view for one product and multi
        + create form for orders fullname, phone, address with gps
        + confirm button


 */
