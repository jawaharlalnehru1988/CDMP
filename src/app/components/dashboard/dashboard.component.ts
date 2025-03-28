import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  userName:string = "";
  userMetrics: any = null;

  constructor(private dashboardService: DashboardService, private authService: AuthService){}
  ngOnInit(): void {
    this.loadMetrics();
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
}
