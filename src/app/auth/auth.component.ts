import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule} from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  imports: [
    MatCardModule,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  authForm!: FormGroup;
  isLogin = false;
  errorMessage: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.authForm = this.formBuilder.group({
      username: [''],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.authForm.valid) {
      console.log(this.authForm.value);
      const formData = this.authForm.value;
      if (this.isLogin) {
        this.authService
          .login({ email: formData.email, password: formData.password })
          .subscribe({
            next: () => console.log('login successfull'),
            error: (err) =>
              (this.errorMessage = err.console.message || 'Login Failed'),
          });
      } else {
        this.authService.register(formData).subscribe({
          next: (res: {
            username: string
            email: string
            password: string
          }) => {
            this.toggleMode();
            console.log('Registration successful', res);
            this.authForm.reset();

          },
          error: (err) =>
            (this.errorMessage = err.console.message || 'Registration Failded'),
        });
      }
    }
  }
  
  toggleMode() {
    this.isLogin = !this.isLogin;
    if (this.isLogin) {
      this.authForm.get('username')?.clearValidators();
    } else {
      this.authForm.get('username')?.setValidators([Validators.required]);
    }
    this.authForm.get('username')?.updateValueAndValidity();
  }
}
