import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import {MainComponent} from './main/main.component';
import {Main2Component} from "./main2/main.component";


const routes: Routes = [
    // {
    //     path: 'v1',
    //     pathMatch: 'full',
    //     component: MainComponent
    //     // canActivate: [IsLoginGuard],
    //     // canLoad: [IsLoginGuard]
    // },
    {
        path: '',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'αρχική'
            },
            {
                path: ':business_name',
                component: Main2Component
            },
            {
                path: ':business_name/:idProduct',
                component: Main2Component
            },
            {
                path: ':business_name/:idProduct/:idBg',
                component: Main2Component
            }
        ]
        // canActivate: [IsLoginGuard],
        // canLoad: [IsLoginGuard]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
