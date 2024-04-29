import {Component, Input, OnInit} from '@angular/core';
import {PopularArticlesResponseType} from "../../types/popular-articles-response.type";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent implements OnInit {
  @Input() article!: PopularArticlesResponseType;
  constructor() {
  }

  ngOnInit(): void {
  }

}
