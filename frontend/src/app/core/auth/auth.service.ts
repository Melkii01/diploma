import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {LoginResponseType} from "../../shared/types/login-response.type";
import {DefaultResponseType} from "../../shared/types/default-response.type";
import {UserInfoResponseType} from "../../shared/types/user-info-response.type";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public accessTokenKey: string = 'accessToken';
  public refreshTokenKey: string = 'refreshToken';
  public userIdKey: string = 'userId';
  public userInfo: string = 'userInfo';

  // Флаги нахождения пользователя в системе
  public isLogged$: Subject<boolean> = new Subject<boolean>();
  private isLogged: boolean = false;

  constructor(private http: HttpClient) {
    // Если страница открыта вновь, или перезагружена, проверяем записан ли токен до этого
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }

  // Узнаем в системе ли пользователь
  public getIsLoggedIn() {
    return this.isLogged;
  }

  // Установить токены и флаг в системе
  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  // Взять токены
  public getTokens(): { accessToken: string | null, refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey)
    }
  }

  // Удалить токены
  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  }

  // Получить id пользователя
  get userId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  // Установить инфо о пользователе
  set userId(id: string | null) {
    if (id) {
      localStorage.setItem(this.userIdKey, id);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }

  // Получить инфо о пользователе с сервера
  getUserInfoFromServer(): Observable<DefaultResponseType | UserInfoResponseType> {
    return this.http.get<DefaultResponseType | UserInfoResponseType>(environment.api + 'users');
  }

  getUserInfoFromLocalStorage(): UserInfoResponseType | null {
    const userInfo: string | null = localStorage.getItem(this.userInfo);
    if (userInfo) {
      return JSON.parse(userInfo);
    }
    return null;
  }

  setUserInfoToLocalStorage(info: UserInfoResponseType): void {
    localStorage.setItem(this.userInfo, JSON.stringify(info));
  }

  removeUserInfoOnLocalStorage(): void {
    localStorage.removeItem(this.userInfo);
  }


  // Зарегистрироваться
  signup(name: string, email: string, password: string): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'signup', {
      name,
      email,
      password
    })
  }

  // Авторизоваться
  login(email: string, password: string, rememberMe: boolean): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'login', {
      email,
      password,
      rememberMe
    })
  }

  // Выход из системы
  logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {
        refreshToken: tokens.refreshToken
      })
    }
    throw throwError(() => 'Can not find token');
  }

  // Обновить токены
  refresh(): Observable<LoginResponseType | DefaultResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken
    ) {
      return this.http.post <LoginResponseType | DefaultResponseType>(environment.api + 'refresh', {
        refreshToken: tokens.refreshToken
      })
    }

    throw throwError(() => 'Can not use token');
  }
}
