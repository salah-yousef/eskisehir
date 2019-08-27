import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html'
})
export class SelectComponent implements OnInit {
  amount: number;
  adet: number;
  CCSelectForm: FormGroup;
  constructor(private fb: FormBuilder) { }
  
  public ccvMask = {
    mask: [/\d/, /\d/, /\d/],
    guide: false,
    keepCharPositions: false,
    placeholderChar: '_',
    showMask: false,
    modelClean: true
  };

  ngOnInit() {
    this.CCSelectForm = this.fb.group({     
      adet: new FormControl('', [
        Validators.required,
        Validators.maxLength(3)
      ]),
      
    });
     //this.CCSelectForm.valueChanges.subscribe(console.log);
    document.body.classList.add('pbesk');
  }
  
  onKey($event){
    //console.log(this.adet);   
    console.log(this.CCSelectForm.value.adet);
    this.amount = this.CCSelectForm.value.adet * 26;
     
  }

}
