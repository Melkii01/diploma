import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutComponent} from './layout/layout.component';
import {FooterComponent} from './layout/footer/footer.component';
import {HeaderComponent} from './layout/header/header.component';
import {RouterModule} from "@angular/router";
import {PopularArticlesComponent} from './components/popular-articles/popular-articles.component';
import {ArticleCardComponent} from './components/article-card/article-card.component';
import {ReviewsComponent} from './components/reviews/reviews.component';
import { LoaderComponent } from './components/loader/loader.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatMenuModule} from "@angular/material/menu";
import { ContactsComponent } from './components/contacts/contacts.component';
import {CarouselModule} from "primeng/carousel";
import { ModalComponent } from './components/modal/modal.component';
import {DialogModule} from "primeng/dialog";
import {ButtonModule} from "primeng/button";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    LayoutComponent,
    FooterComponent,
    HeaderComponent,
    PopularArticlesComponent,
    ArticleCardComponent,
    ReviewsComponent,
    LoaderComponent,
    ContactsComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
  ],
  exports: [
    LayoutComponent,
    FooterComponent,
    HeaderComponent,
    PopularArticlesComponent,
    ArticleCardComponent,
    ReviewsComponent,
    LoaderComponent,
    ContactsComponent,
    ModalComponent
  ]
})
export class SharedModule {
}
