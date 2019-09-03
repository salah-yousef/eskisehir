import { PaymentService } from './../services/payment.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SignalR } from 'ng2-signalr';
import { SignalRService } from './../services/signalr.service';
import { SessionControlService } from './../services/session-control.service';
import { GlobalService } from './../services/global.service';
import { SharedService } from './../services/shared.service';

@Component({
  selector: 'app-cc-confirm',
  templateUrl: './cc-confirm.component.html',
  providers: [SignalRService, SessionControlService, GlobalService, PaymentService, SharedService]
})
export class CcConfirmComponent implements OnInit, OnDestroy {
  ispbesk: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private signalR: SignalR,
    private signalRService: SignalRService,
    private globalService: GlobalService,
    private paymentService: PaymentService,
    private sessionControlService: SessionControlService,
    public ss: SharedService

  ) { }

  step = { bar: 50, step1: 'check', step2: 'active', step3: '' };

  decodedData = this.globalService.decodedData;
  result;
  operatorConfirm = false;
  queryParams;


  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.operator != null) {
        this.operatorConfirm = true;
      }
    });

    let i = 0;
    this.sessionControlService.GetSessionControl('cc-confirm');
    this.signalRService.startConnection(this.globalService.authorizationparams.access_token);

    this.signalRService.ccPaymentStatus.subscribe((res: any) => {
      this.result = JSON.parse(res);
      if (this.result.Success == null) {
        this.operatorConfirm = true;
      } else {
        localStorage.setItem('sResult', res);
        this.router.navigateByUrl('result');
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
    this.ispbesk = this.ss.currentTheme === 'pbesk' ? true : false;
  }

  ngOnDestroy() {
    this.signalRService.stopConnection();
  }

}
