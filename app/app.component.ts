import {
    Component, HostListener,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router  } from '@angular/router';
import {$screenSize, MainStore} from '../shared/store/mainStore';
export enum KEY_CODE {
    DELETE = 8,
}

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})

export class AppComponent {


	constructor(
		private translate: TranslateService,
		private router: Router,
		public mainStore: MainStore,
	) {
        this.translate.addLangs(['en', 'fr']);
        this.translate.setDefaultLang('en');
        const localLang: string = localStorage?.getItem('lang');
        if (['fr', 'en'].includes(localLang)){
            this.translate.use(localLang);
            this.mainStore.selectedLanguage = localLang;
        } else {
            this.translate.use('en');
        }

        this.onResize(null);

		// router.events.subscribe(event => {
            // tslint:disable-next-line:indent
		// if(event instanceof NavigationStart) {
        //     // tslint:disable-next-line:indent
		// 	this.isModuleLoading = true;
		// 	console.log('event started');
		// }else if(event instanceof NavigationEnd) {
		// 	this.isModuleLoading = false;
		// 	console.log('event end');
		// }
		// NavigationEnd
		// NavigationCancel
		// NavigationError
		// RoutesRecognized
		// });
			// this language will be used as a fallback when a translation isn't found in the current language
			// translate.setDefaultLang('en');
			// the lang to use, if the lang isn't available, it will use the current loader to get them
			// translate.use('en');
	}

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        // this.isSideBarOpened = window.innerWidth >= 992;
        // this.sidebarOverMode = window.innerWidth < 992;

        const width = window.innerWidth;
        if(width < $screenSize.SMALL){
            this.mainStore.screenSize = $screenSize.SMALL;
        }else
        if(width < $screenSize.MEDIUM){
            this.mainStore.screenSize = $screenSize.MEDIUM;
        }else
        if(width < $screenSize.LARGE){
            this.mainStore.screenSize = $screenSize.LARGE;
        }else
        if(width < $screenSize.TABLET){
            this.mainStore.screenSize = $screenSize.TABLET;
        }else
        if(width < $screenSize.LAPTOP){
            this.mainStore.screenSize = $screenSize.LAPTOP;
        }else {
            this.mainStore.screenSize = $screenSize.LAPTOPL;
        }
    }
}

// TO DO
/*
//////////Header -> Logo + Langue
//////////New object dimensions
//////////upload new background
//////////Fix footer:    + contact us  + Copyright
/////////zoom in/out
//////////sidebar issue
//////////Download functionnality
/:////////Background dimensions
/////////////selectedItem
//////////Button to home
Home page description
Rating
Images from backend
tooltips
drag select movable

Create laravel application
    + Authentication
    + images user<<->>images
 /////////   + front login super+admin
    + super can see all admins and there photos
    + admin can see his photos
    + only super can see ratings
////////////////Fix header logo=height
////////////////Translation
//////////////Sidebar toggle
vues laterales
 */
