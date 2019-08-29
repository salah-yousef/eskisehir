import { Component, OnInit, Renderer2 } from '@angular/core';
import { SharedService } from './../services/shared.service';



@Component({
  selector: 'app-fullpage',
  templateUrl: './fullpage.component.html',
  providers: [SharedService]
})
export class FullpageComponent implements OnInit {
  previousUrl: string;
  ispbesk: boolean;
  constructor(
    private renderer: Renderer2,
    public ss: SharedService
  ) {

  }

  // public decodedData = JSON.parse(localStorage.getItem('decodedData'));
  public decodedData = JSON.parse(sessionStorage.getItem('decodedData'));


  ngOnInit() {
    this.renderer.addClass(document.body, 'fullpage');
    this.ispbesk = this.ss.currentTheme === 'pbesk' ? true : false;    
  }

}
