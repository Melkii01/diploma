import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {DefaultResponseType} from "../types/default-response.type";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor(private http: HttpClient) {
  }

  /**
   * Отправка заявку
   * @param name имя пользователя
   * @param phone телефон пользователя
   * @param service тип услуги
   * @param type тип заявки
   */
  requests(name: string, phone: string, type: string, service: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', {
      name,
      phone,
      type,
      service
    })
  }
}
