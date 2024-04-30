import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  isShowed$ = new Subject<boolean>();
  title$ = new Subject<string>();
  service$ = new Subject<string>();

  /**
   * Устанавливает флаг показать модальное окно, также устанавливает
   * @param title оглавление формы
   * @param service тип услуги
   */
  show(title: string, service: string = '') {
    this.isShowed$.next(true);
    this.title$.next(title);
    this.service$.next(service);
  }

  /**
   * Устанавливает флаг скрыть модальное окно
   */
  hide() {
    this.isShowed$.next(false);
  }
}
