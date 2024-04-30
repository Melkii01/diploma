import {Component} from '@angular/core';
import {ModalService} from "../../../shared/services/modal.service";

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {

  constructor(private modalService: ModalService) {
  }

  /**
   * Открыть модальное окно с параметром
   * @param value тип услуг
   */
  openModal(value: string) {
    this.modalService.show('Заявка на услугу', value);
  }
}
