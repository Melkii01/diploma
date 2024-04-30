import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  isShowed$ = new Subject<boolean>();

  /**
   * Устанавливает флаг показать загрузчик
   */
  show() {
    this.isShowed$.next(true);
  }

  /**
   * Устанавливает флаг скрыть загрузчик
   */
  hide() {
    setTimeout(()=>{
      this.isShowed$.next(false);
    },400);
  }
}
