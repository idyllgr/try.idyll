import {
    AfterContentChecked,
    AfterContentInit, AfterViewChecked,
    AfterViewInit, ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import {SharedClasses} from "../../../shared/classes/SharedClasses";
import {Subject} from "rxjs/Subject";
import {MainStore} from "../../../shared/store/mainStore";

export enum KEY_CODE {
    DELETE = 8,
}

@Component({
    selector: 'app-drag-resize',
    templateUrl: './dragresize.component.html',
    styleUrls: ['./dragresize.component.scss'],
})
export class DragresizeComponent implements OnInit, AfterViewInit {
    loading: boolean;
    isDeleting: boolean;
    @Input() disabled = false;
    private contentReady = new Subject();
    @Input() product: any;
    @Input() set src(val: string) {
        this.imgSrc = val;
        // this.getMeta(val);
        this.contentReady.subscribe(ready => {
            if(ready){
                this.getMeta(val);
                this.contentReady.complete();
            }
        });
    }
    imgSrc;
    x: number;
    y: number;
    px: number;
    py: number;
    @Input() width: number;
    @Input() height: number;
    @Input() parentElement: ElementRef;
    trashElement;
    trashCoordinnantes;

    positionRelativeToParent = {
        x: null,
        y: null,
        width: null,
        height: null,
    }

    @Input() set objectTrash(val) {
        this.trashElement = val;
        const rect = val?.nativeElement.getBoundingClientRect();

        this.trashCoordinnantes = {
            left: (rect?.left || 0) + window?.scrollX,
            top: (rect?.top || 0) + window?.scrollY,
            width: val?.nativeElement.clientWidth,
            height: val?.nativeElement.clientHeight
        };
    }
    @Input() selected: boolean;
    minArea: number;
    draggingCorner: boolean;
    draggingWindow: boolean;
    ratio: number;
    resizer: Function;
    speedResize = 1;
    hovered = false;
    @Output() blocked = false; //TODO BLOCK IT ON DRAD OR RESISE AND KEEP RATION WITH PARENT ELEMENNT
    @Output() delete: EventEmitter<string> = new EventEmitter();
    @Output() isDragging: EventEmitter<boolean> = new EventEmitter();
    touchStart1$;

    // @ViewChild('MyObject') MyObject: ElementRef;

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (event.keyCode === KEY_CODE.DELETE) {
            if(this.selected){
                this.deleteItem();
            }
        }
    }

    @HostListener('document:click', ['$event'])
    clickout(event) {
        if(this.eRef.nativeElement.contains(event.target)) {
            this.selected = true;
        } else {
            this.selected = false;
        }
    }

    constructor(private eRef: ElementRef, private cdref: ChangeDetectorRef, public mainStore: MainStore) {
        this.x = null;
        this.y = null;
        this.px = null;
        this.py = null;
        this.width = null;
        this.height = null;
        this.draggingCorner = false;
        this.draggingWindow = false;
        this.minArea = 10;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        if(this.contentReady && !this.contentReady.isStopped){
            this.contentReady.next(true);
        }
    }

    getMeta(url) {
        const img = new Image();
        img.src = url;
        this.loading = true;
        this.cdref.detectChanges();
        img.onload = (e:any) => {
            if(e && e.path && e.path.length>0){
                let width =  e.path[0].naturalWidth;
                let height =  e.path[0].naturalHeight;
                const ratio = this.getRatio(width, height); // w/h
                if(this.parentElement){
                    const parentWidth = this.parentElement.nativeElement.offsetWidth;
                    if(width > parentWidth*20/100){
                        width = parentWidth *20/100;
                        height = width / ratio;
                    }
                    if(this.parentElement.nativeElement.offsetWidth > window.innerWidth){
                        this.x = window.innerWidth / 3;
                    }else{
                        this.x = this.parentElement.nativeElement.offsetWidth / 3;
                    }
                    this.y = this.parentElement.nativeElement.offsetHeight / 8;
                }

                this.width = width;
                this.height = height;
                this.ratio = ratio;
                this.loading = false;
                this.cdref.detectChanges();
            }
        };
        img.onerror = (e: any) => {
            this.loading = false;
        }
    }

    setRelativeCoordinates(){
        this.positionRelativeToParent = {
            x: this.x / this.parentElement.nativeElement.x,
            y: this.y / this.parentElement.nativeElement.y,
            width: this.width / this.parentElement.nativeElement.width,
            height: this.height / this.parentElement.nativeElement.height
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event?: Event) {
       // this.x = this.positionRelativeToParent.
    }

    getRatio(width, height){
        const num = Number(width / height);
        const roundedString = num.toFixed(2);
        return Number(roundedString);
    }

    area() {
        return this.width * this.height;
    }

    onWindowPress(event) {
        // event.stopPropagation();
        if(event && event.touches && event.touches.length>0){
            this.px = event.touches[0].clientX;
            this.py = event.touches[0].clientY;
        }else{
            this.px = event.clientX;
            this.py = event.clientY;
        }
        this.draggingWindow = true;
        this.draggingCorner = false;
        this.selected = true;
        try{
            event.stopPropagation();
            event.preventDefault();
        }catch(e){

        }
    }

    onWindowDrag(event) {
        if (!this.draggingWindow) {
            return;
        }
        if(this.draggingCorner){
            return;
        }

        if(!this.checkBoundaries(event)){
            return;
        }
        this.isDragging.emit(true);
        this.selected = true;
        let offsetX = event.clientX - this.px;
        let offsetY = event.clientY - this.py;

            this.x += offsetX;
            this.y += offsetY;
            this.px = event.clientX;
            this.py = event.clientY;


        this.setRelativeCoordinates();
        try{
            event.stopPropagation();
            event.preventDefault();
        }catch(e){

        }
    }

    checkIfTrash(event){
        // const objectTrash = document.getElementById('objectTrash');
        //
        // console.log('TRASH checking', objectTrash);
        // // if(!this.objectTrash) return;
        // if(!objectTrash) return;
        // objectTrash.addEventListener('touchmove', (e) => {
        //     console.log('TRASH VALIDD')
        // })
        // if(event.clientX > objectTrash.clientLeft &&
        //     event.clientX < objectTrash.clientLeft +
        //     objectTrash.clientWidth
        // ){
        //     console.log('TRASH valid')
        // }
    }

    topLeftResize(offsetX: number, offsetY: number) {
        let oldWidth = this.width;
        let oldHeight = this.height;
        oldWidth -= offsetX * this.speedResize;
        oldHeight = oldWidth / this.ratio;
        if( this.getRatio(oldWidth, oldHeight) === this.ratio){
            this.x += offsetX * this.speedResize;
            this.y += offsetY * this.speedResize;
            this.width = oldWidth;
            this.height = oldHeight;
        }
    }

    topRightResize(offsetX: number, offsetY: number) {
        let oldWidth = this.width;
        let oldHeight = this.height;
        oldWidth += offsetX * this.speedResize;
        oldHeight = oldWidth / this.ratio;
        if(this.getRatio(oldWidth, oldHeight)  === this.ratio){
            this.y += offsetY * this.speedResize;
            this.width = oldWidth;
            this.height = oldHeight;
        }
    }

    bottomLeftResize(offsetX: number, offsetY: number) {
        let oldWidth = this.width;
        let oldHeight = this.height;
        oldWidth -= offsetX * this.speedResize;
        // oldHeight += offsetY * this.speedResize;
        oldHeight = oldWidth / this.ratio;
        if(this.getRatio(oldWidth, oldHeight)  === this.ratio){
            this.x += offsetX * this.speedResize;
            this.width = oldWidth;
            this.height = oldHeight;
        }
    }

    bottomRightResize(offsetX: number, offsetY: number) {
        // if(offsetX > offsetY){
        //     let oldWidth = this.width;
        //     let oldHeight = this.height;
        // }
        // offsetY = this.ratio * offsetX;
        let oldWidth = this.width;
        let oldHeight = this.height;
        oldWidth +=  offsetX * this.speedResize;//* this.speedResize;
        oldHeight =  oldWidth / this.ratio;//* this.speedResize;
        if(this.getRatio(oldWidth, oldHeight)  === this.ratio){
            this.width = oldWidth;
            this.height = oldHeight;
        }
    }






    onCornerClick(event: any, resizer?: Function) {
        // let offX = 0;
        // let offY= 0;
        // if("touchmove" == event.type)
        // {
        //     offX = event.touches[0].clientX - this.x;
        //     offY = event.touches[0].clientY - this.y;
        // }
        // else
        // {
        //     offX = event.offsetX;
        //     offY = event.offsetY;
        // }
        if(event && event.touches && event.touches.length >0){
            this.px = event.touches[0].clientX;
            this.py = event.touches[0].clientY;
        }else{
            this.px = event.clientX;
            this.py = event.clientY;
        }
        this.draggingCorner = true;

        this.resizer = resizer;
        this.selected = true;

        try{
            event.preventDefault();
            event.stopPropagation();
        }catch (e){
            console.log('e', e);
        }
    }


    @HostListener('document:mousemove', ['$event'])
    onCornerMove(event) {
        if(SharedClasses.ismobileAndTabletCheck()) {
            return;
        }
        if (!this.draggingCorner) {
            return;
        }
        this.selected = true;
        let offsetX = event.clientX - this.px;
        let offsetY = event.clientY - this.py;

        let lastX = this.x;
        let lastY = this.y;
        let pWidth = this.width;
        let pHeight = this.height;

        this.resizer(offsetX, offsetY);
        if (this.area() < this.minArea) {
            this.x = lastX;
            this.y = lastY;
            this.width = pWidth;
            this.height = pHeight;
        }
        this.px = event.clientX;
        this.py = event.clientY;
    }

    @HostListener('document:touchend', ['$event'])
    checkdelete(event){
        if(this.isDeleting){
            this.deleteItem();
        }
    }

    deleteItem(){
        this.delete.emit(this.product);
    }

    @HostListener('document:touchmove', ['$event'])
    onCornerDragTouch(event) {
        event = event.touches[0];
        if (!this.draggingCorner) {
            return;
        }
        this.selected = true;
        let offsetX = event.clientX - this.px;
        let offsetY = event.clientY - this.py;


        let lastX = this.x;
        let lastY = this.y;
        let pWidth = this.width;
        let pHeight = this.height;

        this.resizer(offsetX, offsetY);
        if (this.area() < this.minArea) {
            this.x = lastX;
            this.y = lastY;
            this.width = pWidth;
            this.height = pHeight;
        }
        this.px = event.clientX;
        this.py = event.clientY;
    }


    @HostListener('document:mouseup', ['$event'])
    onCornerRelease(event: MouseEvent) {
        this.draggingWindow = false;
        this.draggingCorner = false;
        this.isDragging.emit(false);
    }

    @HostListener('document:touchcancel', ['$event'])
    onCornerTouchRelease(event: MouseEvent) {
        this.draggingWindow = false;
        this.draggingCorner = false;
        this.isDragging.emit(false);
        // this.checkBoundaries(this.x, this.y);
    }

    checkBoundaries(event){
        // const newX = this.x;
        // const newY = this.y;
        //
        // let offset = 90 / 100;
        // if(newX + this.width * offset < 0 ||
        //     newY + this.height * offset < 0 ||
        //     newX + this.width + this.width * offset > this.parentElement.nativeElement.offsetWidth ||
        //     newY + this.height + this.height * offset > this.parentElement.nativeElement.offsetHeight
        // ){
        //     this.isDeleting = true;
        //    // return false;
        // }else{
        //     this.isDeleting = false;
        // }

        // if(event.clientX > this.trashCoordinnantes.left &&
        //     event.clientX < this.trashCoordinnantes.width + this.trashCoordinnantes.left &&
        //     event.clientY > this.trashCoordinnantes.top &&
        //     event.clientY < this.trashCoordinnantes.height + this.trashCoordinnantes.top
        //
        // ){
        //     this.isDeleting = true;
        //    // return false;
        // }else{
        //     this.isDeleting = false;
        // }

        // offset = 50 / 100;
        // if(newX + this.width * offset < 0 ||
        //     newY + this.height * offset < 0 ||
        //     newX + this.width + this.width * offset > this.parentElement.nativeElement.offsetWidth ||
        //     newY + this.height + this.height * offset > this.parentElement.nativeElement.offsetHeight
        // ){
        //     this.isDeleting = true;
        //     // this.delete.emit();
        //    // return false;
        // }

        // event.clientX - this.px;
        // let offsetY = event.clientY




        // console.log('event', event);
        // if((event.clientX + this.width) > (this.parentElement.nativeElement.x + this.parentElement.nativeElement.width)){
        //     return false;
        // }
        //
        // if((event.clientX) < (this.parentElement.nativeElement.x)){
        //     return false;
        // }
        //
        // if((event.offsetY + this.height) > (this.parentElement.nativeElement.y + this.parentElement.nativeElement.height)){
        //     return false;
        // }
        //
        // if((event.offsetY) < (this.parentElement.nativeElement.y)){
        //     return false;
        // }

        return true;
    }
}

//TODO
/*
    Resize on mobile screen
    make object inside parent boundaries
    drag parent -> move object also

 */
