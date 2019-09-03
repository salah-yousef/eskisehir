import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '../services/shared.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {

  constructor(
    private router: Router,
    private ss: SharedService
  ) { }

  @Input() step;

  PictureUrl = true;
  MerchantLogoUrl : string = 'assets/images/svg/logo_esk.svg';
  NetAmount: any;

  public decodedData = JSON.parse(sessionStorage.getItem('decodedData'));

  ngOnInit() {

    if (this.ss.CurrentTheme() === 'pbesk') {
      this.MerchantLogoUrl = 'assets/images/svg/logo_esk.svg';
    } else {
      this.MerchantLogoUrl = this.ss.decodedData.MerchantLogoUrl;
    }
console.log(this.MerchantLogoUrl);
    this.NetAmount = (this.decodedData.BaseAmount) / 100;

    if (this.decodedData.CommissionAmount != null) {
      this.NetAmount = (this.decodedData.BaseAmount + this.decodedData.CommissionAmount) / 100;
    }

    if (this.decodedData === null || this.decodedData.BaseAmount === null || this.decodedData.BaseAmount === undefined) {
      this.router.navigate(['404'], { queryParams: { error: 'baseamount' } });
      return false;
    }

  }
}
