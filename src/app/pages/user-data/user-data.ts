import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User, UserResponse } from '../../services/user';

@Component({
  selector: 'app-user-data',
  imports: [MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './user-data.html',
  styleUrl: './user-data.scss',
})

export class UserData {

  private userService = inject(User)
  private formBuilder = inject(FormBuilder);

  user = this.userService.getUser();

  form = this.formBuilder.group({
    name: [{ value: this.user?.name || '', disabled: true }],
    email: [{ value: this.user?.email || '', disabled: true }]
  })
}
