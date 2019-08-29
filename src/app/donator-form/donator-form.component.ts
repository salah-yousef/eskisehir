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
  vertical = 380;
  horizontal = 1110;
  textWidthArea = 826;
  textWidth = 0;
  extraSpace = 0;
  leftOffset = 0;
  sources = {
    silver: 'assets/images/layout/badge-silver.jpg',
    bronze: 'assets/images/layout/badge-bronz.jpg',
    gold: 'assets/images/layout/badge-gold.jpg'
  };
  width = 1920;
  height = 1280;

  public context: CanvasRenderingContext2D;
  @ViewChild('myCanvas') myCanvas;

  constructor(
    public ss: SharedService,
    private formBuilder: FormBuilder
  ) { }

  ngAfterViewInit(): void {
    this.drawCanvas("");
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
  }

  drawCanvas(name: string): void {
    console.log(name.offsetWidth);
    const canvasEl: HTMLCanvasElement = this.myCanvas.nativeElement;
    canvasEl.style.letterSpacing = '2px';
    this.context = canvasEl.getContext("2d");
    let image = new Image();
    canvasEl.width = this.width;
    canvasEl.height = this.height;
    image.onload = () => {
      this.context.drawImage(image, 0, 0, canvasEl.width, canvasEl.height );
      this.context.fillStyle = "#fff";
      this.context.font = "67px Gotham";
      this.textWidth = name.length * 67;
      this.extraSpace = (this.textWidthArea - this.textWidth) / 2;
      console.log(this.extraSpace);
      this.leftOffset = this.extraSpace + this.horizontal;
      console.log(this.leftOffset );
      this.context.fillText(name.toUpperCase(), this.leftOffset, this.vertical);
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
}
