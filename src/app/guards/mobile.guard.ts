import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './../services/auth.service';
import { PaymentChannel } from './../enums/set.enum';

@Injectable()
export class MobileGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const paymentChannel = this.authService.GetPaymentChannel();
    if (paymentChannel === PaymentChannel.Mobile_Payment) {
      return true;
    } else {
      this.router.navigateByUrl('');
      return false;
    }
  }
}
