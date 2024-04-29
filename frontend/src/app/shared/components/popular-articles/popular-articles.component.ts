import {Component, OnInit} from '@angular/core';
import {PopularArticlesResponseType} from "../../types/popular-articles-response.type";
import {ArticlesService} from "../../services/articles.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DefaultResponseType} from "../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-popular-articles',
  templateUrl: './popular-articles.component.html',
  styleUrls: ['./popular-articles.component.scss']
})
export class PopularArticlesComponent implements OnInit {
  popularArticles: PopularArticlesResponseType[] = [];

  constructor(private articleService: ArticlesService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.articleService.popularArticles()
      .subscribe({
        next: (data: DefaultResponseType | PopularArticlesResponseType[]) => {
          let error = null;

          // Если есть ошибка
          if ((data as DefaultResponseType).error !== undefined) {
            error = (data as DefaultResponseType).message;
          }
          if (error) {
            this.snackBar.open(error);
            throw new Error(error);
          }

          // Записываем данные в переменную
          this.popularArticles = data as PopularArticlesResponseType[];
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.message) {
            this.snackBar.open(errorResponse.error.message);
          } else {
            this.snackBar.open('Ошибка получения популярных статей');
          }
        }
      })

  }
}
