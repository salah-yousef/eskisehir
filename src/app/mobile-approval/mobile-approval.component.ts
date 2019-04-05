import { AuthService } from './../services/auth.service';
import { SignalRService } from './../services/signalr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
// import { HttpClientModule } from '@angular/common/http';
// import { HttpModule } from '@angular/http';
import { SignalR, BroadcastEventListener, ConnectionStatus, ISignalRConnection, IConnectionOptions, SignalRConnection } from 'ng2-signalr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import { SessionControlService } from './../services/session-control.service';
import { GlobalService } from '../services/global.service';
import { PaymentService } from '../services/payment.service';
import { SerializerObj } from '../helpers/serilalizer.function';
import { SharedService } from './../services/shared.service';

// import * as $ from 'jquery';

@Component({
  selector: 'app-mobile-approval',
  templateUrl: './mobile-approval.component.html',
  // styleUrls: ['./mobile-approval.component.scss'],
  providers: [SignalRService, SessionControlService, GlobalService, PaymentService, AuthService, SharedService]
})

export class MobileApprovalComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private signalR: SignalR,
    private modalService: BsModalService,
    private signalRService: SignalRService,
    private globalService: GlobalService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private toastr: ToastrService,
    private sessionControlService: SessionControlService,
    public ss: SharedService
  ) {


  }
  decodedData = this.globalService.decodedData;
  phoneNumber =  this.authService.GetPhoneNumber();
  private authorizationparams = this.globalService.authorizationparams;
  step = { bar: 50, step1: 'check', step2: 'active', step3: '' };

  modalRef: BsModalRef;
  modalConfig = {
    animated: true,
    class: 'modal-lg'
  };
  countdown;
  currentValue;
  result;
  contractUrl: string;
  signalRResponseStatus = false;


  sectors = [
    {
      color: '#ff6600',
      lo: 0,
      hi: 59
    }, {
      color: '#ffD700',
      lo: 60,
      hi: 149
    }, {
      color: '#01bf7f',
      lo: 150,
      hi: 300
    }];

  options = {
    min: 0,
    title: '',
    height: 84,
    customSectors: this.sectors,
    valueFontColor: '#FFF',
    labelFontColor: '#FFF',
    valueFontFamily: 'Lato',
    label: 'saniye',
    relativeGaugeSize: false,
    onAnimationEnd: function () {
      // console.log('animation End');
    }
  };
  max = 300;
  value = 300;
  SignalRResult = [];

  ngOnInit() {
    this.CurrentOperator();
    this.sessionControlService.GetSessionControl('mobile-approval');

    this.signalRService.startConnection(this.authorizationparams.access_token);
    this.signalRService.smsReceived.subscribe((res: any) => {
      this.result = JSON.parse(res);
      this.SignalRResult.push(res);
      localStorage.setItem('sRResult', this.SignalRResult.toString());
      localStorage.setItem('sResult', res);
      this.signalRResponseStatus = true;
      if (this.globalService.decodedData.Id === this.result.PaymentId) {
        this.router.navigateByUrl('result');
      }
    });

    this.countdown = setInterval(() => {
      this.value = this.value - 1;
      localStorage.setItem('countdown', this.value.toString());
      if (this.value === 0) {
        this.router.navigateByUrl('result');
        clearInterval(this.countdown);
      }
    }, 1000);

    this.AuthLog();

  }

  AuthLog() {
    const data = {
      LogTypeId: 18, // CCSEcureLog
      UserId: this.globalService.authorizationparams.UserId,
      Message1: 'LogTime :' + new Date(),
      Message2: 'userPhoneNumber: ' + this.authService.GetPhoneNumber() + ' operator:' + this.globalService.cellOperator,
      Message3: 'SignalRConnectionId :' + localStorage.getItem('_SignalRConnection'),
      Message4: this.globalService.authorizationparams.access_token,
      PaymentMerchantOrderId: this.globalService.decodedData.OrderId,
      PaymentRequestId: this.globalService.decodedData.Id,
      PaymentResult: 'AuthLog Mobile',
    };
    this.paymentService.PaymentResult(SerializerObj(data)).subscribe((res: any) => { });
  }


  ngOnDestroy() {
    this.signalRService.stopConnection();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

  CurrentOperator() {
    switch (this.decodedData.cellOperator) {
      case 'Turkcell':
        this.contractUrl = 'https://turkcellodemehizmetleri.com.tr/kullanim-sartlari-ve-sozlesmesi';
        break;
      case 'Vodafone':
        this.contractUrl = 'http://www.vodafone.com.tr/Servisler/pdf/mobil-odeme-hizmeti-kullanici-sozlesmesi-icin.pdf';
        break;
      case 'TurkTelekom':
        // tslint:disable-next-line:max-line-length
        this.contractUrl = 'https://bireysel.turktelekom.com.tr/mobil/web/servisler/Documents/turk_telekom-odeme-hizmetleri-kullanici-sozlesmesi.pdf';
        break;
    }
  }

}


