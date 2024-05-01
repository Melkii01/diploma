import {Component, OnInit} from '@angular/core';
import {ArticlesResponseType} from "../../types/articles-response.type";
import {ArticlesService} from "../../services/articles.service";
import {DefaultResponseType} from "../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-popular-articles',
  templateUrl: './popular-articles.component.html',
  styleUrls: ['./popular-articles.component.scss']
})
export class PopularArticlesComponent implements OnInit {
  popularArticles: ArticlesResponseType[] = [];

  constructor(private articleService: ArticlesService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    // Получает данные популярных статей
    this.articleService.getPopularArticles()
      .subscribe({
        next: (data: DefaultResponseType | ArticlesResponseType[]) => {
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

          // Добавляем в каждом статье в адрес url
          data = data as ArticlesResponseType[];
          data.map(item => item.url = '/articles/' + item.url);

          // Записываем данные в переменную
          this.popularArticles = data;
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.message) {
            this.messageService.add({severity: 'error', summary: 'Ошибка', detail: errorResponse.error.message});
            throw new Error(errorResponse.error.message);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Ошибка',
              detail: 'Ошибка получения популярных статей'
            });
            throw new Error(errorResponse.error.message);
          }
        }
      })
  }
}
