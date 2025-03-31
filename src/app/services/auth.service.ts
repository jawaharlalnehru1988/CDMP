import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
// import jwt_decode from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SuccessLogin, User, UserReturn } from './interfaces';
// import * as jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  jwtHelper = new JwtHelperService();
  private apiUrl = 'http://localhost:5000/api/auth';
  private token: string = "authToken";
  isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  decodedToken: UserReturn | null = {
    id: '',
    role: '',
    username: '',
    iat: 0,
    exp: 0
  };

  constructor(private http: HttpClient, private router: Router) { }

  public takeToken():string{
    return this.token;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.token);
  }

  register(userData:User){
    return this.http.post<User>(`${this.apiUrl}/register`, userData);
  }

  login(credentials: Omit<User, "username">){
    return this.http.post<SuccessLogin>(`${this.apiUrl}/login`, credentials);
  }

  // getAllUsers():Observable<any>{
  //   return this.http.get(`${this.apiUrl}/alluser`);
  // }
  // getUserById(id:string):Observable<any>{
  //   return this.http.get(`${this.apiUrl}/profile/${id}`);
  // }

  // updateUser(id:string, userData:any):Observable<any>{
  //   return this.http.put(`${this.apiUrl}/update/${id}`, userData);
  // }

  // deleteUser(id:string):Observable<any>{
  //   return this.http.delete(`${this.apiUrl}/delete/${id}`);
  // }

 
  
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


