import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

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
  loading = false;
  numOfCertificates = this.ss.decodedData.numOfCertificates;
  OrderId = this.ss.decodedData.OrderId;
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
  ispbesk: boolean;

  constructor(
    public ss: SharedService,
    private formBuilder: FormBuilder,
    private router: Router
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
    this.ispbesk = this.ss.CurrentTheme() === 'pbesk' ? true : false;
  }

  donationSubmit(form, val) {
    this.userName = form.value.name;
    this.drawCanvas(form.value.name);
    this.ss.AddDonatorName({
      UserId: this.ss.decodedData.Id,
      FirstName: this.ss.decodedData.firstName,
      LastName: this.ss.decodedData.lastName,
      FundingCertificateId: this.ss.decodedData.PaymentChannel.Id,
      TotalAmount: this.ss.decodedData.BaseAmount,
      Quantity: this.ss.decodedData.numOfCertificates
    }).subscribe((res) => {
      console.log(JSON.stringify(res));
    });
    setTimeout(() => {
      this.link.click();
      document.body.removeChild(this.link);
      this.router.navigate(['result']);
    }, 5000);

    const decodedData = this.ss.decodedData;
    decodedData.isCanvasUsed = true;
    decodedData.userName = this.userName;
    sessionStorage.setItem('decodedData', JSON.stringify(decodedData));
    val.setAttribute('style', 'display:none');
    this.loading = true;
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
    if (numOfCertificates >= 1 && numOfCertificates <= 9) {
      image.src = this.sources.bronze;
    } else if (numOfCertificates >= 10 && numOfCertificates <= 49) {
      image.src = this.sources.silver;
    } else {
      image.src = this.sources.gold;
    }
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

  onEnterName(event) {
    const fullName = event.target.value;
    const words = fullName.split(' ');

    this.ss.decodedData.firstName = words[0];
    this.ss.decodedData.lastName = words[1];
    sessionStorage.setItem('decodedData', JSON.stringify(this.ss.decodedData));
  }


}
