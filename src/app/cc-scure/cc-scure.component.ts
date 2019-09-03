import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SignalR, BroadcastEventListener, ConnectionStatus, ISignalRConnection, IConnectionOptions, SignalRConnection } from 'ng2-signalr';
import { SignalRService } from './../services/signalr.service';
import { SessionControlService } from './../services/session-control.service';
import { AuthService } from './../services/auth.service';
import { SerializerObj } from '../helpers/serilalizer.function';
import { PaymentService } from './../services/payment.service';
import { GlobalService } from './../services/global.service';
import { SharedService } from '../services/shared.service';


@Component({
  selector: 'app-cc-scure',
  templateUrl: './cc-scure.component.html',
  styleUrls: ['./cc-scure.component.scss'],
  providers: [SignalRService, SessionControlService, AuthService, PaymentService, GlobalService]
})
export class CcScureComponent implements OnInit, OnDestroy {

  frameUrl = localStorage.getItem('secureUrl');
  frameHeight;
  constructor(
    private router: Router,
    private signalR: SignalR,
    private signalRService: SignalRService,
    private authService: AuthService,
    private paymentService: PaymentService,
    private globalService: GlobalService,
    private sessionControlService: SessionControlService,
    private ss: SharedService
  ) { }

  SignalRResult = [];
  result;

  ngOnInit() {
    let nullCount = 0;
    let i = 0;
    this.onResize();
    this.sessionControlService.GetSessionControl('cc-secure');
    this.signalRService.startConnection(this.globalService.authorizationparams.access_token);
    this.signalRService.ccPaymentStatus.subscribe((res: any) => {
      this.result = JSON.parse(res);
      this.SignalRResult.push(res);
      this.ccSecureLog(res);
      localStorage.setItem('sRResult', this.SignalRResult.toString());
      localStorage.setItem('sResult', res);
      console.log(res);
      console.log('0');
      if (this.result.Success == null && this.globalService.decodedData.Id === this.result.PaymentId) {
        console.log('1');
        if (nullCount > 0) {
          console.log('2');
          this.router.navigate(['cc/confirm'], { queryParams: { operator: 'confirm' } });
          localStorage.setItem('operatorConfirm', 'true');
        } else {
          console.log('3');
          this.router.navigateByUrl('cc/confirm');
        }
        console.log('4');
        nullCount++;
        return false;
      }
      console.log('5');
      if (this.globalService.decodedData.Id === this.result.PaymentId) {
        if (this.ss.decodedData.PaymentPageType === 2) {
          this.router.navigateByUrl('donator');
        } else {
          this.router.navigateByUrl('result');
        }
      }
    });


    this.signalRService.signalRConnectionStatus.subscribe((data) => {
      // console.log(data);
      const $globalService = this.globalService;
      i++;
      if (i === 1) {
        controlPaymentStatus($globalService.decodedData);
      }
      function controlPaymentStatus(params) {
        setInterval(function () {
          const param = {
            PaymentChannelId: params.PaymentChannel.Id,
            OrderId: params.OrderId,
            Id: params.Id
          };

          $globalService.PaymentStatus(param).subscribe((res) => {
            $globalService.PaymentStatusRouter(res);
          });
        }, 30000);

      }
    });

  }

  ccSecureLog(result) {
    const data = {
      LogTypeId: 11, // CCSEcureLog
      UserId: this.globalService.authorizationparams.UserId,
      Message1: 'LogTime :' + new Date(),
      Message2: 'userPhoneNumber: ' + this.authService.GetPhoneNumber() + ' operator:' + this.globalService.cellOperator,
      Message3: 'SignalRConnectionId :' + localStorage.getItem('_SignalRConnection'),
      Message4: this.globalService.authorizationparams.access_token,
      Message5: result,
      PaymentMerchantOrderId: this.globalService.decodedData.OrderId,
      PaymentRequestId: this.globalService.decodedData.Id,
      PaymentResult: '',
    };
    this.paymentService.PaymentResult(SerializerObj(data)).subscribe((res: any) => {
      console.log('log 11 gönderildi');
    });
  }

  ngOnDestroy() {
    // this.signalRService.stopConnection();
  }

  onResize(e?) {
    this.frameHeight = window.innerHeight - 50;
    document.body.style.height = this.frameHeight + 'px';
  }

}
