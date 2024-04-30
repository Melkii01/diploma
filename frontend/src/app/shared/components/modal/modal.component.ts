import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ModalService} from "../../services/modal.service";
import {RequestsService} from "../../services/requests.service";
import {DefaultResponseType} from "../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {Subscription} from "rxjs";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {
  // Показать/скрыть модальное окно
  visibleModal = false;

  // Показать/скрыть блок формы внутри модального окна
  visibleBlock = true;
  title = '';
  private subs: Subscription = new Subscription();
  modal = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    service: ['', [Validators.required]],
  })

  constructor(private fb: FormBuilder,
              private modalService: ModalService,
              private requestsService: RequestsService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {

    // Подписываемся на изменения и переписываем переменные
    this.subs.add(this.modalService.isShowed$.subscribe((isShowed: boolean) => {
      this.visibleModal = isShowed;
    }));
    this.subs.add(this.modalService.title$.subscribe((title: string) => {
      this.title = title;
    }));
    this.subs.add(this.modalService.service$.subscribe((service: string) => {
      this.modal.get('service')?.patchValue(service);
    }));
  }

  /**
   *  Отписывает от всех подписок
   */
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /**
   * Закрывает модальное окно, также переключается на блок формы
   */
  closeModal() {
    this.modalService.hide();
    this.visibleBlock = true;
  }

  /**
   *  Отправляет заявку на оформление заказа
   */
  send() {
    if (this.modal.valid && this.modal.value.name && this.modal.value.phone && this.modal.value.service) {
      this.requestsService.requests(this.modal.value.name, this.modal.value.phone,
        this.modal.value.service)
        .subscribe({
          next: (data: DefaultResponseType) => {
            let error = null;

            // Если ошибка есть, записываем в переменную error
            if (data.error) {
              error = (data as DefaultResponseType).message;
            }

            // Если есть ошибка выводим ошибку и останавливаем функцию
            if (error) {
              this.messageService.add({severity: 'error', summary: 'Ошибка', detail: error});
              throw new Error(error);
            }

            // Переключаемся на успешный блок, а также через время возвращаем обратно в блок заполнения формы
            this.visibleBlock = false;
            setTimeout(() => {
              this.visibleBlock = true;
            }, 7000);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.message) {
              this.messageService.add({severity: 'error', summary: 'Ошибка', detail: errorResponse.error.message});
              throw new Error(errorResponse.error.message);
            } else {
              this.messageService.add({severity: 'error', summary: 'Ошибка', detail: 'Ошибка отправки'});
              throw new Error(errorResponse.error.message);
            }
          }
        });
    }
  }
}
