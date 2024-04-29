import { Component,  OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ModalService} from "../../services/modal.service";
import {RequestsService} from "../../services/requests.service";
import {DefaultResponseType} from "../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  visibleModal = false;
  visibleBlock = true;
  title = '';
  service = '';
  modal = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    service: [this.service, [Validators.required]],
  })


  constructor(private fb: FormBuilder,
              private modalService: ModalService,
              private requestsService: RequestsService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    // Подписываемся на изменения и переписываем переменные
    this.modalService.isShowed$.subscribe((isShowed: boolean) => {
      this.visibleModal = isShowed;
    });
    this.modalService.title$.subscribe((title: string) => {
      this.title = title;
    });

    this.modalService.service$.subscribe((service: string) => {
      this.service = service;
    });
  }

  // Закрыть модалку, также переключить на форму
  closeModal() {
    this.modalService.hide();
    this.visibleBlock = true;
  }

  // Отправка формы
  send() {
    if (this.modal.valid && this.modal.value.name && this.modal.value.phone && this.modal.value.service) {
      this.requestsService.requests(this.modal.value.name, this.modal.value.phone,
        this.modal.value.service)
        .subscribe({
          next: (data: DefaultResponseType) => {
            let error = null;

            // Если ошибка есть
            if (data.error) {
              error = (data as DefaultResponseType).message;
            }
            if (error) {
              this.snackBar.open(error);
              throw new Error(error);
            }

            // Переключаемся на успешный блок, а также через время возвращаем обратно
            this.visibleBlock = false;
            setTimeout(() => {
              this.visibleBlock = true;

            }, 7000);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.message) {
              this.snackBar.open(errorResponse.error.message);
            } else {
              this.snackBar.open('Ошибка отправки');
            }
          }
        });
    }
  }

}
