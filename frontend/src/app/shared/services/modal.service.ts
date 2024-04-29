import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  isShowed$ = new Subject<boolean>();
  title$ = new Subject<string>();
  service$ = new Subject<string>();


  show(title: string, service: string = '') {
    this.isShowed$.next(true);
    this.title$.next(title);
    this.service$.next(service);
  }

  hide() {
    this.isShowed$.next(false);
  }
}
