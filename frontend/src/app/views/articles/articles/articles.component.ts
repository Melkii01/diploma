import {Component, OnInit} from '@angular/core';
import {ArticlesService} from "../../../shared/services/articles.service";
import {ArticleRelatedResponseType} from "../../../shared/types/article-related-response.type";
import {ArticlesActiveParamsType} from "../../../shared/types/articles-active-params.type";
import {CategoryService} from "../../../shared/services/category.service";
import {ActivatedRoute, Router} from "@angular/router";
import {debounceTime} from "rxjs";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.utils";
import {AppliedFilterType} from "../../../shared/types/applied-filter.type";
import {CategoryResponseType} from "../../../shared/types/category-response.type";
import {DefaultResponseType} from "../../../shared/types/default-response.type";
import {ArticleResponseType} from "../../../shared/types/article-response.type";
import {MessageService} from "primeng/api";
import {ArticlesResponseType} from "../../../shared/types/articles-response.type";

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
  articles: ArticleRelatedResponseType[] = [];
  categories: CategoryResponseType[] = [];
  activeParams: ArticlesActiveParamsType = {categories: []};
  appliedFilters: AppliedFilterType[] = [];
  sortingOpen = false;
  pages: number[] = [];

  constructor(private articleService: ArticlesService,
              private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    // Зарос на список категорий
    this.categoryService.getCategories()
      .subscribe((data: CategoryResponseType[]): void => {
        this.categories = data;

        // Ищем параметры фильтров в url
        this.activatedRoute.queryParams
          .pipe(
            debounceTime(500)
          )
          .subscribe(params => {

            // Возвращает объект с параметрами из url
            this.activeParams = ActiveParamsUtil.processParams(params);

            // Переменная для записи примененных фильтров
            this.appliedFilters = [];

            // Находим фильтра из url параметра
            this.activeParams.categories.forEach(url => {
              const foundType = this.categories.find((category: CategoryResponseType): boolean => category.url === url);

              // Если нашли записываем в переменную примененных фильтров
              if (foundType) {
                this.appliedFilters.push({
                  name: foundType.name,
                  urlParam: foundType.url
                })
              }
            });

            // Запрос на список статей
            this.articleService.getArticles(this.activeParams)
              .subscribe({
                next: (data: ArticlesResponseType | DefaultResponseType): void => {
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

                  // Записываем массив страниц и данные
                  data = data as ArticlesResponseType;
                  this.pages = [];
                  for (let i = 1; i <= data.pages; i++) {
                    this.pages.push(i);
                  }
                  this.articles = data.items;
                }
              });
          })
      })
  }

  /**
   * Удлаить примененный фильтр
   * @param appliedFilter url примененного фильтра
   */
  removeAppliedFilter(appliedFilter: AppliedFilterType) {
    this.activeParams.categories = this.activeParams.categories.filter((item: string): boolean => item !== appliedFilter.urlParam);

    this.activeParams.page = 1;
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    });
  }

  /**
   * Показать или скрыть выпадающий список фильтров
   */
  toggleSorting() {
    this.sortingOpen = !this.sortingOpen;
  }

  /**
   * Удалить или добавить фильтр
   * @param filter url фильтра
   */
  toggleFilter(filter: string) {
    // Ищем категорию, есть ли он в массиве категорий в активных параметрах url
    const foundType: string | undefined = this.activeParams.categories.find((item: string): boolean => item === filter);

    // Фильтруем массив, убираем категорию, если он есть в массиве
    this.activeParams.categories = this.activeParams.categories.filter(item => item !== filter);

    // Если категории нет в массиве, добавляем
    if (!foundType) {
      this.activeParams.categories.push(String(filter))
    }

    // Переключаемся на первую страницу
    this.activeParams.page = 1;

    // Отображаем страницу с новыми параметрами url
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    })
  }

  /**
   * Возвращает boolean, при применении фильтра
   * @param category url фильтра
   */
  appliedFilter(category: string) {
    return this.appliedFilters.find((filter: AppliedFilterType): boolean => filter.urlParam === category);
  }

  /**
   * Открыть нужную страницу
   * @param page номер страницы
   */
  openPage(page: number) {
    this.activeParams.page = page;

    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    });
  }

  /**
   * Открыть предыдущую страницу
   */
  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
    }

    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    });
  }

  /**
   * Открыть следующую страницу
   */
  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
    }

    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    });
  }
}
