import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from './../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class BankService {

    headers = new Headers();
    constructor(
        private http: Http
    ) { }

    public GetBankaccountUrl = environment.apiUrl + '/BankAccount/getbankaccount';

    GetBankaccounts(data) {
        return this.http.post(this.GetBankaccountUrl, data, { headers: this.headers }).pipe(map((res: any) => {
            return res.json();
        }));
    }

}
