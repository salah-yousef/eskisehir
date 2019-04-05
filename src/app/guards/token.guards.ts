import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable()
export class TokenGuards implements CanActivate {

    constructor(
        private router: Router
    ) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        if (!environment.production) {
            // return true;
        }
        // if (localStorage.getItem('decodedData') != null) {
        if (sessionStorage.getItem('decodedData') != null) {
            return true;
        } else {
            this.router.navigate(['/paybros']);
            return false;
        }
        // const logged = this.loginService.IsLoggedIn();
        // if (logged) {
        //     return true;
        // } else {
        //     this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
        //     return false;
        // }

    }
}
