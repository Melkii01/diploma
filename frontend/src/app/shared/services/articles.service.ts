import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {DefaultResponseType} from "../types/default-response.type";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {PopularArticlesResponseType} from "../types/popular-articles-response.type";

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient) {
  }

  /**
   * Отправляет запрос для получения популярных статей
   */
  popularArticles(): Observable<DefaultResponseType | PopularArticlesResponseType[]> {
    return this.http.get<DefaultResponseType | PopularArticlesResponseType[]>(environment.api + 'articles/top')
  }
}
