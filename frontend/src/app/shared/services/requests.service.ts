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

  // Отправка данных в модалке
  requests(name: string, phone: string, service: string, type: string = 'order'): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', {
      name,
      phone,
      service,
      type
    })
  }
}
