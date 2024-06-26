import {Component, OnInit} from '@angular/core';
import {ArticleRelatedResponseType} from "../../types/article-related-response.type";
import {ArticlesService} from "../../services/articles.service";
import {DefaultResponseType} from "../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MessageService} from "primeng/api";
import {ErrorResponseService} from "../../services/error-response.service";

@Component({
  selector: 'app-popular-articles',
  templateUrl: './popular-articles.component.html',
  styleUrls: ['./popular-articles.component.scss']
})
export class PopularArticlesComponent implements OnInit {
  popularArticles: ArticleRelatedResponseType[] = [];

  constructor(private articleService: ArticlesService,
              private messageService: MessageService,
              private errorResponseService:ErrorResponseService) {
  }

  ngOnInit(): void {
    // Получает данные популярных статей
    this.articleService.getPopularArticles()
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
          this.popularArticles = data as ArticleRelatedResponseType[];
        },
        error: (errorResponse: HttpErrorResponse) => {
          this.errorResponseService.errorResponse(errorResponse,'Ошибка получения популярных статей');
        }
      });
  }
}
