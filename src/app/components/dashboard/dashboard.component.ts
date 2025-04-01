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
import { SeparateTextPipe } from '../../Shared/separate-text.pipe';
import {MatToolbarModule} from '@angular/material/toolbar';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';




@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule,  SeparateTextPipe, BaseChartDirective, MatToolbarModule, DatePipe, MatIconModule, MatFormFieldModule, FormsModule, MatButtonModule, MatSelectModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  userName:string = "";
  userMetrics: GroupedMetric[] = [];
  userData: UserReturn | null = null;
  separateText = new SeparateTextPipe();
  chartType: ChartType = 'doughnut'; // Chart type (bar, line, pie, radar, polarArea, doughnut)

  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        data: [10, 20, 30, 40, 50],
        label: 'Sales',
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };
  hideChart: boolean = false;
  
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
      console.log('data :', data);
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
  showChart(metric: { matchedDatas: any[]; type: any; }){
    console.log('metric :', metric);
    this.hideChart = !this.hideChart;
    const datePipe = new DatePipe('en-US');
    this.chartData = {
      labels: metric.matchedDatas.map((item: { updatedAt: any; }) => 
      datePipe.transform(item.updatedAt, 'dd/MMM/yyyy') || ''
      ),
      datasets: [
      {
        label: metric.type,
        data: metric.matchedDatas.map((item: { value: any; }) => item.value),
        backgroundColor: 'rgba(26, 204, 97, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
      ]
    };
    this.chartType = 'bar'; // Change to the desired chart type (e.g., 'bar', 'line', etc.)

  }
  updateValue(itemValue:string, itemid: string){
    const updatedValue = { value: itemValue };
    this.dashboardService.updateHealthMetrics(itemid, updatedValue).subscribe({
      next:(res)=>{
        alert('Health Metric Updated Successfully!');
        this.getHealthMetrics();
      },
      error:(err)=>{
        console.log('err :', err);
      alert('Error updating metric value');
      }
    })
  };
  deleteValue(itemid: string){
  this.dashboardService.deleteHealthMetrics(itemid).subscribe({
    next:(res)=>{
      console.log('res :', res);
      this.getHealthMetrics();
    },
    error:(err)=>{
      console.log('err :', err);
    }
  })
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
     this.createdMetric$ = this.dashboardService.createHealthMetrics(formData).subscribe({
      next: (res) => {
        console.log('res :', res);
        this.healthMetricsForm.reset();
        this.getHealthMetrics();
        alert('Health Metric Created Successfully!');
      },
      error: (err) => {
        console.log('err :', err);
      }
     });
    }
  }

}
