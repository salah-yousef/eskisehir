import { Component, OnInit, TemplateRef } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { SharedService } from './../services/shared.service';

@Component({
  selector: 'app-footer-left',
  templateUrl: './footer-left.component.html',
  // styleUrls: ['./footer-left.component.scss'],
  providers: [SharedService]
})
export class FooterLeftComponent implements OnInit {

  constructor(
    private modalService: BsModalService,
    public ss: SharedService
  ) { }

  modalRef: BsModalRef;
  modalConfig = {
    animated: true,
    class: 'modal-lg'
  };

  ngOnInit() {
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

}
