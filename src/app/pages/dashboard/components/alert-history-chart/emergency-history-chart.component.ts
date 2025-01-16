import {Component, computed, effect, inject} from '@angular/core';
import {
  EmergencyHistoryChartService
} from '../../../../services/emergency-history-chart/emergency-history-chart.service';
import {NgxEchartsDirective, provideEchartsCore} from 'ngx-echarts';
import {echarts} from '../../../../../echartsConfig/echart-config';
import {AlertService} from '../../../../services/alert/alert.service';


@Component({
  selector: 'emergency-history-chart',
  imports: [
    NgxEchartsDirective
  ],
  templateUrl: './emergency-history-chart.component.html',
  styleUrl: './emergency-history-chart.component.css',
  providers: [
    provideEchartsCore({echarts}),

  ]
})
export class EmergencyHistoryChartComponent {
  private alertService = inject(AlertService)
  protected loading: boolean = false;
  protected chartOptions = computed(() => this.emergencyHistoryChartService.chartOptions());

  constructor(private emergencyHistoryChartService: EmergencyHistoryChartService) {
    effect(() => {
      this.chartOptions = this.emergencyHistoryChartService.chartOptions;
    });

    effect(() => {
      this.alertService.getMonthlyAmounts()
    });
  }
}
