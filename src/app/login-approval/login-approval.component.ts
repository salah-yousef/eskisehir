// import { error } from 'protractor';
import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { SmsLoginModel } from '../models/sms-login-model';
import { Loginverify } from '../models/loginverify';
import { SerializerObj } from '../helpers/serilalizer.function';
import { ToastrService } from 'ngx-toastr';
import { SessionControlService } from './../services/session-control.service';
import { PaymentChannel } from './../enums/set.enum';
import { PaymentService } from '../services/payment.service';
import { SharedService } from './../services/shared.service';


@Component({
  selector: 'app-login-approval',
  templateUrl: './login-approval.component.html',
  // styleUrls: ['./login-approval.component.scss'],
  providers: [AuthService, SessionControlService, PaymentService, SharedService]
})
export class LoginApprovalComponent implements OnInit {
  public amblemUrl : string;
  private currentTheme: string;
  constructor(
    private router: Router,
    private authService: AuthService,
    private paymentService: PaymentService,
    private toastr: ToastrService,
    private sessionControlService: SessionControlService,
    public ss: SharedService
  ) { }

  smscode: any;
  timeString: string;
  PaymentPriceCheckCount = 0;
  duration = 3 * 60;
  seconds = '--';
  minutes = '--';
  clockDisplay = '03:00';

  counter: any;
  phoneNumber = this.authService.GetPhoneNumber();
  // public decodedData = JSON.parse(localStorage.getItem('decodedData'));
  public decodedData = JSON.parse(sessionStorage.getItem('decodedData'));

  ngOnInit() {
    this.currentTheme = this.ss.currentTheme;
    this.amblemUrl  = this.currentTheme === 'pbesk' ?  'assets/images/svg/logo_esk.svg': 'assets/images/svg/amblem_pay-bros.svg';
    this.sessionControlService.GetSessionControl('login-approval');
    this.tickTock();
    document.getElementById('smscode').focus();
    if (this.decodedData.PaymentChannel.Id === PaymentChannel.Mobile_Payment) {
      // Mobil ödemelerde Operatör ve Fiyat bilgisini kontrol et
      this.PaymentPriceCheck();
    }
  }


  LoginCC(smsCode) {
    const LoginCCData: Loginverify = {
      Username: this.phoneNumber,
      OTPFunction: '1',
      VerificationCode: smsCode,
      PaymentRequestId: this.decodedData.Id,
      grant_type: 'password',
      Password: ''
    };

    this.authService.LoginGeneral(SerializerObj(LoginCCData)).subscribe((res: any) => {
      // console.log(res);
      localStorage.setItem('__authorizationparams', JSON.stringify(res));
      if (this.decodedData.PaymentChannel.Id === PaymentChannel.Mobile_Payment) {
        // this.router.navigateByUrl('mobile/approval');
        const paymentData = {
          SenderGSM: this.authService.GetPhoneNumber(),
          PaymentRequestId: this.decodedData.Id
        };
        this.createPayment(SerializerObj(paymentData), this.authService.GetAuthorizeParams().access_token);
      } else if (this.decodedData.PaymentChannel.Id === PaymentChannel.Credid_Card_Payment) {
        if (this.decodedData.IsOutsideOfLimits) {
          this.router.navigate(['result'], { queryParams: { error: 'maxlimit' } });
        } else {
          if (this.ss.currentTheme === 'pbesk') {
            this.router.navigateByUrl('select');
          }else{
            this.router.navigateByUrl('cc/info');
          }
        }

      } else if (this.decodedData.PaymentChannel.Id === PaymentChannel.TopUpDeposit) {
        if (this.decodedData.IsOutsideOfLimits) {
          this.router.navigate(['result'], { queryParams: { error: 'maxlimit' } });
        } else {
          this.router.navigateByUrl('banktransfer');
        }
      } else {
        alert('Ödeme kanalı bilgisi eksik');
      }
    }, (error) => {
      // tslint:disable-next-line:no-unused-expression
      this.ss.ToastrMessage('warning', error);
    }
    );
  }


  PaymentPriceCheck() {
    const params = {
      MerchantOrderId: this.decodedData.OrderId,
      SenderGSM: this.authService.GetPhoneNumber(),
      Id: this.decodedData.Id
    };
    this.authService.PaymentPriceCheck(params).subscribe((res: any) => {
      // console.log(res);
      this.PaymentPriceCheckCount++;
      if (res.Success && res.Data != null && res.Data.GSMOperator != null && res.Data.GSMOperator !== '') {
        this.decodedData.cellOperator = res.Data.GSMOperator;
        if (res.Data.Price != null && res.Data.Price !== '') {
          this.decodedData.BaseAmount = res.Data.Price;
        }
        sessionStorage.setItem('decodedData', JSON.stringify(this.decodedData));
      } else {
        if (this.PaymentPriceCheckCount <= 3) {
          this.PaymentPriceCheck();
        } else {
          console.log('Operatör bilgisi alınamadı!');
          this.router.navigate(['result'], { queryParams: { error: 'operator' } });
        }
      }
    });
  }

  createPayment(data, token) {
    this.paymentService.CreatePayment(data, token).subscribe((res: any) => {
      if (res.Success) {
        if (this.decodedData.IsOutsideOfLimits) {
          this.router.navigate(['result'], { queryParams: { error: 'maxlimit' } });
        } else {
          this.router.navigateByUrl('/mobile/approval');
        }
      } else {
        switch (res.ErrorMessages[0]) {
          case '3101':
          case '3102':
          case '3103':
          case '3104':
          case '3105':
          case '3106':
          case '3201':
          case '3202':
          case '3203':
          case '3204':
          case '3205':
          case '3206':
            this.router.navigate(['result'], { queryParams: { error: res.ErrorMessages[0] } });
            break;

          default:
            // this.toastr.warning(res.ErrorMessages[0], 'Dikkat');
            break;
        }
        // this.loading = false;
        // this.errorHandlerService.handleError(res);
      }
    });
  }

  reSMSLoginCode() {
    const SMSLoginData: SmsLoginModel = {
      GSM: this.phoneNumber,
      OTPFunctionId: 1
    };
    this.authService.LoginSMSCode(SMSLoginData).subscribe((res: any) => {
      if (res.Success) {
        this.duration = 3 * 60;
        this.tickTock();
      } else {
        this.toastr.warning('İşlem başarısız oldu!', 'Dikkat');
      }
    });
  }

  tickTock() {
    if (this.duration > 0) {
      this.counter = setInterval(() => {
        this.duration = this.duration - 1;
        if (this.duration <= 0) {
          clearInterval(this.counter);
        }
        if (this.duration % 60 < 10) {
          this.seconds = '0' + this.duration % 60;
        } else {
          this.seconds = (this.duration % 60).toString();
        }
        if (this.duration / 60 < 10) {
          this.minutes = '0' + parseInt('' + this.duration / 60, 10);
        } else {
          this.minutes = '' + parseInt((this.duration / 60).toString(), 10);
        }
        this.clockDisplay = this.minutes + ' : ' + this.seconds;
      }, 1000);
    }
  }

}
