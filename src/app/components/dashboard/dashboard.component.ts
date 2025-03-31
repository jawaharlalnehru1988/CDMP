import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';
import { DashboardService } from '../../services/dashboard.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { GroupedMetric, MatricsReturn, UserReturn } from '../../services/interfaces';
import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, DatePipe, MatIconModule, MatFormFieldModule, FormsModule, MatButtonModule, MatSelectModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  userName:string = "";
  userMetrics: GroupedMetric[] = [];
  userData: UserReturn | null = null;
  
  constructor(private dashboardService: DashboardService, private authService: AuthService, private fb: FormBuilder){}
  healthMetricsForm!: FormGroup;
  subscription: Subscription | undefined;
  
  ngOnInit(): void {
    const authDetails = localStorage.getItem("authToken");
    if (authDetails) {
    this.authService.decodeToken(authDetails);
    this.userData = this.authService.decodeToken(authDetails);
    }

    this.healthMetricsForm = this.fb.group({
      type: ['', Validators.required],
      value: ['', [Validators.required, Validators.maxLength(3)]]
    });
    this.getHealthMetrics();
  }

  getHealthMetrics(){
    this.dashboardService.getHealthMetrics().subscribe({
      next: (data) => {
        this.userMetrics = this.groupMetricsByType(data);
      },
      error: (error) => {
        console.error('Error loading metrics:', error);
      }
    });
  }

  groupMetricsByType(metricsArray: MatricsReturn[]): GroupedMetric[] {
    const groupedMetrics: { [key: string]: MatricsReturn[] } = {};
  
    metricsArray.forEach(metric => {
      const type = metric.type;
  
      if (!groupedMetrics[type]) {
        groupedMetrics[type] = [];
      }
  
      groupedMetrics[type].push(metric);
    });
  
    const result: GroupedMetric[] = Object.keys(groupedMetrics).map(type => ({
      type: type,
      matchedDatas: groupedMetrics[type]
    }));
  
    return result;
  }

  updateValue(itemValue:string, itemid: string){
  const payload = {itemid, itemValue}
  console.log('payload :', payload);
  this.dashboardService.updateHealthMetrics(itemid, parseInt(itemValue)).subscribe({
    next:(res)=>{
    console.log('res :', res);
    },
    error:(err)=>{
    console.log('err :', err);
    }
  })
  }
  deleteValue(itemid: string){
  console.log('itemid :', itemid);
  }

  loadMetrics(){
    this.dashboardService.getHealthMetrics().subscribe({
      next: (data) => {
        this.userMetrics = data;
        this.userName = data.username || 'User';
    },
  error: (error) => {
    console.error('Error loading metrics:', error);
  }
  });
  }

  logout(){
    this.authService.logout();
  }

  createdMetric$!: Subscription;
  onSubmit(): void {
    if (this.healthMetricsForm.valid) {
     const formData = {...this.healthMetricsForm.value, userId: this.userData?.id};
     this.createdMetric$ = this.dashboardService.createHealthMetrics(formData).subscribe();
    }
  }

}
