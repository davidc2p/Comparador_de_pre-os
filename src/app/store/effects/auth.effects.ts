import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import { tap } from 'rxjs/operators';
import {
  AuthActionTypes,
  LogIn, LogInSuccess, LogInFailure,
} from '../actions/auth.actions';

import { UserService } from '../../services/user.service';


@Injectable()
export class AuthEffects {

  constructor(
    private actions: Actions,
    private userService: UserService,
    private router: Router,
  ) {}

  // effects go here
  @Effect()
	LogIn: Observable<any> = this.actions
		.ofType(AuthActionTypes.LOGIN)
		.map((action: LogIn) => action.payload)
		.switchMap(payload => {
			return this.userService.logIn(payload.email, payload.password)
				.map((user) => {
					console.log(user);
					return new LogInSuccess({access_token: user.access_token, email: payload.email});
				})
				.catch((error) => {
					console.log(error);
					return Observable.of(new LogInFailure({ error: error }));
				});
		});

	@Effect({ dispatch: false })
	LogInSuccess: Observable<any> = this.actions.pipe(
		ofType(AuthActionTypes.LOGIN_SUCCESS),
		tap((user) => {
			localStorage.setItem('access_token', user.payload.access_token);
			this.router.navigateByUrl('/');
		})
	);

	@Effect({ dispatch: false })
	LogInFailure: Observable<any> = this.actions.pipe(
		ofType(AuthActionTypes.LOGIN_FAILURE)
	);
}