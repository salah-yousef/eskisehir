import { Loginverify } from './../models/loginverify';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { Http, Headers } from '@angular/http';
import { ErrorHandlerService } from './error-handler.service';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';



@Injectable()
export class AuthService {
    headers = new Headers();
    decodeHeaders = new Headers();
    paymentHeaders = new Headers();
    constructor(
        private http: Http,
        private errorHandlerService: ErrorHandlerService
    ) {
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.decodeHeaders.append('Content-Type', 'application/json');
    }

    private DecodePaymentUrl = environment.apiUrl + '/Payment/decodepayment';
    private LoginMobileUrl = environment.apiUrl + '/User/loginverify';
    private LoginSMSCodeUrl = environment.apiUrl + '/User/login';
    private PaymentOperatroUrl = environment.apiUrl + '/Payment/MobilePaymentFindOperator';
    private PaymentPriceUrl = environment.apiUrl + '/Payment/PaymentPrice';
    public decodedData = JSON.parse(sessionStorage.getItem('decodedData'));

    GetPaymentChannel() {
        return this.decodedData.PaymentChannel.Id;
    }

    GetPhoneNumber() {
        return localStorage.getItem('userPhoneNumber');
    }
    GetAuthorizeParams() {
        return JSON.parse(localStorage.getItem('__authorizationparams'));
    }

    DecodePayment(data) {
        return this.http.post(this.DecodePaymentUrl, data, { headers: this.decodeHeaders }).pipe(map((res: any) => {
            return res.json();
        }));
    }

    LoginGeneral(data): Observable<Loginverify> {
        return this.http.post(this.LoginMobileUrl, data, { headers: this.headers }).pipe(map((res: any) => {
            return res.json();
        })).catch(this.errorHandlerService.handleError);
    }
    LoginSMSCode(data) {
        return this.http.post(this.LoginSMSCodeUrl, data).pipe(map((res: any) => {
            return res.json();
        }));
    }

    PaymentPriceCheck(data) {
        return this.http.post(this.PaymentPriceUrl, data).pipe(map((res: any) => {
            return res.json();
        })).catch(this.errorHandlerService.handleError);
    }

    GetPaymentOperator(data) {
        return this.http.post(this.PaymentOperatroUrl + '?GSM=' + data, '').pipe(map((res: any) => {
            return res.json();
        }));
    }


}
