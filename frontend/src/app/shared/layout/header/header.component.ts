import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {UserInfoResponseType} from "../../types/user-info-response.type";
import {DefaultResponseType} from "../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {MenuItem, MessageService} from "primeng/api";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLogged: boolean = false;
  userInfo: UserInfoResponseType | null = null;
  userInfoName: string = '';
  items: MenuItem[];

  constructor(private authService: AuthService,
              public router: Router,
              private messageService: MessageService) {
    // Устанавливаем флаг авторизации
    this.isLogged = this.authService.getIsLoggedIn();

    // Если есть данные пользователя в local storage, выводим имя и записываем его данные в переменную
    const userInfo: UserInfoResponseType | null = this.authService.getUserInfoFromLocalStorage();
    if (this.isLogged && userInfo) {
      this.userInfo = userInfo;
      this.userInfoName = userInfo.name;
    }

    // Параметры меню при клике на имя пользователя
    this.items = [{
      label: 'Параметры',
      items: [
        {
          label: 'Выйти',
          icon: 'pi pi-sign-out',
          command: () => {
            this.logout();
          }
        }
      ]
    }];
  }

  ngOnInit(): void {
    // Следит за авторизацией пользователя
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;

      // Если авторизован меняем войти на имя пользователя
      if (this.isLogged) {
        this.authService.getUserInfoFromServer().subscribe({
          next: (data: DefaultResponseType | UserInfoResponseType) => {
            let error = null;

            // Если есть ошибка записываем в переменную error
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }
            const userInfoResponse: UserInfoResponseType = data as UserInfoResponseType;
            if (!userInfoResponse.id && !userInfoResponse.name && !userInfoResponse.email) {
              error = 'Ошибка получения данных о пользователе';
            }

            // Если есть ошибка выводим ошибку и останавливаем функцию
            if (error) {
              this.messageService.add({severity: 'error', summary: 'Ошибка', detail: error});
              throw new Error(error);
            }

            // Устанавливаем в переменные, а также в local storage
            this.userInfo = userInfoResponse;
            this.userInfoName = userInfoResponse.name;
            this.authService.setUserInfoToLocalStorage(userInfoResponse);

          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.message) {
              this.messageService.add({severity: 'error', summary: 'Ошибка', detail: errorResponse.error.message});
              throw new Error(errorResponse.error.message);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Ошибка',
                detail: 'Ошибка получения данных о пользователе'
              });
              throw new Error('Ошибка получения данных о пользователе');
            }
          }
        });
      }
    });
  }

  /**
   * Выход из системы
   */
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

  /**
   * Набор функций для вывода из системы
   */
  doLogout() {
    this.authService.removeTokens();
    this.authService.userId = null;
    this.authService.removeUserInfoOnLocalStorage();
    this.messageService.add({severity: 'success', summary: 'Успешно', detail: 'Вы вышли из системы'});
    this.router.navigate(['/']);
  }
}
