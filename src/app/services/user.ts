import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Auth } from './auth';

interface UserRegisterPayload {
  name: string,
  email: string,
  password: string,
  address?: [
    {
      street: string,
      number: number,
      complement: string,
      city: string,
      state: string,
      zipCode: string
    }
  ],
  phone?: [
    {
      number: string,
      ddd: string
    }
  ];
}

export interface UserLoginPayload {

  email: string,
  password: string,

}

export interface UserResponse {
  name: string,
  email: string,
  address: [
    {
      street: string,
      number: number,
      complement: string,
      city: string,
      state: string,
      zipCode: string
    }
  ] | null;
  phone: [
    {
      number: string,
      ddd: string
    }
  ] | null;

}

@Injectable({
  providedIn: 'root',
})

export class User {

  private apiUrl = 'http://localhost:8083';

  private jwtHelper = new JwtHelperService;

  user = signal<UserResponse | null>(null)

  constructor(private http: HttpClient, private authService: Auth) {
    const usuarioSalvo = this.authService.getUser();
    if (usuarioSalvo) {
      this.user.set(usuarioSalvo)
    }
  }

  register(body: UserRegisterPayload): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/usuario`, body)
  }

  login(body: UserLoginPayload): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/usuario/login`, body, { responseType: 'text' as 'json' })
  }

  getUserByEmail(token: string): Observable<UserResponse> {
    const email = this.getEmailFromToken(token)
    if (!email) throw new Error('Token Invalid!')
    const headers = new HttpHeaders({ Authorization: `${token}` })
    return this.http.get<UserResponse>(`${this.apiUrl}/usuario?email=${email}`, { headers }).pipe(
      tap(user => this.user.set(user))
    )
  }

  getEmailFromToken(token: string): string | null {
    try {
      const decoded = this.jwtHelper.decodeToken(token);
      return decoded?.sub || null
    } catch (error) {
      return null;
    }
  }

  getUser(): UserResponse | null {
    return this.user();
  }
}
