import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SharedService } from './../services/shared.service';


@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  providers: [SharedService]
})
export class NotFoundComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public ss: SharedService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.forEach((params) => {
      // console.log(params.errorCode);
    });
  }

}
