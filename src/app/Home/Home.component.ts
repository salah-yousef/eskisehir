import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { DOCUMENT } from '@angular/platform-browser';
import { SharedService } from './../services/shared.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [AuthService, SharedService]
})
export class HomeComponent implements OnInit {

  queryParams;
  redirectToken: {};
  nullData = false;
  homeText = '...';

  constructor(
    // tslint:disable-next-line: deprecation
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    public translate: TranslateService,
    public ss: SharedService
  ) {
    // document.body.classList.add('pbwl');
    // translate.use(ss.CurrentLang());
    // console.log(ss.CurrentLang(), 'HomeComp');
  }

  ngOnInit() {
    localStorage.clear();
    sessionStorage.clear();
    this.activatedRoute.params.forEach((params) => {
      this.queryParams = this.activatedRoute.snapshot.queryParams;
    });
    let Set = JSON.parse(sessionStorage.getItem('Set'));
    if (Set === null) {
      Set = {};
      Set.Lang = 'tr-TR';
    }

    if (this.queryParams != null && this.queryParams.token != null) {
      this.homeText = 'İşleminiz tamamlanıyor. Lütfen bekleyiniz.';
      this.redirectToken = { RedirectUrl: this.queryParams.token };
      this.authService.DecodePayment(this.redirectToken).subscribe((res: any) => {

        if (res && res.Data != null && res.Success) {
          sessionStorage.setItem('decodedData', JSON.stringify(res.Data));
          if (res.Data.LanguageCode == null) {
            Set.Lang = 'tr-TR';
          } else {
            Set.Lang = res.Data.LanguageCode;
          }
          this.translate.use(Set.Lang);
          sessionStorage.setItem('Set', JSON.stringify(Set));
          document.body.classList.add(this.ss.CurrentTheme());
          this.router.navigateByUrl('login');
        } else {
          this.nullData = true;
          document.body.classList.add(this.ss.CurrentTheme());
          Set.Lang = 'tr-TR';
        }
      });
    }

  }
}
