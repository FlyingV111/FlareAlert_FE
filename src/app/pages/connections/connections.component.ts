import {Component, computed, effect, inject, signal} from '@angular/core';
import {LucideAngularModule} from 'lucide-angular';
import {Webhook} from '../../models/Webhook';
import {ConnectionService} from '../../services/connection-service/connection.service';
import {User} from '../../models/User';
import {UserService} from '../../services/user-service/user.service';
import {NgIf} from '@angular/common';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  ConfirmationDialogConfig,
  ConfirmDialogComponent
} from '../../shared/ConfirmDialog/ConfirmDialog.component';

@Component({
  selector: 'app-connections',
  imports: [
    LucideAngularModule,
    NgIf
  ],
  templateUrl: './connections.component.html',
  styleUrl: './connections.component.css'
})
export class ConnectionsComponent {
  private userService = inject(UserService);
  protected connectionService = inject(ConnectionService);
  protected webhook = signal<Webhook | null>(null)
  protected user = signal<User | null>(null)
  loadingWebhook = signal<boolean>(false);
  loadingApiKey = signal<boolean>(false);
  loadingWebhookUrl = signal<boolean>(false);

  constructor(private modalService: NgbModal) {
    effect(() => {
      this.user = this.userService.user;
      if (this.user()) {
        const userId = this.user()?.id;
        if (userId)
          this.connectionService.getWebhookUrl(userId);
      }
    });

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

  get isWebhookEnabled(): boolean {
    return this.webhook() ? this.webhook()?.webhookEnabled ?? false : false;
  }

  toggleWebhook() {
    const currentWebhook = this.webhook();
    const userId = this.user()?.id;
    if (currentWebhook && userId) {
      const currentStatus = currentWebhook.webhookEnabled;
      this.connectionService.updateWebhookEnabled(userId, !currentStatus);
    }
  }

  copyField(data: string | undefined) {
    if (data) {
      navigator.clipboard.writeText(data).then();
    }
  }

  generateWebhookUrl() {
    const userId = this.user()?.id;
    if (userId) {
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
            this.connectionService.generateWebhookUrl(userId);
          }
        }
      );
    }
  }

  generateApiKey() {
    const userId = this.user()?.id;
    if (userId) {
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
            this.connectionService.generateApiKey(userId);
          }
        }
      );
    }
  }
}
