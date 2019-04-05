import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  @Input() step;

  PictureUrl = true;
  MerchantLogoUrl = true;
  NetAmount: any;


  public decodedData = JSON.parse(sessionStorage.getItem('decodedData'));

  ngOnInit() {

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
