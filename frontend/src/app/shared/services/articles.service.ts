import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {DefaultResponseType} from "../types/default-response.type";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ArticleRelatedResponseType} from "../types/article-related-response.type";
import {ArticlesActiveParamsType} from "../types/articles-active-params.type";
import {ArticleResponseType} from "../types/article-response.type";
import {ArticlesRelatedResponseType} from "../types/articles-related-response.type";

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient) {
  }

  /**
   * Отправляет запрос для получения популярных статей
   */
  getPopularArticles(): Observable<DefaultResponseType | ArticleRelatedResponseType[]> {
    return this.http.get<DefaultResponseType | ArticleRelatedResponseType[]>(environment.api + 'articles/top');
  }

  /**
   * Отправляет запрос для получения статей с заданными параметрами
   * @param params параметры запросы
   */
  getArticles(params: ArticlesActiveParamsType): Observable<DefaultResponseType | ArticlesRelatedResponseType> {
    return this.http.get<DefaultResponseType | ArticlesRelatedResponseType>(environment.api + 'articles', {
      params: params
    });
  }

  /**
   * Отправляет запрос для получения статьи
   * @param url адрес статьи
   */
  getArticle(url: string): Observable<DefaultResponseType | ArticleResponseType> {
    return this.http.get<DefaultResponseType | ArticleResponseType>(environment.api + 'articles/' + url);
  }

  /**
   * Отправляет запрос для получения связанных статей
   * @param url адрес статьи
   */
  getRelatedArticle(url: string): Observable<DefaultResponseType | ArticleRelatedResponseType[]> {
    return this.http.get<DefaultResponseType | ArticleRelatedResponseType[]>(environment.api + 'articles/related/' + url);
  }
}
