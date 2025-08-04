import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Patient {
  name: string;
  status: string;
  location: string;
  lastUpdate: string;
  emergencyAlerts: number;
  battery: number;
}

interface VitalSigns {
  heartRate: number;
  temperature: number;
  spO2: number;
  fallDetected: boolean;
}

interface Alert {
  time: string;
  type: string;
  status: string;
  notes: string;
}

interface HealthMetric {
  value: number;
  timestamp: Date;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Patient data
  patient: Patient = {
    name: 'John Doe',
    status: 'Active',
    location: 'GPS Pin',
    lastUpdate: '10s ago',
    emergencyAlerts: 0,
    battery: 88
  };

  // Vital signs
  vitalSigns: VitalSigns = {
    heartRate: 78,
    temperature: 36.8,
    spO2: 97,
    fallDetected: false
  };

  // Alert history
  alerts: Alert[] = [
    {
      time: '12:05 PM',
      type: 'Fall Detected',
      status: 'Resolved',
      notes: 'Auto alert'
    },
    {
      time: '09:20 AM',
      type: 'High Temp',
      status: 'Pending',
      notes: '38.5°C'
    }
  ];

  // Health metrics data
  healthMetrics: HealthMetric[] = [];
  selectedMetric: string = 'Heart Rate';
  selectedTimeRange: string = 'Last 24 Hours';

  // Navigation
  activeTab: string = 'Home';

  // Real-time updates
  private updateInterval: any;

  // Chart options
  metricOptions = ['Heart Rate', 'SpO2', 'Temperature'];
  timeRangeOptions = ['Last Hour', 'Last 24 Hours', 'Last Week', 'Last Month'];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initializeHealthMetrics();
    this.startRealTimeUpdates();
  }

  ngOnDestroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  private initializeHealthMetrics(): void {
    // Generate sample data for the last 24 hours
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      this.healthMetrics.push({
        value: this.getRandomValue(this.selectedMetric),
        timestamp: time
      });
    }
  }

  private getRandomValue(metric: string): number {
    switch (metric) {
      case 'Heart Rate':
        return Math.floor(Math.random() * 40) + 60; // 60-100 bpm
      case 'SpO2':
        return Math.floor(Math.random() * 10) + 90; // 90-100%
      case 'Temperature':
        return Math.round((Math.random() * 4 + 35) * 10) / 10; // 35-39°C
      default:
        return 0;
    }
  }

  private startRealTimeUpdates(): void {
    this.updateInterval = setInterval(() => {
      // Update last update time
      this.patient.lastUpdate = '10s ago';
      
      // Simulate vital signs changes
      this.vitalSigns.heartRate = Math.floor(Math.random() * 40) + 60;
      this.vitalSigns.temperature = Math.round((Math.random() * 4 + 35) * 10) / 10;
      this.vitalSigns.spO2 = Math.floor(Math.random() * 10) + 90;
      
      // Update battery (slowly decrease)
      if (this.patient.battery > 0) {
        this.patient.battery = Math.max(0, this.patient.battery - 0.01);
      }
    }, 10000); // Update every 10 seconds
  }

  onMetricChange(metric: string): void {
    this.selectedMetric = metric;
    this.initializeHealthMetrics();
  }

  onTimeRangeChange(timeRange: string): void {
    this.selectedTimeRange = timeRange;
    this.initializeHealthMetrics();
  }

  onTabClick(tab: string): void {
    this.activeTab = tab;
  }

  onLogout(): void {
    this.router.navigate(['/login']);
  }

  getMetricUnit(metric: string): string {
    switch (metric) {
      case 'Heart Rate':
        return 'bpm';
      case 'SpO2':
        return '%';
      case 'Temperature':
        return '°C';
      default:
        return '';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Resolved':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Critical':
        return 'danger';
      default:
        return 'info';
    }
  }

  getAlertIcon(type: string): string {
    switch (type) {
      case 'Fall Detected':
        return '🫀';
      case 'High Temp':
        return '🌡️';
      case 'Low SpO2':
        return '💧';
      default:
        return '⚠️';
    }
  }
}
