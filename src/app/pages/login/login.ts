import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PasswordField } from '../../shared/components/password-field/password-field';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { User, UserLoginPayload } from '../../services/user';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Auth } from '../../services/auth';


@Component({
  selector: 'app-login',
  imports: [MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    PasswordField, ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  encapsulation: ViewEncapsulation.None
})
export class Login {
  form: FormGroup<{ email: FormControl<string>, password: FormControl<string> }>;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private User: User,
    private router: Router,
    private authService: Auth

  ) {
    this.form = this.formBuilder.group({
      email: this.formBuilder.control('', { validators: [Validators.required, Validators.email], nonNullable: true }),
      password: this.formBuilder.control('', { validators: [Validators.required, Validators.minLength(6)], nonNullable: true })
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/tasks'])
    }
  }

  get passwordControl(): FormControl {
    return this.form.get('password') as FormControl
  }

  get emailErrors(): string | null {
    const emailControl = this.form.get('email')
    if (emailControl?.hasError('required')) return 'A informação do e-mail é obrigatório';
    if (emailControl?.hasError('email')) return 'Este e-mail é inválido';
    return null
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    const formData = this.form.value as UserLoginPayload;
    this.isLoading = true;


    this.User.login(formData)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.authService.saveToken(response)
          this.router.navigate(['/tasks'])
        },
        error: (error) => {
          console.error(`Error ao entrar`, error)
        }
      })
  }
}


