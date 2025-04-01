import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { HealthMetric, MatricsReturn } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = `http://localhost:5000/api/metrics`;

  constructor(private http: HttpClient, private authService: AuthService) { }
  getHealthMetrics(){
    return this.http.get<MatricsReturn[]>(`${this.apiUrl}`);
  }

  createHealthMetrics(data: HealthMetric): Observable<HealthMetric>{
    return this.http.post<HealthMetric>(`${this.apiUrl}/create`, data);
  }
  updateHealthMetrics(id: string, data: {value:string}): Observable<HealthMetric>{
    return this.http.patch<HealthMetric>(`${this.apiUrl}/update/${id}`, data);
  }

  deleteHealthMetrics(id: string){
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
  
  

}
