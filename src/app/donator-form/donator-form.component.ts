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
    silver: 'assets/images/layout/Beratlar.png',
    bronze: 'assets/images/layout/Beratlar.png',
    gold: 'assets/images/layout/Beratlar.png'
  };

  public context: CanvasRenderingContext2D;
  @ViewChild('myCanvas') myCanvas;

  constructor(
    public ss: SharedService,
    private formBuilder: FormBuilder
  ) { }

  ngAfterViewInit(): void {
    //this.drawCanvas("Salah");
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
    this.drawCanvas(form.value.name);
    //this.myCanvas.nativeElement.setAttribute('hidden', true);
  }

  drawCanvas(name): void {
    console.log("inside");
    const canvasEl: HTMLCanvasElement = this.myCanvas.nativeElement;
    this.context = canvasEl.getContext("2d");
    let image = new Image();
    canvasEl.width = 900;
    canvasEl.height = 530;
    image.onload = () => {
      this.context.drawImage(image, 0, 0, 900, 530);
      this.context.fillStyle = "#fff";
      this.context.font = "28px Verdana";
      this.context.fillText(name, 520, 150);
    }

    let numOfCertificates = this.ss.decodedData.BaseAmount / 26;
    if (numOfCertificates >= 1 && numOfCertificates <= 9) {
      console.log("Silver");
      image.src = this.sources.silver;
    }
    else if (numOfCertificates >= 10 && numOfCertificates <= 49) {
      console.log("Bronze");
      image.src = this.sources.bronze;
    } else {
      console.log("Gold");
      image.src = this.sources.gold;
    }
  }

  // loadImages(sources, callback) {
  //   var images = {};
  //   var loadedImages = 0;
  //   var numImages = 0;
  //   // get num of sources
  //   for (var src in sources) {
  //     numImages++;
  //   }
  //   for (var src in sources) {
  //     images[src] = new Image();
  //     images[src].onload = function () {
  //       if (++loadedImages >= numImages) {
  //         callback(images);
  //       }
  //     };
  //     images[src].src = sources[src];
  //   }
  // } 
}
