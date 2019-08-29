import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-donator-form',
  templateUrl: './donator-form.component.html'
})
export class DonatorFormComponent implements OnInit, AfterViewInit {
  donationForm: FormGroup;
  step = { bar: 50, step1: 'check', step2: 'active', step3: 'error' };
  decodedData: {};
  sources = {
      darthVader: '../assets/images/layout/Beratlar.png',
      yoda: '../assets/images/layout/Beratlar.png'
  }; 
  @ViewChild('myCanvas') myCanvas: ElementRef;
  public context: CanvasRenderingContext2D;
  
  constructor(
    public ss: SharedService,
    private formBuilder: FormBuilder
    ) { }
    
    ngAfterViewInit(): void {
      this.loadImages(this.sources, (images) => {
        console.log(images);
        this.context.drawImage(images.darthVader.src, 100, 30);
        this.context.drawImage(images.yoda.src, 69, 50);
      });
      this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');
    }
    
    ngOnInit() {
      this.decodedData = this.ss.decodedData;
      this.donationForm = this.formBuilder.group({
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20)
        ])
        
      });

    document.body.classList.add('pbesk');



    
  }

  donationSubmit(form) {
    console.log(form.value.name);
  }
  loadImages(sources, callback) {
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    // get num of sources
    for (var src in sources) {
      numImages++;
    }
    for (var src in sources) {
      images[src] = new Image();
      images[src].onload = function () {
        if (++loadedImages >= numImages) {
          callback(images);
        }
      };
      images[src].src = sources[src];
    }
  } 
}
