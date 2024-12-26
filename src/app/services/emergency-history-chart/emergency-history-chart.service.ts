import {Injectable, signal} from '@angular/core';
import {getCssVariableValue} from '../../app.module';

@Injectable({
  providedIn: 'root'
})
export class EmergencyHistoryChartService {
  constructor() {}

  chartOptions = signal(this.getDefaultChartOptionsEcharts());

  getDefaultChartOptionsEcharts(min: number = 0, max: number = 5) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

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
          data: [],
          type: 'line',
          smooth: true,
          lineStyle: {
            color: getCssVariableValue('--accent-color'),
            width: 3
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
