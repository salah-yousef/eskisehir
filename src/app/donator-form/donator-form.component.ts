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
  myImage;
  topOffset = 380;
  leftOffset = 1355;
  sources = {
    silver: 'assets/images/layout/badge-silver.jpg',
    bronze: 'assets/images/layout/badge-bronz.jpg',
    gold: 'assets/images/layout/badge-gold.jpg'
  };
  width = 1920;
  height = 1280;
  userName = '';
  public context: CanvasRenderingContext2D;
  @ViewChild('myCanvas') myCanvas;
  link = document.createElement('a');

  constructor(
    public ss: SharedService,
    private formBuilder: FormBuilder
  ) { }

  ngAfterViewInit(): void {
    this.drawCanvas('');
  }

  ngOnInit() {
    this.decodedData = this.ss.decodedData;
    this.donationForm = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(16)
      ])
    });
    document.body.classList.add('pbesk');
  }

  donationSubmit(form) {
    this.userName = form.value.name;
    this.drawCanvas(form.value.name);
    setTimeout(() => {
      this.link.click();
      document.body.removeChild(this.link);
    }, 0);
    
    let decodedData = this.ss.decodedData;
    decodedData.isCanvasUsed = true;
    sessionStorage.setItem('decodedData', JSON.stringify(decodedData));
  }

  drawCanvas(name: string): void {
    const canvasEl: HTMLCanvasElement = this.myCanvas.nativeElement;
    canvasEl.style.letterSpacing = '1px';
    this.context = canvasEl.getContext('2d');
    const image = new Image();
    canvasEl.width = this.width;
    canvasEl.height = this.height;
    image.onload = () => {
      this.context.drawImage(image, 0, 0, canvasEl.width, canvasEl.height);
      this.context.fillStyle = '#fff';
      this.context.font = 'normal normal 900 50px Roboto Mono';
      this.context.textAlign = 'center';

      this.context.fillText(name.toUpperCase(), this.leftOffset, this.topOffset);
      this.myImage = atob(canvasEl.toDataURL('image/jpg').replace('data:image/png;base64,', ''));
      this.createImage();
    };

    const numOfCertificates = this.ss.decodedData.numOfCertificates;
    console.log(numOfCertificates);
    if (numOfCertificates >= 1 && numOfCertificates <= 9) {
      console.log('Bronze');
      image.src = this.sources.bronze;
    } else if (numOfCertificates >= 10 && numOfCertificates <= 49) {
      console.log('Silver');
      image.src = this.sources.silver;
    } else {
      console.log('Gold');
      image.src = this.sources.gold;
    }
    console.log(image.src);
  }

  createImage() {
    const byteNumbers = new Array(this.myImage.length);
    for (let i = 0; i < this.myImage.length; i++) {
      byteNumbers[i] = this.myImage.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { 'type': 'image/jpeg' });

    if (navigator.msSaveBlob) {
      const filename = this.userName;
      navigator.msSaveBlob(blob, filename);
    } else {

      this.link.href = URL.createObjectURL(blob);

      this.link.setAttribute('visibility', 'hidden');
      this.link.download = this.userName;
      document.body.appendChild(this.link);

    }
  }

}
