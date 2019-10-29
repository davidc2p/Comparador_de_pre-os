import { Component } from '@angular/core';
import { EmailValidators } from '../common/email.validators';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private validation: EmailValidators) { }

  form = new FormGroup({
      account: new FormGroup({
          email: new FormControl('', [
              Validators.required,
              Validators.minLength(3),
              EmailValidators.isEmail
          ],
          [                
              this.validation.userValidator()
          ]),
          password: new FormControl('', Validators.required)
      })
  });

  register() {
      this.form.setErrors({ 
          invalidRegister: true
      });
  }

  get email() {
      return this.form.get('account.email');
  }

}
