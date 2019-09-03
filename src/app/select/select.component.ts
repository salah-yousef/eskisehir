import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html'
})
export class SelectComponent implements OnInit {
  amount = 0;
  adet: number;
  prizeSelectForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private ss: SharedService,
    private router: Router
    ) { }
    numOfCertificates = this.ss.decodedData.numOfCertificates;

  public adetMask = {
    mask: [/\d/, /\d/, /\d/],
    guide: false,
    keepCharPositions: false,
    placeholderChar: '_',
    showMask: false,
    modelClean: true
  };

  ngOnInit() {
    this.prizeSelectForm = this.formBuilder.group({
      adet: new FormControl('', [
        Validators.required,
        Validators.maxLength(3)
      ])

    });
    this.prizeSelectForm.valueChanges.subscribe(console.log);
  }

  onKey() {
    console.log(this.prizeSelectForm.value.adet);
    this.amount = this.prizeSelectForm.value.adet * 26;
    this.prizeSelectForm.value.amount = this.amount;
    this.ss.decodedData.numOfCertificates = this.prizeSelectForm.value.adet;
    sessionStorage.setItem('decodedData', JSON.stringify(this.ss.decodedData));
    this.numOfCertificates = this.ss.decodedData.numOfCertificates;
  }

  prizeSubmit(form: any, channel) {
    const decodedData = JSON.parse(sessionStorage.getItem('decodedData'));
    decodedData.BaseAmount = this.amount * 100;
    // tslint:disable-next-line:radix
    decodedData.numOfCertificates = parseInt(this.prizeSelectForm.value.adet);
    switch (channel) {
      case 1:
        decodedData.PaymentChannel.Code = 'MP';
        decodedData.PaymentChannel.Id = 1;
        decodedData.PaymentChannel.Name = 'Mobile Payment';
        break;
      case 2:
        decodedData.PaymentChannel.Code = 'CC';
        decodedData.PaymentChannel.Id = 2;
        decodedData.PaymentChannel.Name = 'Credid Card Payment';
        break;
        case 3:
          decodedData.PaymentChannel.Code = 'TU';
          decodedData.PaymentChannel.Id = 3;
          decodedData.PaymentChannel.Name = 'TopUp Deposit';
          break;
        }

        decodedData.PaymentChannel.Id = channel;
        sessionStorage.setItem('decodedData', JSON.stringify(decodedData));

        switch (channel) {
          case 1:
            this.router.navigate(['mobile/approval']);
            break;
          case 2:
            this.router.navigate(['cc/info']);
            break;
          case 3:
            this.router.navigate(['banktransfer']);
            break;

        }
  }

}
