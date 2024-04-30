import {Component, OnInit} from '@angular/core';
import {PopularArticlesResponseType} from "../../types/popular-articles-response.type";
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
  popularArticles: PopularArticlesResponseType[] = [];

  constructor(private articleService: ArticlesService,

              private messageService: MessageService) {
  }

  ngOnInit(): void {
    // Получает данные популярных статей
    this.articleService.popularArticles()
      .subscribe({
        next: (data: DefaultResponseType | PopularArticlesResponseType[]) => {
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
          this.popularArticles = data as PopularArticlesResponseType[];
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.message) {
            this.messageService.add({severity: 'error', summary: 'Ошибка', detail: errorResponse.error.message});
            throw new Error(errorResponse.error.message);
          } else {
            this.messageService.add({severity: 'error', summary: 'Ошибка', detail: 'Ошибка получения популярных статей'});
            throw new Error(errorResponse.error.message);
          }
        }
      })
  }
}
