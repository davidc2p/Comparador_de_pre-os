import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmailValidators } from '../common/email.validators';
import * as CryptoJS from 'crypto-js';

import { UserService } from '../services/user.service';

import { Store } from '@ngrx/store';
import { User } from '../models/user';
import { AppState } from '../store/app.states';
import { LogIn } from '../store/actions/auth.actions';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    user: User = new User();

    constructor(private validation: EmailValidators, private service: UserService) { }

    form = new FormGroup({
        account: new FormGroup({
            email: new FormControl('', [
                Validators.required,
                Validators.minLength(3),
                EmailValidators.isEmail
            ]),
            password: new FormControl()
        })
    });

    login() {

        this.service.url = 'http://127.0.0.1:8080/scrapingweb/API/V1/user/index.php?method=prelogin&email=' + this.email.value;
        this.service.getAll().subscribe(secret => {
            // if (secret.id !== undefined) {
            //     //Pessimistic updated of ID
            //     this.user = secret;
            // }
            //Send messages from service
            if (secret.secret !== undefined) {
                // Encrypt 3 second method with iv server generated
                let salt3 = CryptoJS.enc.Hex.parse(secret.salt);
                let iv3 =  CryptoJS.enc.Hex.parse(secret.iv);

                let key3 = CryptoJS.PBKDF2(secret.secret, salt3, { 'hasher': CryptoJS.algo.SHA512, 'keySize': 64 / 8, 'iterations': 999 });

                let encrypted3 = CryptoJS.AES.encrypt(this.password.value, key3, { 'iv': iv3 });
                let decrypt2 = CryptoJS.AES.decrypt(encrypted3, key3, { 'iv': iv3 });

                const data2 = {
                    ciphertext: CryptoJS.enc.Hex.stringify(encrypted3.ciphertext),
                    salt: CryptoJS.enc.Hex.stringify(salt3),
                    iv: CryptoJS.enc.Hex.stringify(iv3)
                }
                this.service.url = 'http://127.0.0.1:8080/scrapingweb/API/V1/user/index.php?method=login&email=' + this.email.value + '&password=' + JSON.stringify(data2) + '&dev=1';
                this.service.login().subscribe(user => {

                    if (user.success !== undefined && user.success === 1) {
                      this.service.destroyContext();
                      this.form.setErrors({ invalidLogin: true });
                    } else {
                      this.service.createContext(this.service.user());
                      console.log(this.service.user());
                    }                    
                });
            }
            
        });
    }

    logout() {
        this.service.destroyContext();
    }

    get email() {
        return this.form.get('account.email');
    }
    get password() {
        return this.form.get('account.password');
    }

    ngOnInit() {
      //this.service.getContext();
    }

}
