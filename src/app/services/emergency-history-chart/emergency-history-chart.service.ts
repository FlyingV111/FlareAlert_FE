import {effect, inject, Injectable, signal} from '@angular/core';
import {getCssVariableValue} from '../../app.module';
import {AlertService} from '../alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class EmergencyHistoryChartService {
  private alertService = inject(AlertService)
  private monthlyAlertData = signal<number[] | null>(null)
  chartOptions = signal(this.getDefaultChartOptionsEcharts());

  constructor() {
    effect(() => {
      this.monthlyAlertData = this.alertService.monthlyAlertData;
      this.chartOptions.set(this.getDefaultChartOptionsEcharts());
    });
  }

  getDefaultChartOptionsEcharts(min: number = 0, max: number = 5) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dataLength = this.monthlyAlertData()?.length;

    if ((dataLength ?? 0) > max) {
      max = (dataLength ?? max) + 2;
    }

    return {
      xAxis: {
        type: 'category',
        data: months,
      },
      yAxis: {
        type: 'value',
        min: min,
        max: max,
        axisTick: {
          alignWithLabel: true
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          margin: 20,
        }
      },
      darkMode: true,
      series: [
        {
          data: this.monthlyAlertData(),
          type: 'bar',
          smooth: true,
          itemStyle: {
            color: getCssVariableValue('--accent-color'),
          },
          symbol: 'none',
        }
      ],
      grid: {
        left: 0,
        right: 0,
        top: '2%',
        bottom: 0,
        containLabel: true
      },
      tooltip: {
        show: false,
      }
    };
  }
}
