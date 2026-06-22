import { Component, Input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';;
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'input-password-field',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './password-field.html',
  styleUrl: './password-field.scss',

})
export class PasswordField {
  hide = signal(true);

  @Input({ required: true }) control!: FormControl
  @Input() placeholder: string = 'Digite a sua senha'

  get passwordErrors(): string | null {
    const passwordControl = this.control;
    if (passwordControl?.hasError('required')) return 'Senha um campo é obrigatório';
    if (passwordControl?.hasError('minlength')) return 'A senha deve conter no minímo 6 dígitos';
    return null
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
