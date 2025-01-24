import {Component, effect, EventEmitter, Input, Output, signal} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Day, DayExceptions} from '../../../../models/Day';
import {NotificationTemplate, NotificationTemplateSettings} from '../../../../models/CreateTemplate';
import {LucideAngularModule} from 'lucide-angular';
import {NgForOf, NgIf} from '@angular/common';
import {convertTimeToUnixTimestamp, convertUnixToTime} from '../../../../app.module';

@Component({
  selector: 'template-settings',
  templateUrl: './template-settings.component.html',
  styleUrls: ['./template-settings.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    LucideAngularModule,
    NgIf,
    NgForOf,
    FormsModule
  ]
})
export class TemplateSettingsComponent {
  @Output() onFormValidityChange = new EventEmitter<boolean>();
  @Output() onSettingsChange = new EventEmitter<NotificationTemplateSettings>();
  @Input() template = signal<NotificationTemplate | null>(null);

  protected settingsForm: FormGroup;
  protected exceptionsForm: FormGroup;
  protected assignedUsersEmails: string[] = [];
  protected days: Day[] = [
    {name: 'Mon', active: false, startTime: 0, endTime: 0, dayExceptions: []},
    {name: 'Tues', active: false, startTime: 0, endTime: 0, dayExceptions: []},
    {name: 'Wed', active: false, startTime: 0, endTime: 0, dayExceptions: []},
    {name: 'Thu', active: false, startTime: 0, endTime: 0, dayExceptions: []},
    {name: 'Fri', active: false, startTime: 0, endTime: 0, dayExceptions: []},
    {name: 'Sat', active: false, startTime: 0, endTime: 0, dayExceptions: []},
    {name: 'Sun', active: false, startTime: 0, endTime: 0, dayExceptions: []},
  ];

  constructor(private fb: FormBuilder) {
    this.settingsForm = this.fb.group({
      recipientEmail: ['', [Validators.email]],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });

    this.exceptionsForm = this.fb.group({
      exceptions: this.fb.array([]),
    });

    this.settingsForm.statusChanges.subscribe(() => this.emitFormValidity());
    this.exceptionsForm.statusChanges.subscribe(() => this.emitFormValidity());

    effect(() => {
      const template = this.template()?.notificationTemplateSettings;
      if (template != null)
        this.prefillForm(template);
    });
  }

  protected addUser(): void {
    const email = this.settingsForm.get('recipientEmail')?.value;
    if (email &&
      this.settingsForm.get('recipientEmail')?.valid &&
      !this.assignedUsersEmails.includes(email)) {
      this.assignedUsersEmails.push(email);
      this.settingsForm.get('recipientEmail')?.reset();
      this.emitSettingsChange();
    }
  }

  protected removeUserFromAssigned(userEmail: string): void {
    this.assignedUsersEmails = this.assignedUsersEmails.filter(email => email !== userEmail);
    this.emitSettingsChange();
  }

  protected toggleDay(day: Day): void {
    day.active = !day.active;
    if (!day.active) {
      day.startTime = 0;
      day.endTime = 0;
      day.dayExceptions = [];
    } else {
      const startTime = this.settingsForm.get('startTime')?.value || '';
      const endTime = this.settingsForm.get('endTime')?.value || '';
      day.startTime = convertTimeToUnixTimestamp(startTime);
      day.endTime = convertTimeToUnixTimestamp(endTime);
    }
    this.emitSettingsChange();
  }

  protected updateDayTimes(): void {
    const startTime = this.settingsForm.get('startTime')?.value || '';
    const endTime = this.settingsForm.get('endTime')?.value || '';
    this.days.forEach(day => {
      if (day.active) {
        day.startTime = convertTimeToUnixTimestamp(startTime);
        day.endTime = convertTimeToUnixTimestamp(endTime);
      }
    });
    this.emitSettingsChange();
  }

  protected addException(): void {
    const newException = this.fb.group({
      selectedDay: ['', Validators.required],
      exceptionStartTime: ['', Validators.required],
      exceptionEndTime: ['', Validators.required],
    });

    newException.valueChanges.subscribe(() => {
      this.updateExceptionsInDays();
      this.emitSettingsChange();
    });

    this.exceptionArray.push(newException);
    this.emitSettingsChange();
  }

