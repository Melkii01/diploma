import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {UserInfoResponseType} from "../../../../types/user-info-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {LoginResponseType} from "../../../../types/login-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLogged: boolean = false;
  userInfo: UserInfoResponseType | null = null;
  userInfoName: string = '';

  constructor(private authService: AuthService,
              private _snackBar: MatSnackBar,
              public router: Router) {
    // Устанавливаем флаг авторизации
    this.isLogged = this.authService.getIsLoggedIn();

    // Если есть данные пользователя в local storage, устанавливаем
    const userInfo: UserInfoResponseType | null = this.authService.getUserInfoFromLocalStorage();
    if (userInfo) {
      this.userInfo = userInfo;
      this.userInfoName = userInfo.name;
    }
  }

  ngOnInit(): void {
    // Следим за авторизацией пользователя
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;

      // Если авторизован меняем войти на имя
      if (this.isLogged) {
        this.authService.getUserInfoFromServer().subscribe({
          next: (data: DefaultResponseType | UserInfoResponseType) => {
            let error = null;

            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }

            const userInfoResponse: UserInfoResponseType = data as UserInfoResponseType;
            if (!userInfoResponse.id && !userInfoResponse.name && !userInfoResponse.email) {
              error = 'Ошибка получения данных о пользователе';
            }

            if (error) {
              throw new Error(error);
            }

            // Устанавливаем в переменные, а также в local storage
            this.userInfo = userInfoResponse;
            this.userInfoName = userInfoResponse.name;
            this.authService.setUserInfoToLocalStorage(userInfoResponse);

          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.message) {
              throw new Error(errorResponse.error.message);
            } else {
              throw new Error('Ошибка получения данных о пользователе');
            }
          }
        });
      }
    });
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout();
        },
        error: () => {
          this.doLogout();
        }
      });
  }

  doLogout() {
    this.authService.removeTokens();
    this.authService.userId = null;
    this.authService.removeUserInfoOnLocalStorage();
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }

}
