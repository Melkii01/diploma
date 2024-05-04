import {Component, Input} from '@angular/core';
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
   * Открыть модальное окно с параметрами
   * @param value тип услуг
   */
  openModal(value: string) {
    this.modalService.show('order', value, 'Заявка на услугу', 'Оставить заявку');
  }
}
