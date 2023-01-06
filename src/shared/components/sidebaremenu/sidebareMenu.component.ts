import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {SidebarItem} from "../../../app/Entities/sidebarItem";
import {MainStore} from "../../store/mainStore";
import {UserStore} from "../../store/user.store";


@Component({
  selector: 'app-sidebaremenu',
  templateUrl: './sidebaremenu.component.html',
  styleUrls: ['./sidebaremenu.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-10%)'}),
        animate('.4s linear', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('.4s linear', style({transform: 'translateY(-10%)'}))
      ])
    ])
  ]
})
export class SidebareMenuComponent implements OnInit {

  @Input() items: Array<SidebarItem> = [];
  constructor(private router: Router,
              private route: ActivatedRoute,
              public mainStore: MainStore,
              public userStore: UserStore,
              private changeDetectorRef: ChangeDetectorRef
              ) { }

  ngOnInit(): void {
  }

  toggleExpand(item) {
    item.opened = !item.opened;
  }

  showSubmenu(item){
    item.opened = true;
  }

  navigateSubMenu(link) {
  }

  hideSubMenuCondition(item){
   return true;
  }

  showSubMenu2Condition(item){
    return  false;
  }

  goToSubMenu2(item, subItem_1, subItem_2){

  }

  goToSubMenu1(item, subItem_1){
    // this.changeDetectorRef.detectChanges();
  }
}

// export interface SidebarItem {
//   id: number;
//   name: string;
//   link: string;
//   type: string;
//   icon: string;
//   srcIcon?: string;
//   implemented?: boolean;
//   opened?: boolean;
//   onlyFor?: Array<any>;
//   srcIcon_selectedStyle?: string;
//   relative?: boolean;
//   subMenu?: Array<SidebarItem>;
// }
