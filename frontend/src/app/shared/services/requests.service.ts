import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {DefaultResponseType} from "../types/default-response.type";
import {LoginResponseType} from "../types/login-response.type";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {RequestsResponseType} from "../types/requests-response.type";

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor(private http: HttpClient) {
  }

  // Авторизоваться
  requests(name: string, phone: string, service: string, type: string = 'order'): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', {
      name,
      phone,
      service,
      type
    })
  }
}
