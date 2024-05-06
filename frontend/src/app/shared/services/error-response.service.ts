import {Injectable} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {MessageService} from "primeng/api";

@Injectable({
  providedIn: 'root',
})

export class ErrorResponseService {
  constructor(private messageService: MessageService) {
  }

  errorResponse(errorResponse: HttpErrorResponse, message: string) {
    if (errorResponse.error.error && errorResponse.error.message) {
      this.messageService.add({severity: 'error', summary: 'Ошибка', detail: errorResponse.error.message});
      console.log(errorResponse)
      throw new Error(errorResponse.error.message);
    } else {
      this.messageService.add({severity: 'error', summary: 'Ошибка', detail: message});
      throw new Error(message);
    }
  }
}
