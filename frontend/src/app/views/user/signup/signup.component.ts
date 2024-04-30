import {Component} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {DefaultResponseType} from "../../../shared/types/default-response.type";
import {LoginResponseType} from "../../../shared/types/login-response.type";
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/([А-ЯЁ][а-яё]+[\-\s]?)/)]],
    email: ['', [Validators.required, Validators.pattern(/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i)]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-z]{8,}$/)]],
    agree: [false, [Validators.requiredTrue]],
  })

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private messageService: MessageService,
              private router: Router) {
  }

  /**
   * Отправка запроса на регистрацию
   */
  signup() {
    if (this.signupForm.valid && this.signupForm.value.name
      && this.signupForm.value.email && this.signupForm.value.password) {
      this.authService.signup(this.signupForm.value.name, this.signupForm.value.email,
        this.signupForm.value.password)
        .subscribe({
          next: (data: DefaultResponseType | LoginResponseType) => {
            let error = null;

            // Если есть ошибка записываем в переменную error
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }
            const loginResponse = data as LoginResponseType;
            if (!loginResponse.accessToken && !loginResponse.refreshToken
              && !loginResponse.userId) {
              error = 'Ошибка регистрации';
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
            this.messageService.add({severity: 'success', summary: 'Успешно', detail: 'Вы успешно зарегистрировались'});
            this.router.navigate(['/']);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.message) {
              this.messageService.add({severity: 'error', summary: 'Ошибка', detail: errorResponse.error.message});
              throw new Error(errorResponse.error.message);
            } else {
              this.messageService.add({severity: 'error', summary: 'Ошибка', detail: 'Ошибка регистрации'});
              throw new Error(errorResponse.error.message);
            }
          }
        })
    }
  }
}
