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
import { ContactsComponent } from './components/contacts/contacts.component';
import { ModalComponent } from './components/modal/modal.component';
import {DialogModule} from "primeng/dialog";
import {ButtonModule} from "primeng/button";
import {ReactiveFormsModule} from "@angular/forms";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {MenuModule} from 'primeng/menu';
import {TextLengthPipe, TitleLengthPipe} from './pipes/text-length.pipe';
import { ArticleCommentComponent } from './components/article-comment/article-comment.component';

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
    ModalComponent,
    TextLengthPipe,
    TitleLengthPipe,
    ArticleCommentComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    MenuModule,
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
        ModalComponent,
        TextLengthPipe,
        TitleLengthPipe,
        ArticleCommentComponent
    ]
})
export class SharedModule {
}
