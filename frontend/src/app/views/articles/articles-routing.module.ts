import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ArticlesPageComponent} from "./articles-page/articles-page.component";
import {ArticlePageComponent} from "./article-page/article-page.component";

const routes: Routes = [

  {path: 'articles', component: ArticlesPageComponent},
  {path: 'article', component: ArticlePageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule {
}
