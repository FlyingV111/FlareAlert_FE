import {inject, Injectable, OnInit, signal} from '@angular/core';
import {environment} from '../../../environments/environment';
import {AuthService} from '../auth/authService/auth.service';
import {UserService} from '../user-service/user.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private backendUrl = environment.backendAuthUrl
  private userService = inject(UserService)
  private originalTitle = "FlareAlert";
  private readonly linkElement: HTMLLinkElement | null;
  private readonly alertIconLink: string = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZjAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS10cmlhbmdsZS1hbGVydCI+PHBhdGggZD0ibTIxLjczIDE4LTgtMTRhMiAyIDAgMCAwLTMuNDggMGwtOCAxNEEyIDIgMCAwIDAgNCAyMWgxNmEyIDIgMCAwIDAgMS43My0zIi8+PHBhdGggZD0iTTEyIDl2NCIvPjxwYXRoIGQ9Ik0xMiAxN2guMDEiLz48L3N2Zz4=";
  private blinkInterval: number | null = null;
  private alertSound: HTMLAudioElement;
  runningAlert = signal<boolean>(false);

  constructor() {
    this.linkElement = document.querySelector('link[rel="icon"]');
    this.requestNotificationPermission();
    this.alertSound = new Audio('assets/sounds/feuerwehreinsatz_2.mp3');
    this.alertSound.volume = 1;
    this.alertSound.loop = true;
    this.alertSound.preload = 'auto';
  }

  connect() {
    const user = this.userService.user();
    if (!user)
      return;
    const eventSource = new EventSource(this.backendUrl + '/alert/stream/' + user.id,);

    eventSource.onopen = function (event) {
      console.log('Connection opened');
    };

    eventSource.onmessage = (event) => {
      console.log("Event:", event);
      this.startAlert()
    }

    eventSource.onerror = function (error) {
      console.error('Error occurred: ', error);
    };
  }

  startAlert() {
    const alertRoot = document.getElementById('alert-root');
    if (alertRoot) {
      alertRoot.classList.add('show-alert');
    }

    this.blinkInterval = window.setInterval(() => {
      document.title = (document.title === this.originalTitle) ? "Alert!" : this.originalTitle;
    }, 1000);

    this.sendDesktopNotification(
      'Alert!',
      'A Alert has been triggered and is currently active',
    );
    this.playAlertSound();
    this.switchIcon(this.alertIconLink);

    setTimeout(() => {
      if (this.blinkInterval)
        clearInterval(this.blinkInterval);
      this.stopAlert();
    }, 600000);

    this.runningAlert.set(true)
  }

  stopAlert() {
    const alertRoot = document.getElementById('alert-root');
    if (alertRoot) {
      alertRoot.classList.remove('show-alert');
    }
    if (this.blinkInterval)
      clearInterval(this.blinkInterval);
    this.switchIcon('public/favicon.ico', 'image/x-icon');
    document.title = this.originalTitle;
    this.stopAlertSound();
    this.runningAlert.set(false)
  }

  private requestNotificationPermission(): void {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(() => {
      });
    }
  }

  private sendDesktopNotification(title: string, body: string, icon: string = 'assets/icons/triangle-alert.svg'): void {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: body,
        icon: icon,
        tag: 'fire-alert',
      });

      notification.onclick = () => {
        window.focus();
      };

      this.playAlertSound()
    }
  }

  private switchIcon(iconUrl: string, type: string = 'image/svg+xml'): void {
    if (this.linkElement) {
      this.linkElement.href = iconUrl;
    } else {
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = type;
      link.href = iconUrl;
      document.head.appendChild(link);
    }
  }

  private playAlertSound(): void {
    this.alertSound.play().catch((err) => {
      console.error('Error playing alert sound', err);
    });
  }

  private stopAlertSound(): void {
    this.alertSound.pause();
    this.alertSound.currentTime = 0;
  }
}
