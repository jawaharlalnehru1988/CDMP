import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private token: string = "authToken";
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }
  private hasToken(): boolean {
    return !!localStorage.getItem(this.token);
  }

  register(userData:any):Observable<any>{
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials:{email:string, password:string}):Observable<any>{
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response:any)=>{
        localStorage.setItem(this.token, response.token);
        this.isAuthenticatedSubject.next(true);
        this.router.navigate(['/dashboard']);
      })
    );
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
