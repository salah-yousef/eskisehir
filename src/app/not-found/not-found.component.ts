import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SharedService } from './../services/shared.service';


@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  providers: [SharedService]
})
export class NotFoundComponent implements OnInit {
  isLogo: boolean;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public ss: SharedService
  ) { }

  ngOnInit() {
    this.isLogo = this.ss.CurrentTheme() === 'pbesk'? false: true;
    this.activatedRoute.params.forEach((params) => {
      // console.log(params.errorCode);
    });
  }

}
