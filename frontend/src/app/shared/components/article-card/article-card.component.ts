import {Component, Input} from '@angular/core';
import {ArticlesResponseType} from "../../types/articles-response.type";

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent {
  @Input() article!: ArticlesResponseType;
  }
