import { OnInit } from '@angular/core';
// import { Router } from '@angular/router';
import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { SharedService } from './services/shared.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [SharedService, TranslateService]
})

export class AppComponent implements OnInit {
  constructor(
    private ss: SharedService,
    public translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    translate.addLangs(['tr', 'en']);
    // translate.setDefaultLang('tr');
    // const browserLang = 'tr'; // translate.getBrowserLang();
    // translate.use(browserLang.match(/tr|en/) ? browserLang : 'en');
    if (ss.decodedData != null) {
      
      translate.use(ss.CurrentLang());
    } else {
      // if (!document.body.classList.contains('pbwl')) {
      //   document.body.classList.add('pbdf');
      // }
    }
  }

  ngOnInit(): void {
    // this.ss.themeChange.subscribe((res) => {
    //   console.log(this.ss.decodedData);
    //   document.body.classList.add(this.ss.CurrentTheme());
    // });
   document.body.classList.add(this.ss.CurrentTheme());
    this.translate.use(this.ss.CurrentLang());
  }
  // changeLang(data) {
  //   this.translate.use(data);
  // }
}
