import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html'
})
export class SelectComponent implements OnInit {
  amount: number = 0;
  adet: number;
  prizeSelectForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private ss: SharedService,
    private router: Router
    ) { }

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
    document.body.classList.add('pbesk');
  }

  onKey($event){
    console.log(this.prizeSelectForm.value.adet);
    this.amount = this.prizeSelectForm.value.adet * 26;
    this.prizeSelectForm.value.amount = this.amount;
  }

  prizeSubmit(form: any) {
    let decodedData = this.ss.decodedData;
    decodedData.BaseAmount = this.amount * 100;
    sessionStorage.setItem('decodedData', JSON.stringify(decodedData));
    this.router.navigate(['cc/info']);
  }

}
