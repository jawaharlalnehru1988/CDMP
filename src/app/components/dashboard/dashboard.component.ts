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

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, NgIf, MatFormFieldModule, FormsModule, MatButtonModule, MatSelectModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  userName:string = "";
  userMetrics: any = null;
  
  constructor(private dashboardService: DashboardService, private authService: AuthService, private fb: FormBuilder){}
  healthMetricsForm!: FormGroup;
  
  ngOnInit(): void {
    this.loadMetrics();
    // this.authService.userLoggedIn();
    // console.log(this.authService.decodedToken);
    const authDetails = localStorage.getItem("authToken");
    if (authDetails) {
    this.authService.decodeToken(authDetails);
    console.log('this.authService.decodeToken(authDetails) :', this.authService.decodeToken(authDetails));
    }

    this.healthMetricsForm = this.fb.group({
      type: ['', Validators.required],
      value: ['', [Validators.required, Validators.maxLength(3)]]
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

  onSubmit(): void {
    if (this.healthMetricsForm.valid) {
      console.log(this.healthMetricsForm.value);
    }
  }

}
