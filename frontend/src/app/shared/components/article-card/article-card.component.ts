import {Component, Input} from '@angular/core';
import {PopularArticlesResponseType} from "../../types/popular-articles-response.type";

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent {
  @Input() article!: PopularArticlesResponseType;
  }
