import {Component, Input, OnDestroy, OnInit} from '@angular/core';
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
  visibleModal: boolean = false;

  // Показать/скрыть блок формы внутри модального окна
  visibleBlock: boolean = true;
  title: string = '';
  type: string = '';
  service: string = '';
  buttonText: string = '';

  private subs: Subscription = new Subscription();
  modal = this.fb.group({
    service: [''],
    name: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/)]],
  })

  constructor(private fb: FormBuilder,
              private modalService: ModalService,
              private requestsService: RequestsService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    // Подписываемся на изменения и переписываем переменные
    this.subs.add(this.modalService.isShowed$.subscribe((isShowed: boolean): void => {
      this.visibleModal = isShowed;
    }));

    this.subs.add(this.modalService.modalData$.subscribe((data: { type: string, service: string, title: string, buttonText: string }): void => {
      this.modal.get('service')?.patchValue(data.service);
      this.type = data.type;
      this.service = data.service;
      this.title = data.title;
      this.buttonText = data.buttonText;
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

    // Обнуляем форму, записываем в инпут услугу
    this.modal.reset();
    this.modal.get('service')?.patchValue(this.service);

  }

  /**
   *  Отправляет заявку на оформление заказа
   */
  send(): void {
    if (this.modal.valid && this.modal.value.name && this.modal.value.phone && this.modal.value.service) {

      this.requestsService.requests(this.modal.value.name, this.modal.value.phone,
        this.type, this.modal.value.service)
        .subscribe({
          next: (data: DefaultResponseType): void => {
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

            // Переключаемся на успешный блок, обнуляем форму, записываем в инпут услугу
            this.visibleBlock = false;
            this.modal.reset();
            this.modal.get('service')?.patchValue(this.service);

            // Через время возвращаем обратно блок заполнения формы
            setTimeout((): void => {
              if (!this.visibleBlock) {
                this.visibleBlock = true;
              }
            }, 7000);
          },
          error: (errorResponse: HttpErrorResponse): void => {
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
