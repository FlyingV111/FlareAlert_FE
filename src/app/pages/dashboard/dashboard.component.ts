import {Component} from '@angular/core';
import {EmergencyHistoryChartComponent} from './components/alert-history-chart/emergency-history-chart.component';
import {CurrentAlertComponent} from './components/current-alert/current-alert.component';
import {RecentActivityComponent} from './components/recent-activity/recent-activity.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [
    EmergencyHistoryChartComponent,
    CurrentAlertComponent,
    RecentActivityComponent,
    NgIf
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent{

}
