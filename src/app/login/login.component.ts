import { SmsLoginModel } from '../models/sms-login-model';
import { AuthService } from '../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../services/global.service';
import { PaymentService } from '../services/payment.service';
import { SerializerObj } from '../helpers/serilalizer.function';
import { SharedService } from './../services/shared.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [AuthService, GlobalService, PaymentService, SharedService]
})
export class LoginCCComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private globalService: GlobalService,
    private paymentService: PaymentService,
    public ss: SharedService
  ) { }


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
    localStorage.removeItem('userPhoneNumber');
    document.body.classList.add(this.ss.currentTheme);
    this.hello();
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
    console.log(data.value.phoneNumber)
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
