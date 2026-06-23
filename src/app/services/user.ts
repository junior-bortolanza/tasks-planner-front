import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

interface UserRegisterResponse {
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

  constructor(private http: HttpClient) { }

  register(body: UserRegisterPayload): Observable<UserRegisterResponse> {
    return this.http.post<UserRegisterResponse>(`${this.apiUrl}/usuario`, body)
  }

  login(body: UserLoginPayload): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/usuario/login`, body, { responseType: 'text' as 'json' })
  }
}
