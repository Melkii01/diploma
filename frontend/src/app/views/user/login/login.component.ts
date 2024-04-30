import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {DefaultResponseType} from "../../../shared/types/default-response.type";
import {LoginResponseType} from "../../../shared/types/login-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../../../core/auth/auth.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i)]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  })

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private messageService: MessageService) {
  }

  /**
   * Отправка запроса на авторизацию
   */
  login() {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password,
        !!this.loginForm.value.rememberMe)
        .subscribe({
          next: (data: DefaultResponseType | LoginResponseType) => {
            let error = null;

            // Если есть ошибка записываем в переменную error
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }
            const loginResponse: LoginResponseType = data as LoginResponseType;
            if (!loginResponse.accessToken && !loginResponse.refreshToken
              && !loginResponse.userId) {
              error = 'Ошибка авторизации';
            }

            // Если есть ошибка выводим ошибку и останавливаем функцию
            if (error) {
              this.messageService.add({severity: 'error', summary: 'Ошибка', detail: error});
              throw new Error(error);
            }

            // Устанавливаем токены и id пользователя в local storage
            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;

            // Выводим успешное сообщение и перенаправляем на главную страницу
            this.messageService.add({severity: 'success', summary: 'Успешно', detail: 'Вы успешно авторизовались'});
            this.router.navigate(['/']);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.message) {
              this.messageService.add({severity: 'error', summary: 'Ошибка', detail: errorResponse.error.message});
              throw new Error(errorResponse.error.message);
            } else {
              this.messageService.add({severity: 'error', summary: 'Ошибка', detail: 'Ошибка авторизации'});
              throw new Error('Ошибка авторизации');
            }
          }
        });
    }
  }
}
