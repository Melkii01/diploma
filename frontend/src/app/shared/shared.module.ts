import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutComponent} from './layout/layout.component';
import {FooterComponent} from './layout/footer/footer.component';
import {HeaderComponent} from './layout/header/header.component';
import {RouterModule} from "@angular/router";
import {CarouselComponent} from './components/carousel/carousel.component';
import {PopularArticlesComponent} from './components/popular-articles/popular-articles.component';
import {ArticleCardComponent} from './components/article-card/article-card.component';
import {ReviewsComponent} from './components/reviews/reviews.component';
import { LoaderComponent } from './components/loader/loader.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";


@NgModule({
  declarations: [
    LayoutComponent,
    FooterComponent,
    HeaderComponent,
    CarouselComponent,
    PopularArticlesComponent,
    ArticleCardComponent,
    ReviewsComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule
  ],
  exports: [
    LayoutComponent,
    FooterComponent,
    HeaderComponent,
    CarouselComponent,
    PopularArticlesComponent,
    ArticleCardComponent,
    ReviewsComponent,
    LoaderComponent
  ]
})
export class SharedModule {
}
