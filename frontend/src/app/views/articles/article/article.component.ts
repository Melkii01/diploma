import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {catchError, combineLatest, concatMap, debounceTime, mergeMap, of, Subscription} from "rxjs";
import {ArticlesService} from "../../../shared/services/articles.service";
import {DefaultResponseType} from "../../../shared/types/default-response.type";
import {ArticleRelatedResponseType} from "../../../shared/types/article-related-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MessageService} from "primeng/api";
import {ArticleResponseType} from "../../../shared/types/article-response.type";
import {AuthService} from "../../../core/auth/auth.service";
import {CommentService} from "../../../shared/services/comment.service";
import {CommentsResponseType} from "../../../shared/types/comments-response.type";
import {FormBuilder, Validators} from "@angular/forms";
import {CommentType} from "../../../shared/types/comment.type";
import {CommentActionsType} from "../../../shared/types/comment-actions.type";
import {CommentActionEnum} from "../../../shared/types/comment-action.enum";
import {ErrorResponseService} from "../../../shared/services/error-response.service";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit, OnDestroy {
  url: string = '';
  isLogged: boolean = false;
  relatedArticles: ArticleRelatedResponseType[] = [];
  article: ArticleResponseType = {} as ArticleResponseType;
  additionalComments: CommentType[] = [];
  commentForm = this.fb.group({
    comment: ['', Validators.required]
  });
  offset: number = 3;
  userCommentActions: CommentActionsType[] = [];
  private subs: Subscription = new Subscription();

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private articleService: ArticlesService,
              private messageService: MessageService,
              private authService: AuthService,
              private commentService: CommentService,
              private fb: FormBuilder,
              private errorResponseService: ErrorResponseService) {
    // Устанавливаем флаг авторизации
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit() {
    // Следит за авторизацией пользователя
    this.subs.add(this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    }));

    // Получаем url статьи
    this.activatedRoute.params
      .pipe(
        debounceTime(500),

        mergeMap((params: Params) => {
          // Сохраняем url и запрашиваем связанные статьи и основную статью
          this.url = params['url'];
          return combineLatest([this.articleService.getRelatedArticle(this.url), this.articleService.getArticle(this.url)]);
        }),

        catchError(error => {
          this.errorResponseService.errorResponse(error, 'Ошибка получения параметров url');
          throw new Error(error);
        }),

        mergeMap(([articleRelated, article]) => {
          // Отображаем полученные связанные статьи и основную статью
          this.showRelatedArticle(articleRelated);
          return this.showArticle(article);
        }),

        catchError(error => {
          this.errorResponseService.errorResponse(error, 'Ошибка отображения связанных статей или основной статьи');
          throw new Error(error);
        })
      )
      .subscribe({
        next: (comments: CommentActionsType[] | DefaultResponseType | null) => {
          // Если пользователь авторизован, отображаем его реакции на комментарии
          if (comments) {
            this.showArticleCommentActions(comments);
          }
        },

        error: (errorResponse: HttpErrorResponse) => {
          this.errorResponseService.errorResponse(errorResponse, 'Ошибка отображения реакции пользователя на комментарии');
        }
      });
  }

  /**
   * Отображает связанные статьи
   */
  private showRelatedArticle(articleRelated: DefaultResponseType | ArticleRelatedResponseType[]) {
    let error = null;

    // Если есть ошибка записываем в переменную error
    if ((articleRelated as DefaultResponseType).error !== undefined) {
      error = (articleRelated as DefaultResponseType).message;
    }

    // Если есть ошибка выводим ошибку и останавливаем функцию
    if (error) {
      this.messageService.add({severity: 'error', summary: 'Ошибка', detail: error});
      throw new Error(error);
    }

    // Записываем данные в переменную
    this.relatedArticles = articleRelated as ArticleRelatedResponseType[];
  }


  /**
   * Отображает основную статью
   */
  private showArticle(article: DefaultResponseType | ArticleResponseType) {
    let error = null;

    // Если есть ошибка записываем в переменную error
    if ((article as DefaultResponseType).error !== undefined) {
      error = (article as DefaultResponseType).message;
    }

    // Если есть ошибка выводим ошибку и останавливаем функцию
    if (error) {
      this.messageService.add({severity: 'error', summary: 'Ошибка', detail: error});
      throw new Error(error);
    }

    // Записываем данные в переменную
    this.article = article as ArticleResponseType;

    // Если авторизован получаем реакции пользователя
    if (this.isLogged) {
      return this.commentService.getArticleCommentActions(this.article.id);
    }
    return of(null);
  }

  /**
   * Отображает реакции пользователя к комментариям статьи
   * @param comments комментарии
   * @param additionalComment true - если отображаем дополнительные комментарии
   */
  private showArticleCommentActions(comments: DefaultResponseType | CommentActionsType[], additionalComment: boolean = false) {
    let error = null;

    // Если есть ошибка записываем в переменную error
    if ((comments as DefaultResponseType).error !== undefined) {
      error = (comments as DefaultResponseType).message;
    }

    // Если есть ошибка выводим ошибку и останавливаем функцию
    if (error) {
      this.messageService.add({severity: 'error', summary: 'Ошибка', detail: error});
      throw new Error(error);
    }

    // Записываем данные в переменную
    this.userCommentActions = comments as CommentActionsType[];

    if (additionalComment) {
      // Добавляем в дополнительных комментариях статьи, реакции пользователя, если он авторизовался
      this.additionalComments.filter((item: CommentType) => {
        return (comments as CommentActionsType[]).forEach(((action: CommentActionsType) => {
          if (action.comment === item.id) {
            if (action.action === CommentActionEnum.like) {
              item.user.like = true;
            }
            if (action.action === CommentActionEnum.dislike) {
              item.user.dislike = true;
            }
          }
        }))
      });

    } else {
      // Добавляем в первые три комментария статьи, реакции пользователя, если он авторизовался
      this.article.comments.map((item: CommentType) => {
        return (comments as CommentActionsType[]).forEach(((action: CommentActionsType) => {
          if (action.comment === item.id) {
            if (action.action === CommentActionEnum.like) {
              item.user.like = true;
            }
            if (action.action === CommentActionEnum.dislike) {
              item.user.dislike = true;
            }
          }
        }))
      });
    }
  }

  /**
   * Добавляет комментарию к статье только авторизованному пользователю
   */
  addComment() {
    // Если пользователь авторизован
    if (this.isLogged) {

      // Если форма комментарии валидна
      if (this.commentForm.valid && this.commentForm.value.comment) {
        this.commentService.addComment({text: this.commentForm.value.comment, article: this.article.id})
          .pipe(
            concatMap((data: DefaultResponseType) => {

              // Если есть ошибка выводим ошибку и останавливаем функцию
              if (data.error) {
                this.messageService.add({severity: 'error', summary: 'Ошибка', detail: data.message});
                throw new Error(data.message);
              }

              // Уведомляем, обнуляем форму
              this.messageService.add({
                severity: 'success',
                summary: 'Успешно',
                detail: 'Комментарий успешно добавлено'
              });
              this.commentForm.reset();

              // Если ранее комментарии просматривали, скрываем, а пропуск комментарий обнуляем до начального значения
              if (this.additionalComments.length > 0) {
                this.additionalComments = [];
                this.offset = 3;
              }

              // Получаем основную статью
              return this.articleService.getArticle(this.url);
            }),

            catchError(error => {
              this.errorResponseService.errorResponse(error, 'Ошибка добавления комментария');
              throw new Error(error);
            }),

            // Отображаем основную статью
            concatMap((data: DefaultResponseType | ArticleResponseType) => this.showArticle(data)),

            catchError(error => {
              this.errorResponseService.errorResponse(error, 'Ошибка отображения основной статьи');
              throw new Error(error);
            }),
          )
          .subscribe({
            next: (comments: CommentActionsType[] | DefaultResponseType | null) => {
              // Если пользователь авторизован, отображаем его реакции на комментарии
              if (comments) {
                this.showArticleCommentActions(comments);
              }
            },

            error: (errorResponse: HttpErrorResponse) => {
              this.errorResponseService.errorResponse(errorResponse, 'Ошибка отображения реакции пользователя на комментарии');
            }
          })
      }
    }
  }

  /**
   * Получает дополнительные комментарии
   */
  getComments() {

    this.commentService.getComments({article: this.article.id, offset: this.offset})
      .pipe(
        concatMap((comments: DefaultResponseType | CommentsResponseType) => {
          let error = null;

          // Если есть ошибка записываем в переменную error
          if ((comments as DefaultResponseType).error !== undefined) {
            error = (comments as DefaultResponseType).message;
          }

          // Если есть ошибка выводим ошибку и останавливаем функцию
          if (error) {
            this.messageService.add({severity: 'error', summary: 'Ошибка', detail: error});
            throw new Error(error);
          }

          // Добавляем комменты в массив комментов
          (comments as CommentsResponseType).comments.forEach(((item: CommentType) => {
            this.additionalComments.push(item);
          }));

          // Увеличиваем пропуск комментариев
          this.offset += 10;

          // Если авторизован получаем реакции пользователя
          if (this.isLogged) {
            return this.commentService.getArticleCommentActions(this.article.id);
          }
          return of(null);
        }),

        catchError(error => {
          this.errorResponseService.errorResponse(error, 'Ошибка получения дополнительных комментарий');
          throw new Error(error);
        }),
      )
      .subscribe({
        next: (comments: CommentActionsType[] | DefaultResponseType | null) => {
          // Если пользователь авторизован, отображаем его реакции на комментарии
          if (comments) {
            this.showArticleCommentActions(comments);
          }
        },

        error: (errorResponse: HttpErrorResponse) => {
          this.errorResponseService.errorResponse(errorResponse, 'Ошибка отображения реакции пользователя на комментарии');
        }
      });
  }

  /**
   * Добавляет реакцию пользователя к комментарию
   * @param actionData идентификатор комментария, реакция на комментарий
   * @param additionalComment true - если комментарий является дополнительным
   */
  applyActionToComment(actionData: CommentActionsType, additionalComment: boolean = false) {

    // Если авторизован
    if (this.isLogged) {

      this.commentService.applyActionToComment(actionData.comment, actionData.action)
        .pipe(
          concatMap((data: DefaultResponseType | ArticleResponseType | null) => {

            // Если есть ошибка выводим ошибку и останавливаем функцию
            if ((data as DefaultResponseType).error) {
              this.messageService.add({
                severity: 'error',
                summary: 'Ошибка',
                detail: (data as DefaultResponseType).message
              });
              throw new Error((data as DefaultResponseType).message);
            }

            // Уведомляем об успешности
            this.messageService.add({
              severity: 'success',
              summary: 'Успешно',
              detail: (data as DefaultResponseType).message
            });

            if (additionalComment) {
              // Если реакция была на дополнительных комментариях, перебираем массив дополнительных комментарий
              this.additionalComments.map((comment) => {

                // Находим данные по идентификатору комментария
                if (comment.id === actionData.comment) {

                  // Если реакция like
                  if (actionData.action === CommentActionEnum.like) {

                    // Если ранее был флаг dislike, обнуляем
                    if (comment.user.dislike) {
                      comment.dislikesCount -= 1;
                      comment.user.dislike = false;
                    }

                    // Если ранее был флаг like, обнуляем
                    if (comment.user.like) {
                      comment.likesCount -= 1;
                      comment.user.like = false;
                    } else {
                      // Если не было флага like, увеличиваем
                      comment.likesCount += 1;
                      comment.user.like = true;
                    }
                  }

                  // Если реакция dislike
                  if (actionData.action === CommentActionEnum.dislike) {

                    // Если ранее был флаг like, обнуляем
                    if (comment.user.like) {
                      comment.likesCount -= 1;
                      comment.user.like = false;
                    }

                    // Если ранее был флаг dislike, обнуляем
                    if (comment.user.dislike) {
                      comment.dislikesCount -= 1;
                      comment.user.dislike = false;
                    } else {
                      // Если не было флага dislike, увеличиваем
                      comment.dislikesCount += 1;
                      comment.user.dislike = true;
                    }
                  }
                }
              });

              return of(null);
            } else {
              // Если реакция была на первых трех комментариях, перезагружаем статью
              return this.articleService.getArticle(this.url);
            }

          }),

          catchError(error => {
            this.errorResponseService.errorResponse(error, 'Ошибка добавления реакции');
            throw new Error(error);
          }),

          concatMap((data: DefaultResponseType | ArticleResponseType | null) => {
            // Если есть ошибка выводим ошибку и останавливаем функцию
            if ((data as DefaultResponseType).error) {
              this.messageService.add({
                severity: 'error',
                summary: 'Ошибка',
                detail: (data as DefaultResponseType).message
              });
              new Error((data as DefaultResponseType).message);
              return of(null);
            }

            // Отображаем основную статью
            return this.showArticle(data as ArticleResponseType);
          }),

          catchError(error => {
            this.errorResponseService.errorResponse(error, 'Ошибка отображения основной статьи');
            throw new Error(error);
          }),
        )
        .subscribe({
          next: (comments: CommentActionsType[] | DefaultResponseType | null) => {
            // Если пользователь авторизован, отображаем его реакции на комментарии
            if (comments) {
              this.showArticleCommentActions(comments);
            }
          },

          error: (errorResponse: HttpErrorResponse) => {
            this.errorResponseService.errorResponse(errorResponse, 'Ошибка отображения реакции пользователя на комментарии');
          }
        });

    } else {
      this.messageService.add({severity: 'error', summary: 'Ошибка', detail: 'Вы не авторизованы'});
      return;
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
