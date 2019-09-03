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
  adet = 0;
  prizeSelectForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private ss: SharedService,
    private router: Router
  ) { }
  public numOfCertificates = 0;
  public decodedData = JSON.parse(sessionStorage.getItem('decodedData'));

  public adetMask = {
    mask: [/\d/, /\d/, /\d/],
    guide: false,
    keepCharPositions: false,
    placeholderChar: '_',
    showMask: false,
    modelClean: true
  };

  ngOnInit() {
    console.log('ng on init');
    this.prizeSelectForm = this.formBuilder.group({
      adet: new FormControl('', [
        Validators.required,
        Validators.maxLength(3)
      ])
    });
    console.log(JSON.parse(sessionStorage.getItem('decodedData')));
    // this.prizeSelectForm.valueChanges.subscribe(console.log);
    const decodedData = JSON.parse(sessionStorage.getItem('decodedData'));
    decodedData.numOfCertificates = 0;
    sessionStorage.setItem('decodedData', JSON.stringify(decodedData));
  }

  onKey() {
    console.log(this.prizeSelectForm.value.adet);
    this.amount = this.prizeSelectForm.value.adet * 26;
    this.prizeSelectForm.value.amount = this.amount;
    const decodedData = JSON.parse(sessionStorage.getItem('decodedData'));
    decodedData.numOfCertificates = this.prizeSelectForm.value.adet;
    sessionStorage.setItem('decodedData', JSON.stringify(decodedData));
    this.numOfCertificates = decodedData.numOfCertificates;
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
