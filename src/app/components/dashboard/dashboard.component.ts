import { NgIf } from '@angular/common';
import { Component, effect } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';
import { DashboardService } from '../../services/dashboard.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, NgIf, MatFormFieldModule, FormsModule, MatButtonModule, MatSelectModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  userName:string = "";
  userMetrics: any = null;
  userData: any;
  
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
        this.userMetrics = data;
        console.log(this.userMetrics);
      },
      error: (error) => {
        console.error('Error loading metrics:', error);
      }
    });
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
     const formData = {...this.healthMetricsForm.value, userId: this.userData.id};
     this.createdMetric$ = this.dashboardService.createHealthMetrics(formData).subscribe();
    }
  }

}
