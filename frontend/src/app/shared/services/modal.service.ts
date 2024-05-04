import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  isShowed$ = new Subject<boolean>();
  modalData$ = new Subject<{ type: string, service: string, title: string, buttonText: string }>();

  /**
   * Устанавливает флаг показать модальное окно, также устанавливает
   * @param service название услуги
   * @param type тип обращения
   * @param title оглавление модуля
   * @param buttonText текст на кнопке
   */
  show(type: string, service: string,title: string, buttonText: string): void {
    this.isShowed$.next(true);
    this.modalData$.next({type, service, title, buttonText});
  }

  /**
   * Устанавливает флаг скрыть модальное окно
   */
  hide() {
    this.isShowed$.next(false);
  }
}
