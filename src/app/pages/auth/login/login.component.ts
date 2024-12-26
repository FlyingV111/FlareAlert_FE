import {Component, NgModule} from '@angular/core';
import {LucideAngularModule} from 'lucide-angular';
import {FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {NgClass, NgIf} from '@angular/common';
import {AuthService} from '../../../services/auth/authService/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [
    LucideAngularModule,
    FormsModule,
    NgClass,
    ReactiveFormsModule,
    RouterLink,
  ],
  styleUrl: './login.component.css'
})
export class LoginComponent {
  protected signInForm: FormGroup;
  protected isFormSubmitted = false;


  constructor(public authService: AuthService, private fb: FormBuilder) {
    this.signInForm = this.fb.group({
      userEmailLogin: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
        ]
      ],
      userPasswordLogin: ['', Validators.required],
    });
  }

  get userEmail(): string {
    const emailControl = this.signInForm.get('userEmailLogin');
    return emailControl ? emailControl.value : '';
  }

  get userPassword(): string {
    const passwordControl = this.signInForm.get('userPasswordLogin');
    return passwordControl ? passwordControl.value : '';
  }


  signIn() {
    this.isFormSubmitted = true;
    if (this.signInForm.valid) {
      this.authService.login(this.userEmail, this.userPassword)
    }
  }

  async googleSignIn() {
    // await this.authService.googleAuth()
  }

  async githubSignIn() {
    // await this.authService.githubAuth()
  }
}
