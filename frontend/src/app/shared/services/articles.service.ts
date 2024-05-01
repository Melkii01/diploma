import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {DefaultResponseType} from "../types/default-response.type";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ArticlesResponseType} from "../types/articles-response.type";
import {ActiveParamsType} from "../types/active-params.type";

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient) {
  }

  /**
   * Отправляет запрос для получения популярных статей
   */
  getPopularArticles(): Observable<DefaultResponseType | ArticlesResponseType[]> {
    return this.http.get<DefaultResponseType | ArticlesResponseType[]>(environment.api + 'articles/top')
  }

  /**
   * Отправляет запрос для получения статей с заданными параметрами
   * @param params параметры запросы
   */
  getArticles(params: ActiveParamsType): Observable<{ totalCount: number, pages: number, items: ArticlesResponseType[] }> {
    return this.http.get<{ totalCount: number, pages: number, items: ArticlesResponseType[] }>(environment.api + 'articles', {
      params: params
    });
  }
}
