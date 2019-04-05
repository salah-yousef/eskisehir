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
    }, 6500);
  }



  ErrorStatus() {
    switch (this.errorCode) {
      case 'refresh':
      case 'operator':
      case 'back':
        this.errorText = 'İşlem sırasında hata oluştu. Lütfen tekrar deneyin. Yönlendiriliyorsunuz...';
        this.step = { bar: 50, step1: 'check', step2: 'error', step3: 'error' };
        break;

      default:
        if (this.decodedData.PaymentChannel.Id === PaymentChannel.Mobile_Payment) {
          // tslint:disable-next-line:max-line-length
          this.errorText = 'Belirlenen süre içerisinde telefonunuza gelen mesaja onay vermediğiniz için ' + this.ss.GetPaymentChannelOptions().Name.toLowerCase() + ' işleminiz tamamlanamamıştır. Lütfen tekrar deneyin!';
          break;
        }
        this.errorText = 'İşlem sırasında hata oluştu. Lütfen tekrar deneyin. Yönlendiriliyorsunuz...';
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
