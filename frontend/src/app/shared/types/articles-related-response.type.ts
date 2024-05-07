import {ArticleRelatedResponseType} from "./article-related-response.type";

export type ArticlesRelatedResponseType = {
  totalCount: number,
  pages: number,
  items: ArticleRelatedResponseType[]
}
