import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-donator-form',
  templateUrl: './donator-form.component.html'
})
export class DonatorFormComponent implements OnInit {
  step = { bar: 50, step1: 'check', step2: 'active', step3: 'error' };
  donationForm: FormGroup;
  constructor(
    public ss: SharedService,
    private formBuilder: FormBuilder
    ) { }
    decodedData = this.ss.decodedData;

  ngOnInit() {
    this.donationForm = this.formBuilder.group({     
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ])
      
    });
    document.body.classList.add('pbesk');

  }
  
  
  donationSubmit(donationForm){

  }

}
