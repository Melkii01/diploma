import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticlesPageComponent } from './articles-page/articles-page.component';
import { ArticlePageComponent } from './article-page/article-page.component';
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    ArticlesPageComponent,
    ArticlePageComponent
  ],
  imports: [
    CommonModule,
    ArticlesRoutingModule,
    SharedModule
  ]
})
export class ArticlesModule { }
