import { Component, OnInit, Pipe } from '@angular/core';
import { GlobalService } from './../services/global.service';
import { AuthService } from './../services/auth.service';
import { PaymentService } from './../services/payment.service';
import { CredidCart } from './../models/CredidCart';
import { ActivatedRoute, Router } from '@angular/router';
// import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
// import { TruncatePipe } from '../pipe/truncate.pipe';
import { SerializerObj } from './../helpers/serilalizer.function';
import { SessionControlService } from './../services/session-control.service';
import { SharedService } from './../services/shared.service';



@Component({
  selector: 'app-cc-info',
  templateUrl: './cc-info.component.html',
  providers: [PaymentService, SessionControlService, AuthService, GlobalService, SharedService]
  // styleUrls: ['./cc-info.component.scss']
})
export class CcInfoComponent implements OnInit {
  cardInfo: CredidCart;
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();
  years = [];
  count: number;
  delIndex: number;
  step = { bar: 50, step1: 'check', step2: 'active', step3: 'error' };
  ccForm: FormGroup;
  formSubmit = false;
  loading: boolean;

  // decodedData = JSON.parse(localStorage.getItem('decodedData'));
  decodedData = this.globalService.decodedData;
  private authorizationparams = JSON.parse(localStorage.getItem('__authorizationparams'));
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private paymentService: PaymentService,
    private authService: AuthService,
    private globalService: GlobalService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private sessionControlService: SessionControlService,
    public ss: SharedService

  ) {

    this.cardInfo = {
      CreditCardHolderFirstName: '',
      CreditCardNumber: '',
      CreditCardExpireDateMonth: null,
      CreditCardExpireDateYear: null,
      CreditCardCVV: null,
      PaymentRequestId: this.decodedData.Id,
      Description: ''
    };
  }

  month = [
    { Id: 1, name: '01' },
    { Id: 2, name: '02' },
    { Id: 3, name: '03' },
    { Id: 4, name: '04' },
    { Id: 5, name: '05' },
    { Id: 6, name: '06' },
    { Id: 7, name: '07' },
    { Id: 8, name: '08' },
    { Id: 9, name: '09' },
    { Id: 10, name: '10' },
    { Id: 11, name: '11' },
    { Id: 12, name: '12' }
  ];

  public ccMask = {
    mask: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/],
    guide: false,
    keepCharPositions: false,
    placeholderChar: '_',
    showMask: false,
    modelClean: true
  };

  public ccvMask = {
    mask: [/\d/, /\d/, /\d/],
    guide: false,
    keepCharPositions: false,
    placeholderChar: '_',
    showMask: false,
    modelClean: true
  };



  ngOnInit() {
    // this.sessionControlService.GetSessionControl('cc-info');
    this.loading = false;
    this.ccForm = this.fb.group({
      CreditCardHolderFirstName: new FormControl('', [
        Validators.required, Validators.pattern(/^[a-zA-ZğüşöçıİĞÜŞÖÇ\s]*$/)
      ]),
      CreditCardNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(19)
      ]),
      CreditCardExpireDateMonth: new FormControl('', [
        Validators.required
      ]),
      CreditCardExpireDateYear: new FormControl('', [
        Validators.required
      ]),
      CreditCardCVV: new FormControl('', [
        Validators.required,
        Validators.minLength(3)
      ])
    });
    // this.ccForm.valueChanges.subscribe(console.log);


    this.getYearList();
    // setTimeout(() => this.toastr.warning('sup','Dikkat'));
    this.AuthLog();
  }

  getYearList() {
    for (this.count = 0; this.count < 15; this.count++) {
      this.years.push(this.currentYear + this.count);
    }
  }

  addKey(key) {
    // key = key.toString();
    // console.log(this.ccForm);
    if (this.cardInfo.CreditCardNumber.replace(/\D/g, '').length === 16) {
      return false;
    }
    this.cardInfo.CreditCardNumber += key;
  }
  delKey() {
    this.delIndex = this.cardInfo.CreditCardNumber.length - 1;
    this.cardInfo.CreditCardNumber = this.cardInfo.CreditCardNumber.substring(0, this.delIndex);
  }
  clearVal() {
    this.cardInfo.CreditCardNumber = '';
  }

  AuthLog() {
    const data = {
      LogTypeId: 18, // AuthLog
      UserId: this.authorizationparams.UserId,
      Message1: 'LogTime :' + new Date(),
      Message2: 'userPhoneNumber: ' + this.authService.GetPhoneNumber(),
      Message4: this.authorizationparams.access_token,
      PaymentMerchantOrderId: this.globalService.decodedData.OrderId,
      PaymentRequestId: this.globalService.decodedData.Id,
      PaymentResult: 'AuthLog CC',
    };
    this.paymentService.PaymentResult(SerializerObj(data)).subscribe((res: any) => { });
  }


  ccSubmit(form: any) {
    if (form.valid) {
      form.value.CreditCardNumber = form.value.CreditCardNumber.replace(/\D/g, '');
      form.value.PaymentRequestId = this.decodedData.Id;
      form.value.Description = '';
      this.loading = true;
      this.paymentService.ccPAyment(SerializerObj(form.value), this.authorizationparams.access_token).subscribe((res: any) => {
        if (res.Success) {
          localStorage.setItem('secureUrl', res.Data);
          this.router.navigateByUrl('cc/secure');
          // location.href = res.Data; // ayrı sayfada aç;
        } else {
          this.toastr.warning(res.ErrorMessages[0], 'Dikkat');
          this.loading = false;
        }
        // console.log(res);
      });
    }
  }

}