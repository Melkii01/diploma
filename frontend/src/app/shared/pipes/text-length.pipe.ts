import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'textLength'
})
export class TextLengthPipe implements PipeTransform {
  /**
   * Преобразовать текст
   * @param text текст
   */
  transform(text: string): string {
    let result: string = '';
    if (text.length <= 200) {
      result = text;
    } else if (text.length > 200) {
      result = text.slice(0, 200) + '...';
    }
    return result;
  }
}

@Pipe({
  name: 'titleLength'
})

export class TitleLengthPipe implements PipeTransform {
  /**
   * Преобразовать оглавление
   * @param text текст
   */
  transform(text: string): string {
    let result: string = '';
    if (text.length <= 80) {
      result = text;
    } else if (text.length > 80) {
      result = text.slice(0, 80) + '...';
    }
    return result;
  }
}
