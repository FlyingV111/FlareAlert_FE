import {CommonModule, DatePipe} from '@angular/common';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {AppComponent} from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import {
  Bell,
  BellRing,
  Cable,
  Clock,
  Copy,
  Eye,
  EyeOff,
  Home,
  ImageUp,
  Key,
  KeySquare,
  LucideAngularModule,
  Mail,
  MapPin,
  MessageSquareWarning, Plus,
  RefreshCcw, Save, Trash2,
  TriangleAlert,
  User,
  Users, X
} from 'lucide-angular';
import {RouterOutlet} from '@angular/router';
import {AppRoutingModule} from './app.routes';
import {SideNavComponent} from './shared/navigation/side-nav/side-nav.component';
import {TopNavComponent} from './shared/navigation/top-nav/top-nav.component';
import {NgxEchartsModule} from 'ngx-echarts';
import * as echarts from 'echarts/core';
import {BarChart} from 'echarts/charts';
import {GridComponent} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CookieService} from 'ngx-cookie-service';
import {AuthInterceptor} from './services/auth/authInterceptor/authInterceptor';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

echarts.use([BarChart, GridComponent, CanvasRenderer]);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    LucideAngularModule.pick({
      TriangleAlert, ImageUp, User, Eye, EyeOff, RefreshCcw,
      Bell, Home, MessageSquareWarning, MapPin, Key, Copy, Plus,
      Clock, Users, BellRing, Mail, KeySquare, Cable, Save, X, Trash2
    }),
    NgxEchartsModule,
    RouterOutlet,
    SideNavComponent,
    TopNavComponent,
    NgxEchartsModule.forRoot({echarts}),
    NgbModule,
  ],
  providers: [
    DatePipe,
    CookieService,
    provideHttpClient(
      withFetch(),
      withInterceptors([AuthInterceptor])
    ),
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function getCssVariableValue(variable: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}


export function convertTimeToUnixTimestamp(time: string | number): number | null {
  if (typeof time === 'number') {
    return time;
  }

  if (!time) return null;

  const [hours, minutes] = time.split(':').map(num => parseInt(num, 10));
  const today = new Date();
  today.setHours(hours, minutes, 0, 0);
  return today.getTime() / 1000;
}


export function convertUnixToTime(unixTimestamp: number | null): string {
  if (!unixTimestamp) return '';
  const date = new Date(unixTimestamp * 1000);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}


export function convertUnixToDate(timestamp: number | null): string {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}