  protected onExceptionDayChange(index: number): void {
    const exceptionControl = this.exceptionArray.at(index);
    const newSelectedDay = exceptionControl.get('selectedDay')?.value;

    if (!newSelectedDay) return;

    const exceptionData: DayExceptions = {
      selectedDay: newSelectedDay,
      exceptionStartTime: exceptionControl.get('exceptionStartTime')?.value,
      exceptionEndTime: exceptionControl.get('exceptionEndTime')?.value,
    };

    const previousDayName = exceptionControl.get('previousDay')?.value;
    if (previousDayName) {
      const previousDay = this.days.find((d) => d.name === previousDayName);
      if (previousDay) {
        previousDay.dayExceptions = previousDay.dayExceptions.filter(
          (e) =>
            e.exceptionStartTime !== exceptionData.exceptionStartTime ||
            e.exceptionEndTime !== exceptionData.exceptionEndTime
        );
      }
    }

    const newDay = this.days.find((d) => d.name === newSelectedDay);
    if (newDay) {
      newDay.dayExceptions.push(exceptionData);
    }

    exceptionControl.patchValue({previousDay: newSelectedDay});

    this.emitSettingsChange();
  }

  protected removeException(index: number): void {
    const exceptionControl = this.exceptionArray.at(index);
    const selectedDay = exceptionControl.get('selectedDay')?.value;

    if (selectedDay) {
      const day = this.days.find((d) => d.name === selectedDay);
      if (day) {
        const startTime = exceptionControl.get('exceptionStartTime')?.value;
        const endTime = exceptionControl.get('exceptionEndTime')?.value;
        day.dayExceptions = day.dayExceptions.filter(
          (e) => e.exceptionStartTime !== startTime || e.exceptionEndTime !== endTime
        );
      }
    }

    this.exceptionArray.removeAt(index);
    this.emitSettingsChange();
  }

  private prefillForm(template: NotificationTemplateSettings): void {
    this.assignedUsersEmails = template.assignedUserEmails || [];

    this.days.forEach(day => {
      const templateDay = template.activeDays.find(d => d.name === day.name);
      if (templateDay) {
        day.active = templateDay.active;
        day.startTime = templateDay.startTime;
        day.endTime = templateDay.endTime;
        day.dayExceptions = templateDay.dayExceptions || [];
      }
    });

    this.settingsForm.get('startTime')?.setValue(convertUnixToTime(template.defaultStartTime));
    this.settingsForm.get('endTime')?.setValue(convertUnixToTime(template.defaultEndTime));

    this.emitSettingsChange();
  }

  private updateExceptionsInDays(): void {
    this.days.forEach((day) => (day.dayExceptions = []));

    this.exceptionArray.controls.forEach((control) => {
      const exceptionData: DayExceptions = {
        selectedDay: control.get('selectedDay')?.value,
        exceptionStartTime: control.get('exceptionStartTime')?.value,
        exceptionEndTime: control.get('exceptionEndTime')?.value,
      };

      if (exceptionData.selectedDay) {
        const day = this.days.find((d) => d.name === exceptionData.selectedDay);
        if (day) {
          day.dayExceptions.push(exceptionData);
        }
      }
    });
  }

  private emitSettingsChange() {
    const settings: NotificationTemplateSettings = {
      assignedUserEmails: this.assignedUsersEmails,
      defaultStartTime: convertTimeToUnixTimestamp(this.settingsForm.get('startTime')?.value),
      defaultEndTime: convertTimeToUnixTimestamp(this.settingsForm.get('endTime')?.value),
      activeDays: this.days.filter(day => day.active),
    };


    if (this.emitFormValidity()) {
      this.onSettingsChange.emit(settings);
    }
  }

  private emitFormValidity(): boolean {
    const isFormValid = this.settingsForm.valid &&
      this.assignedUsersEmails.length > 0 &&
      this.days.some(day => day.active);
    this.onFormValidityChange.emit(isFormValid);
    return isFormValid;
  }

  get exceptionArray(): FormArray {
    return this.exceptionsForm.get('exceptions') as FormArray;
  }

  get isAddUserDisabled(): boolean {
    const emailControl = this.settingsForm.get('recipientEmail');
    return !emailControl?.value ||
      emailControl.invalid ||
      this.assignedUsersEmails.includes(emailControl.value);
  }

  protected readonly convertUnixToTime = convertUnixToTime;
}
