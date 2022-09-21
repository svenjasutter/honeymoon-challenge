import { Component, OnInit } from '@angular/core';
import { SupabaseAuthService } from 'app/supabase-auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard',     title: 'Dashboard',         icon:'nc-tile-56',       class: '' },
    { path: '/instructions',     title: 'Instructions',         icon:'nc-bullet-list-67',       class: '' },
    { path: '/gallery',     title: 'Gallery',         icon:'nc-album-2',       class: '' },
    // { path: '/icons',         title: 'Icons',             icon:'nc-diamond',    class: '' },
    // { path: '/maps',          title: 'Maps',              icon:'nc-pin-3',      class: '' },
    // { path: '/notifications', title: 'Notifications',     icon:'nc-bell-55',    class: '' },
    // { path: '/user',          title: 'User Profile',      icon:'nc-single-02',  class: '' },
    // { path: '/table',         title: 'Table List',        icon:'nc-tile-56',    class: '' },
    // { path: '/typography',    title: 'Typography',        icon:'nc-caps-small', class: '' }
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    constructor(
        private authService:SupabaseAuthService,
        private router:Router){

    }
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }

    logout(){
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Du wird ausgeloggt.',
            showConfirmButton: false,
            timer: 1500
          })
        this.authService.signOut();
        this.router.navigate(['signIn']);
    }
}
