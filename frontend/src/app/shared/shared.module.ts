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


@NgModule({
  declarations: [
    LayoutComponent,
    FooterComponent,
    HeaderComponent,
    CarouselComponent,
    PopularArticlesComponent,
    ArticleCardComponent,
    ReviewsComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    LayoutComponent,
    FooterComponent,
    HeaderComponent,
    CarouselComponent,
    PopularArticlesComponent,
    ArticleCardComponent,
    ReviewsComponent
  ]
})
export class SharedModule {
}
