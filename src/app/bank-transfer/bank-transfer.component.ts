import { Component, OnInit } from '@angular/core';
import { GlobalService } from './../services/global.service';
import { PaymentService } from './../services/payment.service';
import { SharedService } from './../services/shared.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-bank-transfer',
  templateUrl: './bank-transfer.component.html',
  providers: [GlobalService, PaymentService, SharedService]
})
export class BankTransferComponent implements OnInit {
  CurrentBankAccount;
  NetAmount: any;
  public decodedData = this.globalService.decodedData;
  public Currency = this.globalService.GetCurrency();
  public returnUrl: string;
  constructor(
    private globalService: GlobalService,
    public ss: SharedService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.NetAmount = (this.globalService.decodedData.BaseAmount) / 100;
    if (this.globalService.decodedData.CommissionAmount != null) {
      this.NetAmount = (this.globalService.decodedData.BaseAmount + this.globalService.decodedData.CommissionAmount) / 100;
    }
  }

  SelectedBankAccount(e) {
    this.CurrentBankAccount = e;
  }

  BankTransferComplate() {
    const params = {
      TransactionId: this.globalService.decodedData.Id
    };
    this.globalService.CreateBankTransferRequest(params).subscribe((res: any) => {
      if (res.Success) {
        if (this.CurrentBankAccount.HGNStatus) {
          this.returnUrl = this.globalService.decodedData.SuccessUrl;
        } else {
          this.returnUrl = this.globalService.decodedData.FailUrl;
        }
      } else {
        this.returnUrl = this.globalService.decodedData.FailUrl;
      }
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
          location.href = this.returnUrl;
          break;
      }
    }, (error) => {
      this.returnUrl = this.globalService.decodedData.FailUrl;
      location.href = this.returnUrl;
    });

  }

}
