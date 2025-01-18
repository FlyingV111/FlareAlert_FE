import {Component} from '@angular/core';
import {LucideAngularModule} from 'lucide-angular';
import {NgForOf, NgIf} from '@angular/common';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Day, Exception} from '../../../../models/Day';

@Component({
  selector: 'template-settings',
  imports: [
    LucideAngularModule,
    NgForOf,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './template-settings.component.html',
  styleUrls: ['./template-settings.component.css'],
})
export class TemplateSettingsComponent {
  protected assignedUsersEmails: string[] = [];
  protected userSearchControl: FormControl;
  protected scheduleFrom: FormGroup;
  protected days: Day[] = [
    {name: 'Mon', active: false, startTime: '', endTime: '', exceptions: []},
    {name: 'Tues', active: false, startTime: '', endTime: '', exceptions: []},
    {name: 'Wed', active: false, startTime: '', endTime: '', exceptions: []},
    {name: 'Thu', active: false, startTime: '', endTime: '', exceptions: []},
    {name: 'Fri', active: false, startTime: '', endTime: '', exceptions: []},
    {name: 'Sat', active: false, startTime: '', endTime: '', exceptions: []},
    {name: 'Sun', active: false, startTime: '', endTime: '', exceptions: []},
  ];
  protected exceptions: Exception[] = [];

  constructor(private fb: FormBuilder) {
    this.scheduleFrom = new FormGroup({
      startTime: new FormControl(''),
      endTime: new FormControl(''),
      days: this.fb.array([]),
    });
    this.userSearchControl = new FormControl('', [Validators.email]);
    this.initializeDays();
  }

  private initializeDays(): void {
    this.days.forEach((day) => {
      const dayGroup = this.fb.group({
        name: [day.name],
        active: [day.active],
        startTime: [day.startTime],
        endTime: [day.endTime],
        exceptions: this.fb.array(day.exceptions.map(() => this.createExceptionGroup())),
      });
      this.daysFormArray.push(dayGroup);
    });
  }

  private createExceptionGroup(): FormGroup {
    return this.fb.group({
      selectedDay: [''], // Tag-Auswahl
      startTime: [''],
      endTime: [''],
    });
  }

  get daysFormArray() {
    return this.scheduleFrom.get('days') as FormArray;
  }

  get isAddUserDisabled(): boolean {
    return !this.userSearchControl.valid || !this.userSearchControl.value;
  }

  protected addUser(): void {
    if (this.userSearchControl.valid && this.userSearchControl.value) {
      this.assignedUsersEmails.push(this.userSearchControl.value);
      this.userSearchControl.setValue('');
    }
  }

  protected removeUserFromAssigned(userEmail: string): void {
    this.assignedUsersEmails = this.assignedUsersEmails.filter((u) => u !== userEmail);
  }

  protected saveTemplate() {
    console.log(this.scheduleFrom.value);
  }

  protected toggleDay(day: Day) {
    day.active = !day.active;
  }

  protected addException() {
    this.exceptions.push({
      selectedDay: '',
      exceptionStartTime: '',
      exceptionEndTime: '',
    });
  }

  protected removeException(exception: Exception) {
    this.exceptions = this.exceptions.filter(e => e !== exception);
  }
}
