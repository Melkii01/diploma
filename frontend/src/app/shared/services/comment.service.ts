import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../types/default-response.type";
import {environment} from "../../../environments/environment";
import {CommentsParamsType} from "../types/comments-params.type";
import {CommentsResponseType} from "../types/comments-response.type";
import {CommentAddType} from "../types/comment-add.type";
import {CommentActionsType} from "../types/comment-actions.type";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) {
  }

  /**
   * Отправляет запрос на получение комментариев по статье
   * @param params количество комментов и идентификатор статьи
   */
  getComments(params: CommentsParamsType): Observable<CommentsResponseType | DefaultResponseType> {
    // const httpParams = new HttpParams()
    //   .set('offset', params.offset)
    //   .set('article', params.article)
    return this.http.get<CommentsResponseType | DefaultResponseType>(environment.api + 'comments', {
      params: params
    });
  }

  /**
   * Отправляет запрос на добавление комментарии к статье
   * @param params набранный комментарий и идентификатор статьи
   */
  addComment(params: CommentAddType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {
      text: params.text,
      article: params.article
    });
  }

  /**
   * Отправляет запрос на реакцию пользователя к комментарию
   * @param commentId идентификатор комментария
   * @param action реакция на комментарий
   */
  applyActionToComment(commentId: string, action: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + commentId + '/apply-action', {
      action
    });
  }

  /**
   * Отправка запроса на получение реакций авторизованного пользователя ко всем комментариям статьи
   * @param id идентификатор статьи
   */
  getArticleCommentActions(id: string): Observable<CommentActionsType[] | DefaultResponseType> {
    return this.http.get<CommentActionsType[] | DefaultResponseType>(environment.api + 'comments/article-comment-actions', {
      params: {articleId: id}
    });
  }

  // /**
  //  * Отправка запроса на получение реакции авторизованного пользователя для определенного комментария
  //  * @param id идентификатор комментария
  //  */
  // getCommentAction(id: string): Observable<CommentActionsType[] | DefaultResponseType> {
  //   return this.http.get<CommentActionsType[] | DefaultResponseType>(environment.api + 'comments/' + id + '/actions');
  // }

}
