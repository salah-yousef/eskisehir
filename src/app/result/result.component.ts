import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentChannel } from './../enums/set.enum';
import { PaymentService } from './../services/payment.service';
import { AuthService } from './../services/auth.service';
import { GlobalService } from './../services/global.service';
import { SharedService } from './../services/shared.service';
import { SerializerObj } from '../helpers/serilalizer.function';


@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  providers: [PaymentService, AuthService, GlobalService, SharedService]
})
export class ResultComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private paymentService: PaymentService,
    private authService: AuthService,
    private globalService: GlobalService,
    public ss: SharedService
  ) { }

  public decodedData = this.globalService.decodedData;
  sResult = this.globalService.sResult;

  step = { bar: 100, step1: 'check', step2: 'check', step3: 'check' };
  queryParams;

  private errorCode = 'null';
  private statusCode = 'null';

  public returnUrl: string;
  errorText: string;

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.errorCode = params.error || null;
      this.statusCode = params.status || null;
      if (this.statusCode === 'success') {
        this.sResult = { Success: true };
      } else if (this.statusCode === 'error') {
        this.sResult = { Success: false };
      }
    });

    if (this.sResult == null || !this.sResult.Success || this.statusCode === 'error') {
      this.step = { bar: 100, step1: 'check', step2: 'check', step3: 'error' };
    }
    if (this.sResult != null && this.sResult.Success) {
      this.returnUrl = this.decodedData.SuccessUrl;
    } else {
      this.returnUrl = this.decodedData.FailUrl;
    }
    this.ErrorStatus();
    this.PaymentResult();
    setTimeout(() => {
      location.href = this.returnUrl;
    }, 7000);
  }



  ErrorStatus() {
    const Lang = this.ss.CurrentLang();

    switch (this.errorCode) {
      case 'refresh':
      case 'operator':
      case 'back':
        this.errorText = 'İşlem sırasında hata oluştu. Lütfen tekrar deneyin. Yönlendiriliyorsunuz...';
        if (
          Lang !== 'tr-TR'
        ) {
          this.errorText = 'Error occured during transaction process. Please try again. Redirecting...';
        }
        this.step = { bar: 50, step1: 'check', step2: 'error', step3: 'error' };
        break;

      case 'maxlimit':
        // tslint:disable-next-line:max-line-length
        this.errorText = 'Ödeme yapmak istediğiniz işyeri için tanımlanan maksimum ödeme tutarını aşan bir sepet oluşturdunuz. Bu tutarda bir ödeme güvenlik sebebiyle yapamazsınız. Yönlendiriliyorsunuz...';
        if (
          Lang !== 'tr-TR'
        ) {
          // tslint:disable-next-line:max-line-length
          this.errorText = 'The amount of your goods to pay exceeds the maximum price defined for this merchant. You cannot make this transaction for security reasons. Redirecting...';
        }
        this.step = { bar: 50, step1: 'check', step2: 'error', step3: 'error' };
        break;

      case '3101':
        this.errorText = Lang !== 'tr-TR' ? 'User daily total amount limit is passed' : 'Günlük toplam işlem tutarı aşıldı.';
        break;
      case '3102':
        this.errorText = Lang !== 'tr-TR' ? 'User weekly total amount limit is passed' : 'Haftalık toplam işlem tutarı aşıldı.';
        break;
      case '3103':
        this.errorText = Lang !== 'tr-TR' ? 'User monthly total amount limit is passed' : 'Aylık toplam işlem tutarı aşıldı.';
        break;
      case '3104':
        this.errorText = Lang !== 'tr-TR' ? 'User daily total count limit is passed' : 'Günlük maksimum işlem sayısı aşıldı.';
        break;
      case '3105':
        this.errorText = Lang !== 'tr-TR' ? 'User weekly total count limit is passed ' : 'Haftalık maksimum işlem sayısı aşıldı.';
        break;
      case '3106':
        this.errorText = Lang !== 'tr-TR' ? 'User monthly total count limit is passed' : 'Aylık maksimum işlem sayısı aşıldı.';
        break;
      case '3201':
        // tslint:disable-next-line:max-line-length
        this.errorText = Lang !== 'tr-TR' ? 'User daily total amount limit is passed for this merchant.' : 'Bu iş yeri için günlük toplam işlem tutarı aşıldı.';
        break;
      case '3202':
        // tslint:disable-next-line:max-line-length
        this.errorText = Lang !== 'tr-TR' ? 'User weekly total amount limit is passed for this merchant.' : 'Bu iş yeri için haftalık toplam işlem tutarı aşıldı.';
        break;
      case '3203':
        // tslint:disable-next-line:max-line-length
        this.errorText = Lang !== 'tr-TR' ? 'User monthly total amount limit is passed for this merchant.' : 'Bu iş yeri için aylık toplam işlem tutarı aşıldı.';
        break;
      case '3204':
        // tslint:disable-next-line:max-line-length
        this.errorText = Lang !== 'tr-TR' ? 'User daily total count limit is passed for this merchant.' : 'Bu iş yeri için günlük maksimum işlem sayısı aşıldı.';
        break;
      case '3205':
        // tslint:disable-next-line:max-line-length
        this.errorText = Lang !== 'tr-TR' ? 'User weekly total count limit is passed for this merchant.' : 'Bu iş yeri için haftalık maksimum işlem sayısı aşıldı.';
        break;
      case '3206':
        // tslint:disable-next-line:max-line-length
        this.errorText = Lang !== 'tr-TR' ? 'User monthly total count limit is passed for this merchant.' : 'Bu iş yeri için aylık maksimum işlem sayısı aşıldı.';
        break;

      default:
        if (this.decodedData.PaymentChannel.Id === PaymentChannel.Mobile_Payment) {
          // tslint:disable-next-line:max-line-length
          this.errorText = 'Belirlenen süre içerisinde telefonunuza gelen mesaja onay vermediğiniz için ' + this.ss.GetPaymentChannelOptions().Name.toLowerCase() + ' işleminiz tamamlanamamıştır. Lütfen tekrar deneyin!';
          if (
            Lang !== 'tr-TR'
          ) {
            // tslint:disable-next-line:max-line-length
            this.errorText = 'Your ' + this.ss.GetPaymentChannelOptions().Name.toLowerCase() + ' transaction ist not completed because you did not reply and confirm the message you received on your phone within the specified time. Please try again!';
          }
          break;
        }
        this.errorText = 'İşlem sırasında hata oluştu. Lütfen tekrar deneyin. Yönlendiriliyorsunuz...';
        if (
          Lang !== 'tr-TR'
        ) {
          this.errorText = 'Error occured during transaction process. Please try again. Redirecting...';
        }
        // this.step = { bar: 50, step1: 'check', step2: 'error', step3: 'error' };
        break;
    }
  }

  PaymentResult() {
    const sResultCheck = this.sResult != null ? this.sResult.Success : null;
    const sResultSuccess = sResultCheck != null ? sResultCheck : null;
    const sResultMessage = this.sResult != null ? this.sResult.Message : null;
    const sResultNotificationId = this.sResult != null ? this.sResult.NotificationId : null;
    const data = {
      UserId: this.globalService.authorizationparams.UserId,
      LogTypeId: 10, // PaymentResultLog
      Message1: localStorage.getItem('sRResult') || null,
      Message2: 'errorCode: ' + this.errorCode,
      Message3: 'userPhoneNumber: ' + this.authService.GetPhoneNumber() + ' operator:' + this.globalService.cellOperator,
      Message4: this.globalService.authorizationparams.access_token,
      Message5: 'ReturnUrl :' + this.returnUrl,
      Message6: 'SignalRConnectionId :' + localStorage.getItem('_SignalRConnection'),
      Message7: 'PaymentResultLogTime :' + new Date(),
      Message10: sResultCheck,
      PaymentMerchantOrderId: this.decodedData.OrderId,
      PaymentRequestId: this.decodedData.Id,
      PaymentResult: 'Status:' + sResultSuccess + 'Message:' + sResultMessage + 'NotificationId:' + sResultNotificationId,
    };
    // console.log(data);
    this.paymentService.PaymentResult(SerializerObj(data)).subscribe((res: any) => { });
  }

}
