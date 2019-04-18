import { Component, OnInit, Output, EventEmitter, DoCheck } from '@angular/core';
import { GlobalService } from './../services/global.service';
import { PaymentService } from './../services/payment.service';
declare var $: any;

@Component({
  selector: 'app-banks',
  templateUrl: './banks.component.html',
  providers: [GlobalService, PaymentService]
})

export class BanksComponent implements OnInit, DoCheck {

  BankAccounts;
  CurrentBankAccount;
  @Output() SelectedBankAccount: EventEmitter<string> = new EventEmitter<string>();

  step = { bar: 50, step1: 'check', step2: 'active', step3: 'error' };

  constructor(
    private globalService: GlobalService
  ) { }


  ngOnInit() {
    this.GetBankAccounts();
  }

  ngDoCheck() {
    if (this.CurrentBankAccount != null) {
      this.SelectedBankAccount.emit(this.CurrentBankAccount);
    }
  }

  jump(jumpId: string) {
    const top = document.getElementById(jumpId).offsetTop;
    $('html, body').animate({ scrollTop: top }, 800);
  }

  SetupBankTransferTequest() {
    if (this.CurrentBankAccount == null) {
      this.CurrentBankAccount = null;
      this.step = { bar: 50, step1: 'check', step2: 'active', step3: 'error' };
      this.SelectedBankAccount.emit(this.CurrentBankAccount);
    } else {
      const params = {
        TransactionId: this.globalService.decodedData.Id,
        BankAccountId: this.CurrentBankAccount.Id
      };
      this.CurrentBankAccount.HGNStatus = true;

      this.CurrentBankAccount.BankBranchCode = null;
      this.CurrentBankAccount.BankAccountNumber = null;

      if (this.CurrentBankAccount.AccountNumber != null || this.CurrentBankAccount.AccountNumber !== '') {
        this.CurrentBankAccount.BankBranchCode = this.CurrentBankAccount.AccountNumber.split('-')[0];
        this.CurrentBankAccount.BankAccountNumber = this.CurrentBankAccount.AccountNumber.split('-')[1];
      }
      this.CurrentBankAccount.HGNMessages = null;
      this.globalService.SetupBankTransferTequest(params).subscribe((res: any) => {
        if (res.Success) {
          this.CurrentBankAccount.HGN = res.Data;
          this.step = { bar: 100, step1: 'check', step2: 'check', step3: 'check' };
        } else {
          this.CurrentBankAccount.HGNStatus = false;
          this.CurrentBankAccount.HGNMessages = res.ErrorMessages[0];
        }
      }, (error) => {
        this.CurrentBankAccount.HGNStatus = false;
      });

      this.jump('bankTransfer');

    }

  }

  GetBankAccounts() {
    this.globalService.GetBankaccounts().subscribe((res: any) => {
      this.BankAccounts = res.Data;
    });
  }
}
