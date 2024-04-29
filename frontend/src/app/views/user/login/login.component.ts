import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DefaultResponseType} from "../../../shared/types/default-response.type";
import {LoginResponseType} from "../../../shared/types/login-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthService} from "../../../core/auth/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i)]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  })

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private snackBar: MatSnackBar,
              private router: Router) {
  }

  ngOnInit(): void {
  }


  login() {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password,
        !!this.loginForm.value.rememberMe)
        .subscribe({
          next: (data: DefaultResponseType | LoginResponseType) => {
            let error = null;

            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }

            const loginResponse: LoginResponseType = data as LoginResponseType;
            if (!loginResponse.accessToken && !loginResponse.refreshToken
              && !loginResponse.userId) {
              error = 'Ошибка авторизации';
            }

            if (error) {
              this.snackBar.open(error);
              throw new Error(error);
            }

            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;

            this.snackBar.open('Вы успешно авторизовались');
            this.router.navigate(['/']);

          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.message) {
              this.snackBar.open(errorResponse.error.message);
            } else {
              this.snackBar.open('Ошибка авторизации');
            }
          }
        });
    }
  }


}
