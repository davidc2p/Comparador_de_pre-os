import { AbstractControl, ValidationErrors, AsyncValidatorFn } from "@angular/forms";
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs/Observable';
import { map, switchMap  } from 'rxjs/operators';
import { timer } from 'rxjs';
import { Injectable } from '@angular/core'; 

@Injectable({
  providedIn: 'root'
})
export class EmailValidators {
    
    constructor(private userService: UserService) {}

    static isEmail(control: AbstractControl): ValidationErrors | null {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test((control.value as string))) {
            return { isNotEmail: true }
        }
    }

    searchUser(text) { 
        // debounce
        return timer(1000)
        .pipe(
            switchMap(() => {
                // Check if username is available
                this.userService.url = 'http://127.0.0.1:8080/scrapingweb/API/V1/user/index.php?method=getUser&email='+text;
                return this.userService.getUser();
            })
        )
    }

    userValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
            return this.searchUser(control.value)
                .pipe(
                    map(res => {
                        // if username is already taken
                        if (res.length && res[0].email !== undefined) {
                            // return error
                            return { 'emailExists': true};
                        } 
                    })
                );
        };
    }
}
/*
export function existingEmail(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    
    userService.url = 'http://127.0.0.1:8080/scrapingweb/API/V1/user/index.php?method=getUser&email'+control.value;
    
    return userService.getUser()
    .map(
      users => {
        return (users && users.length > 0) ? {"existingEmail": true} : null;
      } 
    );
  };
} 
*/