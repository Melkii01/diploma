import {CommentType} from "./comment.type";

export type ArticleResponseType = {
  text: string,
  comments: CommentType[],
  commentsCount: number,
  id: string,
  title: string,
  description: string,
  date: string,
  category: string,
  url: string
}
