import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { Http, Headers} from '@angular/http';
// import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/do';
// import 'rxjs/add/operator/catch';

@Injectable()
export class PaymentService {
    paymentHeaders = new Headers();
    apiUrl = environment.apiUrl;
     public authorizationparams = JSON.parse(localStorage.getItem('__authorizationparams'));

    constructor(
        private http: Http,
        // private router: Router
    ) {
        this.paymentHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    }

    private paymentUrl = this.apiUrl + '/Payment/createpaymentrequest';
    private paymentResultUrl = this.apiUrl + '/CustomLogM/savecustomlogm';

    CreatePayment(data, token) {
        this.paymentHeaders.delete('Authorization');
        this.paymentHeaders.append('Authorization', 'Bearer ' + token);
        return this.http.post(this.paymentUrl, data, { headers: this.paymentHeaders }).pipe(map((res: any) => {
            return res.json();
        }));
    }

    ccPAyment(ccData, token) {
        this.paymentHeaders.delete('Authorization');
        this.paymentHeaders.append('Authorization', 'Bearer ' + token);
        return this.http.post(this.paymentUrl, ccData, { headers: this.paymentHeaders }).pipe(map((res: any) => {
            return res.json();
        }));
    }

    PaymentResult(result) {
        return this.http.post(this.paymentResultUrl, result, { headers: this.paymentHeaders }).pipe(map((res: any) => {
            return res.json();
        }));
    }



}
