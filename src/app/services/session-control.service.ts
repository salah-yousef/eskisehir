import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class SessionControlService {

    constructor(
        private router: Router
    ) { }

    GetSessionControl(param) {
        const refreshStatus = sessionStorage.getItem(param);
        if (refreshStatus === '1' && environment.refreshControl) {
            this.router.navigate(['result'], { queryParams: { error: 'refresh' } });
        } else {
            sessionStorage.setItem(param, '1');
        }
    }
}
