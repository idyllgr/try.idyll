import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MainStore} from "../../store/mainStore";

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {

	language:string;

	constructor(private translate: TranslateService, public mainStore: MainStore) { }

	ngOnInit(): void {
		this.language = this.translate.getDefaultLang();
	}


	selectLanguage(lang){
	    this.mainStore.selectedLanguage = lang;
	    if(['fr', 'en'].includes(lang)) {
            localStorage.setItem('lang', lang);
            const localLang: string = localStorage.getItem('lang');
            this.translate.use(localLang);
        }
	    // this.translate.setTranslation(lang);
    }
}
