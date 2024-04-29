import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ModalService} from "../../../shared/services/modal.service";

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  constructor(private modalService: ModalService) {
  }

  ngOnInit(): void {
  }

  openModal(value: string) {
    this.modalService.show('Заявка на услугу', value);
  }
}
