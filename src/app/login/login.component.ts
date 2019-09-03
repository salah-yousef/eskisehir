import { SmsLoginModel } from '../models/sms-login-model';
import { AuthService } from '../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../services/global.service';
import { PaymentService } from '../services/payment.service';
import { SerializerObj } from '../helpers/serilalizer.function';
import { SharedService } from './../services/shared.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [AuthService, GlobalService, PaymentService, SharedService]
})
export class LoginCCComponent implements OnInit {
  public amblemUrl: string;
  ispbesk: boolean;
  constructor(
    private router: Router,
    private authService: AuthService,
    private globalService: GlobalService,
    private paymentService: PaymentService,
    translate: TranslateService,
    public ss: SharedService
  ) {
    translate.use(ss.CurrentLang());
  }


  public phoneNumber = '';
  public getPhoneNumberStatus = false;
  decodedData = this.globalService.decodedData;


  public ccMask = {
    mask: ['+', '90', '', '(', /[5]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/],
    guide: false,
    keepCharPositions: true,
    placeholderChar: '_',
    showMask: true
  };

  CCLoginForm = new FormGroup({
    phoneNumber: new FormControl(undefined, [Validators.required])
  });


  ngOnInit() {
    this.amblemUrl  = this.ss.CurrentTheme() === 'pbesk' ?  'assets/images/svg/logo_esk.svg': 'assets/images/svg/amblem_pay-bros.svg';
    localStorage.removeItem('userPhoneNumber');
    document.body.classList.add(this.ss.CurrentTheme());
    this.hello();
    this.ispbesk = this.ss.CurrentTheme() === 'pbesk' ? true : false;
  }

  hello() {
    const data = {
      LogTypeId: 17, // first visit
      Message1: 'LogTime :' + new Date(),
      Message2: this.globalService.decodedData.MerchantId,
      Message3: 'I m Here',
      PaymentMerchantOrderId: this.globalService.decodedData.OrderId,
      PaymentRequestId: this.globalService.decodedData.Id,
      PaymentResult: 'Hello',
    };
    this.paymentService.PaymentResult(SerializerObj(data)).subscribe((res: any) => { });
  }


  getSMSLoginCode(data) {
    data = data.value.phoneNumber.internationalNumber.replace(/\D/g, '');
    localStorage.setItem('userPhoneNumber', data.replace(/\D/g, ''));
    const SMSLoginData: SmsLoginModel = {
      GSM: data,
      OTPFunctionId: 1
    };
    this.authService.LoginSMSCode(SMSLoginData).subscribe((res: any) => {
      // localStorage.setItem('LoginSMSCode', JSON.stringify(res));
      if (res.Success) {
        this.router.navigateByUrl('login/approval');
      }
    });
  }

}
