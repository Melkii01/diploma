import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'textLength'
})
export class TextLengthPipe implements PipeTransform {
  /**
   * Преобразовать текст
   * @param text текст
   * @param textLength максимальное количество симовлов
   */
  transform(text: string, textLength: number): string {
    let result: string = '';
    if (text.length <= textLength) {
      result = text;
    } else if (text.length > textLength) {
      result = text.slice(0, textLength) + '...';
    }
    return result;
  }
}
