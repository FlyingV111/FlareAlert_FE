import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {LucideAngularModule} from 'lucide-angular';

export interface ConfirmationDialogConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}


@Component({
  selector: 'ConfirmDialog',
  imports: [
    FormsModule,
    LucideAngularModule,

  ],
  templateUrl: './ConfirmDialog.component.html',
  styleUrl: './ConfirmDialog.component.css'
})
export class ConfirmDialogComponent {
  @Input({required: true}) config!: ConfirmationDialogConfig;

  constructor(public activeModal: NgbActiveModal) {
  }

  cancel() {
    this.activeModal.dismiss(false);
  }

  confirm() {
    this.activeModal.close(true);
  }
}
