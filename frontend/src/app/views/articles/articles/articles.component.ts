import {Component, OnInit} from '@angular/core';
import {ArticlesService} from "../../../shared/services/articles.service";
import {ArticlesResponseType} from "../../../shared/types/articles-response.type";
import {ActiveParamsType} from "../../../shared/types/active-params.type";
import {CategoryService} from "../../../shared/services/category.service";
import {ActivatedRoute, Router} from "@angular/router";
import {debounceTime} from "rxjs";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.utils";
import {AppliedFilterType} from "../../../shared/types/applied-filter.type";
import {CategoryType} from "../../../shared/types/category.type";

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
  articles: ArticlesResponseType[] = [];
  categories: CategoryType[] = [];
  activeParams: ActiveParamsType = {categories: []};
  appliedFilters: AppliedFilterType[] = [];
  sortingOpen = false;
  pages: number[] = [];

  constructor(private articleService: ArticlesService,
              private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  // Запрашиваем каталог
  ngOnInit(): void {
    // Зарос на список категорий
    this.categoryService.getCategories()
      .subscribe((data: CategoryType[]): void => {
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
              const foundType = this.categories.find((category: CategoryType): boolean => category.url === url);

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
              .subscribe((data: { totalCount: number; pages: number; items: ArticlesResponseType[] }): void => {
                this.pages = [];
                for (let i = 1; i <= data.pages; i++) {
                  this.pages.push(i);
                }
                this.articles = data.items;
              });
          })
      });
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
