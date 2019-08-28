import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from './../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EskisehirService {
  eskisehirHeaders = new Headers();
  public getteskisehirUrl = environment.apiUrl + '/Payment/startcreditcardpayment';

  constructor(
    private http: Http
  ) { }
  GetEskisehirUrl(data) {
    this.eskisehirHeaders.delete('AppId');
    this.eskisehirHeaders.append('AppId', '54C97CCD-4C44-49B2-99BA-9C8A213C18C6');
    this.eskisehirHeaders.delete('AppSecret');
    this.eskisehirHeaders.append('AppSecret', '2D718DFF-9BEB-4DE6-A57F-1D9B2302F406');
    return this.http.post(this.getteskisehirUrl, data, { headers: this.eskisehirHeaders }).pipe(map((res: any) => {
        return res.json();
    }));
}
}
