import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {LucideAngularModule} from 'lucide-angular';
import {Webhook} from '../../models/Webhook';
import {ConnectionService} from '../../services/connection-service/connection.service';
import {NgClass, NgIf} from '@angular/common';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfirmDialogComponent} from '../../shared/ConfirmDialog/ConfirmDialog.component';

@Component({
  selector: 'app-connections',
  imports: [
    LucideAngularModule,
    NgIf,
    NgClass
  ],
  templateUrl: './connections.component.html',
  styleUrl: './connections.component.css'
})
export class ConnectionsComponent implements OnInit {
  protected copiedUrl: boolean = false;
  protected copiedAuth: boolean = false;
  protected connectionService = inject(ConnectionService);
  protected webhook = signal<Webhook | null>(null)
  loadingWebhook = signal<boolean>(false);
  loadingApiKey = signal<boolean>(false);
  loadingWebhookUrl = signal<boolean>(false);

  constructor(private modalService: NgbModal) {
    effect(() => {
      this.webhook = this.connectionService.webhook
    });
    effect(() => {
      this.loadingWebhook = this.connectionService.loadingWebhook;
    });
    effect(() => {
      this.loadingApiKey = this.connectionService.loadingApiKey;
    });
    effect(() => {
      this.loadingWebhookUrl = this.connectionService.loadingWebhookUrl;
    });
  }

  ngOnInit(): void {
    this.connectionService.getWebhookUrl();
  }

  get isWebhookEnabled(): boolean {
    return this.webhook() ? this.webhook()?.webhookEnabled ?? false : false;
  }

  toggleWebhook() {
    const currentWebhook = this.webhook();
    if (currentWebhook) {
      const currentStatus = currentWebhook.webhookEnabled;
      this.connectionService.updateWebhookEnabled(!currentStatus);
    }
  }

  copyWebhookUrl(value?: string) {
    navigator.clipboard.writeText(value ?? '').then(() => {
      this.copiedUrl = true;
      setTimeout(() => {
        this.copiedUrl = false;
      }, 3000);
    });
  }

  copyApiKey(value?: string) {
    navigator.clipboard.writeText(value ?? '').then(() => {
      this.copiedAuth = true;
      setTimeout(() => {
        this.copiedAuth = false;
      }, 3000);
    });
  }

  generateWebhookUrl() {
    const modalRef = this.modalService.open(ConfirmDialogComponent,
      {
        backdrop: 'static',
        centered: true,
        keyboard: false
      });
    modalRef.componentInstance.config = {
      title: 'Generate new Webhook URL',
      message: 'Are you sure you want to generate a new webhook URL?',
      confirmText: 'Generate',
      cancelText: 'Cancel',
    };

    modalRef.result.then(
      (result) => {
        if (result) {
          this.connectionService.generateWebhookUrl();
        }
      }
    );
  }

  generateApiKey() {
    const modalRef = this.modalService.open(ConfirmDialogComponent,
      {
        backdrop: 'static',
        centered: true,
        keyboard: false
      });
    modalRef.componentInstance.config = {
      title: 'Generate new Webhook Authentication Key',
      message: 'Are you sure you want to generate a new webhook Webhook Key?',
      confirmText: 'Generate',
      cancelText: 'Cancel',
    };

    modalRef.result.then(
      (result) => {
        if (result) {
          this.connectionService.generateApiKey();
        }
      }
    );
  }
}
