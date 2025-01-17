import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {MonthlyAmountResponse} from '../../models/MonthlyAmountResponse';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private http = inject(HttpClient)
  private backendUrl = environment.backendUrl
  monthlyAlertData = signal<number[] | null>(null)

  getMonthlyAmounts() {
    this.http.get<MonthlyAmountResponse>(`${this.backendUrl}/alert/monthlyAmount`).subscribe({
      next: (response) => {
        this.monthlyAlertData.set(response.monthData);
      },
      error: (error) => {
        console.error(error)
        this.monthlyAlertData.set(null);
      }
    })
  }
}
