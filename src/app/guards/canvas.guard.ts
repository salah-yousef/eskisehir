import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from '../services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class CanvasGuard implements CanActivate {

  constructor(
    private ss: SharedService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (!this.ss.decodedData.isCanvasUsed) {
        return true;
      } else {
        this.router.navigate(['/result']);
        return false;
      }
  }
}
