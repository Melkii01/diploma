import {Component} from '@angular/core';
import {ModalService} from "../../services/modal.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  constructor(private modalService: ModalService) {
  }

  /**
   * Открыть модальное окно с параметрами
   */
  openModal() {
    this.modalService.show('consultation', 'Перезвоните мне', 'Закажите бесплатную консультацию!', 'Заказать консультацию');
  }
}
