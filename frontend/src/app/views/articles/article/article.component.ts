import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {debounceTime, Subscription} from "rxjs";
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

  ngOnInit(): void {
    // Следит за авторизацией пользователя
    this.subs.add(this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    }));

    // Получаем url статьи
    this.activatedRoute.params
      .pipe(
        debounceTime(500)
      )
      .subscribe(params => {
        // Отправляем url статьи для получения статьи и связанной статьи
        this.url = params['url'];
        this.getRelatedArticle();
        this.getArticle();
      });

  }

  /**
   * Отправка запроса на получение связанной статьи
   */
  getRelatedArticle(): void {
    this.articleService.getRelatedArticle(this.url)
      .subscribe({
        next: (data: DefaultResponseType | ArticleRelatedResponseType[]) => {
          let error = null;

          // Если есть ошибка записываем в переменную error
          if ((data as DefaultResponseType).error !== undefined) {
            error = (data as DefaultResponseType).message;
          }

          // Если есть ошибка выводим ошибку и останавливаем функцию
          if (error) {
            this.messageService.add({severity: 'error', summary: 'Ошибка', detail: error});
            throw new Error(error);
          }

          // Записываем данные в переменную
          this.relatedArticles = data as ArticleRelatedResponseType[];
        },

        error: (errorResponse: HttpErrorResponse) => {
          this.errorResponseService.errorResponse(errorResponse, 'Ошибка получения связанных статей')
        }
      });
  }

  /**
   * Отправка запроса на получение основной статьи
   */
  getArticle(): void {
    this.articleService.getArticle(this.url)
      .subscribe({
        next: (data: DefaultResponseType | ArticleResponseType) => {
          let error = null;

          // Если есть ошибка записываем в переменную error
          if ((data as DefaultResponseType).error !== undefined) {
            error = (data as DefaultResponseType).message;
          }

          // Если есть ошибка выводим ошибку и останавливаем функцию
          if (error) {
            this.messageService.add({severity: 'error', summary: 'Ошибка', detail: error});
            throw new Error(error);
          }

          // Записываем данные в переменную
          this.article = data as ArticleResponseType;

          // Если авторизован получаем реакции пользователя
          if (this.isLogged) {
            this.getArticleCommentActions();
          }
        },

        error: (errorResponse: HttpErrorResponse) => {
          this.errorResponseService.errorResponse(errorResponse, 'Ошибка получения статьи')
        }
      });
  }

  /**
   * Отправка запроса на получение реакций пользователя к комментариям статьи
   * @param additionalComment true - если получаем дополнительные комментарии
   */
  getArticleCommentActions(additionalComment: boolean = false) {
    this.commentService.getArticleCommentActions(this.article.id)
      .subscribe({
        next: (data: DefaultResponseType | CommentActionsType[]) => {
          let error = null;

          // Если есть ошибка записываем в переменную error
          if ((data as DefaultResponseType).error !== undefined) {
            error = (data as DefaultResponseType).message;
          }

          // Если есть ошибка выводим ошибку и останавливаем функцию
          if (error) {
            this.messageService.add({severity: 'error', summary: 'Ошибка', detail: error});
            throw new Error(error);
          }

          // Записываем данные в переменную
          this.userCommentActions = data as CommentActionsType[];

          if (additionalComment) {
            // Добавляем в дополнительных комментариях статьи, реакции пользователя, если он авторизовался
            this.additionalComments.filter((item: CommentType) => {
              return (data as CommentActionsType[]).forEach(((action: CommentActionsType) => {
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
              return (data as CommentActionsType[]).forEach(((action: CommentActionsType) => {
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
        },

        error: (errorResponse: HttpErrorResponse) => {
          this.errorResponseService.errorResponse(errorResponse, 'Ошибка получения реакций статьи');
        }
      })
  }

  /**
   * Отправляет запрос на добавление комментарии к статье только авторизованным пользователям
   */
  addComment() {
    if (this.isLogged) {

      if (this.commentForm.valid && this.commentForm.value.comment) {
        this.commentService.addComment({text: this.commentForm.value.comment, article: this.article.id})
          .subscribe({
            next: (data: DefaultResponseType): void => {

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

              // Перезагружаем статью, для отображения последних трех комментариев
              this.getArticle();
            },

            error: (errorResponse: HttpErrorResponse) => {
              this.errorResponseService.errorResponse(errorResponse, 'Ошибка добавления комментария');
            }
          })
      }
    }
  }

  /**
   * Отправить запрос на получение дополнительных комментариев
   */
  getComments() {

    this.commentService.getComments({article: this.article.id, offset: this.offset})
      .subscribe({
        next: (data: DefaultResponseType | CommentsResponseType) => {
          let error = null;

          // Если есть ошибка записываем в переменную error
          if ((data as DefaultResponseType).error !== undefined) {
            error = (data as DefaultResponseType).message;
          }

          // Если есть ошибка выводим ошибку и останавливаем функцию
          if (error) {
            this.messageService.add({severity: 'error', summary: 'Ошибка', detail: error});
            throw new Error(error);
          }

          // Добавляем комменты в массив комментов
          (data as CommentsResponseType).comments.forEach(((item: CommentType): void => {
            this.additionalComments.push(item);
          }));

          // Увеличиваем пропуск комментариев
          this.offset += 10;

          // Добавляем в дополнительных комментариях статьи, реакции пользователя, если он авторизовался
          if (this.isLogged) {
            this.getArticleCommentActions(true);
          }
        },

        error: (errorResponse: HttpErrorResponse) => {
          this.errorResponseService.errorResponse(errorResponse, 'Ошибка получения комментариев');
        }
      });
  }

  /**
   * Отправляет запрос на реакцию пользователя к комментарию
   * @param actionData идентификатор комментария, реакция на комментарий
   * @param additionalComment true - если комментарий является дополнительным
   */
  applyActionToComment(actionData: CommentActionsType, additionalComment: boolean = false): void {

    // Если авторизован
    if (this.isLogged) {

      this.commentService.applyActionToComment(actionData.comment, actionData.action)
        .subscribe({
          next: (data: DefaultResponseType) => {

            // Если есть ошибка выводим ошибку и останавливаем функцию
            if (data.error) {
              this.messageService.add({severity: 'error', summary: 'Ошибка', detail: data.message});
              throw new Error(data.message);
            }

            // Уведомляем об успешности
            this.messageService.add({severity: 'success', summary: 'Успешно', detail: data.message});

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

            } else {
              // Если реакция была на первых трех комментариях, перезагружаем статью
              this.getArticle();
            }
          },

          error: (errorResponse: HttpErrorResponse) => {
            this.errorResponseService.errorResponse(errorResponse, 'Ошибка добавления реакции');
          }
        });
    } else {
      this.messageService.add({severity: 'error', summary: 'Ошибка', detail: 'Вы не авторизованы'});
      return;
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
