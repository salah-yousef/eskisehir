import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EskisehirService } from '../services/eskisehir.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-eskisehir',
  templateUrl: './eskisehir.component.html'
})
export class EskisehirComponent implements OnInit {
  paymentType: string;
  data = {
    "CurrencyCode":"949",
    "OrderId":"223345",
    "BaseAmount":"0",
    "SuccessUrl":"http://www.google.com.tr",
    "FailUrl":"https://www.yahoo.com/",
    "PaymentMethodCode": "CC",
    "ProductList": []
  };

  constructor(
    private eskService: EskisehirService,
     private router: Router,
      public ss: SharedService,
      private route: ActivatedRoute) { }

  ngOnInit() {
    document.body.classList.add('pbesk');
    this.paymentType = this.route.snapshot.paramMap.get('paymentType');
    this.eskService.GetEskisehirUrl(this.data, this.paymentType).subscribe((res) => {
      console.log(res.Data);
      if (res.Success) {
        const RedirectUrl = res.Data.RedirectUrl.replace('http://testext.paybrothers.com:3467', 'http://localhost:4200');
       location.href = RedirectUrl;
      }
      console.log(res);
    });
  }

}
