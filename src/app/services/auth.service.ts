import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
// import jwt_decode from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserReturn } from './interfaces';
// import * as jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  jwtHelper = new JwtHelperService();
  private apiUrl = 'http://localhost:5000/api/auth';
  private token: string = "authToken";
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  decodedToken: UserReturn | null = {
    id: '',
    role: '',
    username: '',
    iat: 0,
    exp: 0
  };

  constructor(private http: HttpClient, private router: Router) { }
  private hasToken(): boolean {
    return !!localStorage.getItem(this.token);
  }

  register(userData:{
    username: string
    email: string
    password: string
  }):Observable<any>{
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials:{email:string, password:string}):Observable<any>{
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response:any)=>{
        localStorage.setItem(this.token, response.token);
        this.isAuthenticatedSubject.next(true);
        this.decodeToken(response.token);
        this.router.navigate(['/dashboard']);
      })
    );
  }

  getAllUsers():Observable<any>{
    return this.http.get(`${this.apiUrl}/alluser`);
  }
  getUserById(id:string):Observable<any>{
    return this.http.get(`${this.apiUrl}/profile/${id}`);
  }
  updateUser(id:string, userData:any):Observable<any>{
    return this.http.put(`${this.apiUrl}/update/${id}`, userData);
  }
  deleteUser(id:string):Observable<any>{
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

 
  
  decodeToken(token: string): UserReturn | null {
      return this.jwtHelper.decodeToken(token);
  }


  logout(){
    localStorage.removeItem(this.token);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth']);
  }

  getToken():string | null{
    return localStorage.getItem(this.token);
  }

}


