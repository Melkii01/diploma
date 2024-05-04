import {ArticleRelatedResponseType} from "./article-related-response.type";

export type ArticlesResponseType = {
  totalCount: number;
  pages: number;
  items: ArticleRelatedResponseType[]
}
