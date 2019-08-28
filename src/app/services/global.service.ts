import { PaymentChannel } from './../enums/set.enum';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { Http, Headers } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from './payment.service';
import { AuthService } from './auth.service';
import { SerializerObj } from '../helpers/serilalizer.function';
import { map } from 'rxjs/operators';

@Injectable()
export class GlobalService {
    headers = new Headers();
    bankAccountHeaders = new Headers();
    constructor(
        private http: Http,
        private router: Router,
        private paymentService: PaymentService,
        private authService: AuthService,
        private activatedRoute: ActivatedRoute,
        private translate: TranslateService
    ) { }

    public decodedData: any = JSON.parse(sessionStorage.getItem('decodedData'));
    public authorizationparams = JSON.parse(localStorage.getItem('__authorizationparams'));
    public serviceError = JSON.parse(localStorage.getItem('serviceError'));
    // tslint:disable-next-line:max-line-length
    public cellOperator = (this.decodedData != null && this.decodedData.cellOperator == null || this.decodedData.cellOperator === undefined) ? '!' : this.decodedData.cellOperator;
    public sResult: any = JSON.parse(localStorage.getItem('sResult'));
    public currentPath = this.activatedRoute.routeConfig.path;
    public PaymentStatusUrl = environment.apiUrl + '/Payment/PaymentStatus';
    public gettopupbankaccountsUrl = environment.apiUrl + '/BankAccount/gettopupbankaccounts';
    public setupbanktransferrequestUrl = environment.apiUrl + '/Payment/setupbanktransferrequest';
    public createbanktransferrequestUrl = environment.apiUrl + '/Payment/createbanktransferrequest';


    PaymentStatus(data) {
        return this.http.post(this.PaymentStatusUrl, data, { headers: this.headers }).pipe(map((res: any) => {
            return res.json();
        }));
    }

    GetBankaccounts() {
        this.bankAccountHeaders.delete('Authorization');
        this.bankAccountHeaders.append('Authorization', 'Bearer ' + this.authorizationparams.access_token);
        return this.http.post(this.gettopupbankaccountsUrl, { headers: this.bankAccountHeaders }).pipe(map((res: any) => {
            return res.json();
        }));
    }
 
    GetCurrency() {
        let Currency = 'TRY';
        if (this.decodedData.Currency != null && this.decodedData.Currency.AlphabeticalCode != null) {
            Currency = this.decodedData.Currency.AlphabeticalCode;
        }
        return Currency;
    }

    SetupBankTransferTequest(data) {
        this.bankAccountHeaders.delete('Authorization');
        this.bankAccountHeaders.append('Authorization', 'Bearer ' + this.authorizationparams.access_token);
        return this.http.post(this.setupbanktransferrequestUrl, data, { headers: this.bankAccountHeaders }).pipe(map((res: any) => {
            return res.json();
        }));
    }

    CreateBankTransferRequest(data) {
        this.bankAccountHeaders.delete('Authorization');
        this.bankAccountHeaders.append('Authorization', 'Bearer ' + this.authorizationparams.access_token);
        return this.http.post(this.createbanktransferrequestUrl, data, { headers: this.bankAccountHeaders }).pipe(map((res: any) => {
            return res.json();
        }));
    }


    PaymentStatusRouter(res) {
        if (res != null && res.Data != null) {
            switch (res.Data.ResultDetailId) {
                case 1: // Created
                    console.log(1);
                    break;
                case 2: // Successful
                    console.log(2);
                    this.router.navigate(['result'], { queryParams: { status: 'success' } });
                    break;
                case 3: // Failed
                    this.router.navigate(['result'], { queryParams: { status: 'error' } });
                    console.log(3);
                    break;
                case 5: // Pending
                    console.log(5);
                    // this.router.navigateByUrl('cc/confirm');
                    // this.currentPath === 'cc/confirm'
                    if (this.currentPath === 'secure') {
                        this.router.navigate(['cc/confirm'], { queryParams: { operator: 'confirm' } });
                    }
                    break;
                case 10: // MockTransaction
                    console.log(10);
                    break;
                default:
                    console.log(res.Data.ResultDetailId);
                    break;
            }
        }
        this.signalRBrokenLog(res);
    }

    signalRBrokenLog(res) {
        const data = {
            LogTypeId: 13,
            UserId: this.authorizationparams.UserId,
            Message1: 'LogTime :' + new Date(),
            Message2: 'userPhoneNumber: ' + this.authService.GetPhoneNumber() + ' operator:' + this.cellOperator,
            Message3: 'SignalRConnectionId :' + localStorage.getItem('_SignalRConnection'),
            Message4: this.authorizationparams.access_token,
            Message5: 'ResultDetailId:' + res.Data.ResultDetailId,
            Message6: 'ResultDetailName:' + res.Data.ResultDetailName,
            Message7: 'Current Path:' + this.currentPath,
            Message8: 'Service Error:' + this.serviceError,
            PaymentMerchantOrderId: this.decodedData.OrderId,
            PaymentRequestId: this.decodedData.Id,
            PaymentResult: '',
        };
        this.paymentService.PaymentResult(SerializerObj(data)).subscribe((resp: any) => {
            // console.log('log 13 gönderildi');
        });
    }

}
