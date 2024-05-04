import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommentType} from "../../types/comment.type";
import {CommentActionEnum} from "../../types/comment-action.enum";
import {CommentActionsType} from "../../types/comment-actions.type";

@Component({
  selector: 'app-article-comment',
  templateUrl: './article-comment.component.html',
  styleUrls: ['./article-comment.component.scss']
})
export class ArticleCommentComponent {
  @Input() comment: CommentType = {} as CommentType;
  commentActionEnum = CommentActionEnum;
  @Output() action: EventEmitter<CommentActionsType> = new EventEmitter<CommentActionsType>();

  applyActionToComment(action: string) {
    this.action.emit({comment: this.comment.id, action});
  }
}
