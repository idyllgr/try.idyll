import {HostListener, Injectable} from '@angular/core';
import {observable, action, computed} from 'mobx-angular';
import {SidebarItem} from "../../app/Entities/sidebarItem";
import {$userRoles} from "../../app/network/services";
import {TranslateService} from "@ngx-translate/core";
import {UserStore} from "./user.store";

export enum $screenSize {
    SMALL = 320,
    MEDIUM = 375,
    LARGE = 425,
    TABLET = 768,
    LAPTOP = 1024,
    LAPTOPL = 1440,
}
interface Image {name: string; value: any;}

@Injectable({
    providedIn: 'root'
})
export class MainStore {
    @observable selectedBusiness;
    @observable msgsNotificationPayment;
    @observable sidebarItemsAdmin: Array < SidebarItem > = [
        {
            id: 5,
            name: 'MY BUSINESSES',
            type: 'link',
            icon: 'icon-credit-cards-payment',
            link: '/admin/businesses',
            onlyFor: [$userRoles.SUPER],
            opened: false,
        },
        {
            id: 1,
            name: 'MY PAYPAL',
            type: 'link',
            icon: 'fa fa-line-chart',
            link: '/admin/paypal',
            onlyFor: [$userRoles.SUPER],
            opened: false,
        },
        {
            id: 1,
            name: 'DASHBOARD',
            type: 'link',
            icon: 'fa fa-line-chart',
            link: '/admin/dashboard',
            onlyFor: [$userRoles.SUPER, $userRoles.ADMIN],
            opened: false,
        },
        {
            id: 1,
            name: 'MY ORDERS',
            type: 'link',
            icon: 'icon-orders',
            link: '/admin/orders',
            onlyFor: [$userRoles.SUPER, $userRoles.ADMIN],
            opened: false,
        },
        {
            id: 2,
            name: 'MY PRODUCTS',
            type: 'link',
            icon: 'icon-matrix', //'icon-people',
            link: '/admin/products',
            opened: false,
            onlyFor: [$userRoles.SUPER, $userRoles.ADMIN],
            // subMenu: [
            //   {
            //     id: 6,
            //     name: 'Utilisaturs',
            //     type: 'link',
            //     icon: 'icon-event',
            //     link: '/administration/users',
            //     relative: false,
            //     opened: false,
            //     // onlyFor: [$userRoles.SUPER, $userRoles.Director],
            //   }
            // ]
        },
        {
            id: 1,
            name: 'MY BACKGROUNDS',
            type: 'link',
            icon: 'icon-orders',
            link: '/admin/backgrounds',
            onlyFor: [$userRoles.SUPER, $userRoles.ADMIN],
            opened: false,
        },
        {
            id: 5,
            name: 'MY PAYMENTS',
            type: 'link',
            icon: 'icon-credit-cards-payment',
            link: '/admin/payments',
            onlyFor: [$userRoles.SUPER, $userRoles.ADMIN],
            opened: false,
            notification: null
        },
    ];
    @observable screenSize = $screenSize.LAPTOP;
    @observable isSideBarOpened = true;
    @observable selectedLanguage = 'en';
    @observable sidebarConfiguration =
        {
            openIcon: '',
            closeIcon: '',
            colors: {
                darkMode: true,
                background: '#eee',
                font: '#000',
                darkModeBackground: '#333',
                darkModeFont: '#fff'
            },
            closeAfterClick: true,
            mobile: false,
            position: 'sticky',
            mobileTitle: 'I am a mobile title'
        };
    @observable step = 1;
    @observable rating = 1;
    sidebarOverMode: boolean;
    @observable images: Array<Image> = [];
    @observable disabledSteps = [];

    constructor( ) { }

    @action setSideBarOpened(sidebarItems) {
        this.isSideBarOpened = sidebarItems;
    }

    @action setStep(newStep) {
        // if((newStep >= 0 || newStep <= 3) && !this.disabledSteps.includes(newStep)){
        //     this.step = newStep;
        // }
        const incr = this.step < newStep;
        while (this.disabledSteps.includes(newStep)){
            if(incr){
                newStep++;
            }else {
                newStep--;
            }
            if((newStep <= 0 || newStep > 3)){
                break;
            }
        }
        if((newStep > 0 || newStep <= 3)){
            this.step = newStep;
        }
    }

    @computed
    get getIsSideBarOpened() {
        return this.isSideBarOpened;
    }

    getFontColor(bgColor) {
        if (!bgColor) { return ''; }
        return (parseInt(bgColor.replace('#', ''), 16) > 0xffffff / 2) ? '#000' : '#fff';
    }
}
