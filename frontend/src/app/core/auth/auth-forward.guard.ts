import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "./auth.service";
import {Location} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class AuthForwardGuard implements CanActivate {
  constructor(private authService: AuthService,
              private location: Location) {
  }

  /**
   * Защищает от попадания в определенные страницы модуля, если пользователь не авторизован
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Если не авторизован, возвращаем в предыдущую страницу
    if (this.authService.getIsLoggedIn()) {
      this.location.back();
      return false;
    }
    return true;
  }
}
