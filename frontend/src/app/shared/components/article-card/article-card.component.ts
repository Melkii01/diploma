import {Component, Input} from '@angular/core';
import {ArticleRelatedResponseType} from "../../types/article-related-response.type";

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent {
  @Input() article!: ArticleRelatedResponseType;
  }
