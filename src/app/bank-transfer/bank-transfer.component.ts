import { Component, OnInit } from '@angular/core';
import { GlobalService } from './../services/global.service';
import { PaymentService } from './../services/payment.service';
import { SharedService } from './../services/shared.service';



@Component({
  selector: 'app-bank-transfer',
  templateUrl: './bank-transfer.component.html',
  providers: [GlobalService, PaymentService, SharedService]
})
export class BankTransferComponent implements OnInit {
  CurrentBankAccount;
  NetAmount: any;
  public decodedData = this.globalService.decodedData;
  public returnUrl: string;
  constructor(
    private globalService: GlobalService,
    public ss: SharedService
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
      location.href = this.returnUrl;
    }, (error) => {
      this.returnUrl = this.globalService.decodedData.FailUrl;
      location.href = this.returnUrl;
    });

  }

}
