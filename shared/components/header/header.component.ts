import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {UserService} from '../../../app/network/services';
import {MainStore} from "../../store/mainStore";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

	private isLoggedIn = false;
	private subscription = new Subscription();

  constructor(private user: UserService, public mainStore: MainStore) {
  	// this.subscription.add(this.user.isLoggedIn.subscribe((res: boolean) => {
  	// 	this.isLoggedIn = res;
  	// }));
  }

  ngOnInit(): void {
  }

  logout(){
  	// this.user.logout();
  }

  loggedIn(){
  	// return this.isLoggedIn;
  }

  ngOnDestroy(){
  	this.subscription.unsubscribe();
  }

}
