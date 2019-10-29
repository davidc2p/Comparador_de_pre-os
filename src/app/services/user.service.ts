
import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { User } from '../models/user';

@Injectable()
export class UserService extends DataService {
  private _loggedIn: boolean = false;
  private _user: User;

  constructor(http: Http) { 
    super(http); 
    this._user = new User();
    this.createContextfromLocal();
  }

  getUser() {
    return this.http.get(this.url)
      .map(response => { 
        return response.json()
      })
      //.catch(this.handleError);
  }

  login() {
    return this.http.get(this.url)
      .map(response => { 
        const resp = response.json();
        if (resp.authenticate !== undefined && (resp.authenticate as string) === "true") {
          this._loggedIn = true;
          this._user.isAuthenticate = ((resp.authenticate as string) === "true")? true : false;
          this._user.email = (resp.email !== undefined) ?  resp.email : '';
          this._user.uid = (resp.uid !== undefined) ?  resp.uid : '';
          this._user.name = (resp.name !== undefined) ?  resp.name : '';
          this._user.creationdate = (resp.creationdate !== undefined) ?  resp.creationdate : '';
          this._user.admin = (resp.admin !== undefined) ?  resp.admin : '';
          this._user.access_token = (resp.access_token !== undefined) ?  resp.access_token : '';
        }
        return resp;
      })
  }

	checkServiceAuth(message) {
		if (typeof(message) !== 'undefined' && (message == 'Invalid token' || message == 'Token has expired')) {
				this.destroyContext();
				return false;
		} else {
				return true;
		}
	}

	createContext(creds) {
		localStorage.setItem("isAuthenticate", creds.isAuthenticate);
		localStorage.setItem("access_token", creds.access_token);
		localStorage.setItem("email", creds.email);
		localStorage.setItem("name", creds.name);
		localStorage.setItem("uid", creds.uid);
		localStorage.setItem("admin", creds.admin);
		localStorage.setItem("creationdate", creds.creationdate);

    this._loggedIn = creds.isAuthenticate;
    this._user.isAuthenticate = creds.isAuthenticate;
    this._user.email = creds.email;
    this._user.uid = creds.uid;
    this._user.name = creds.name;
    this._user.creationdate = creds.creationdate;
    this._user.admin = creds.admin;
    this._user.access_token = creds.access_token;
	}

  createContextfromLocal() {
    this._loggedIn = (localStorage.getItem('isAuthenticate') as unknown as boolean);
    this._user.isAuthenticate = (localStorage.getItem('isAuthenticate') as unknown as boolean);
    this._user.email = localStorage.getItem('email');
    this._user.uid = localStorage.getItem('uid');
    this._user.name = localStorage.getItem('name');
    this._user.creationdate = localStorage.getItem('creationdate');
    this._user.admin = +localStorage.getItem('admin');
    this._user.access_token = localStorage.getItem('access_token');
  }

	updateContext(access_token) {
		localStorage.setItem('access_token', access_token)
    this._loggedIn = true;
    this._user.isAuthenticate = true;
    this._user.email = localStorage.getItem('email');
    this._user.uid = localStorage.getItem('uid');
    this._user.name = localStorage.getItem('name');
    this._user.creationdate = localStorage.getItem('creationdate');
    this._user.admin = +localStorage.getItem('admin');
    this._user.access_token = localStorage.getItem('access_token');
	}

	renewToken(access_token, email) {
		this.url = 'http://127.0.0.1:8080/scrapingweb/API/V1/token/create.php';
		return this.http.put(this.url, {
				access_token: access_token,
				lang: 'en',
				dev: 1,
				client_id: email			
			})
      .map(response => { 
        return response.json()
      })
	}

	validateToken(access_token) {
			return this.http.get(`http://127.0.0.1:8080/scrapingweb/API/V1/token/validate.php?access_token=${access_token}&lang=en&dev=1`)
        .map(response => {
          return response.json()
        });
  }
  
  async validateToken2(access_token, email) {
    return this.http.get(`http://127.0.0.1:8080/scrapingweb/API/V1/token/validate.php?access_token=${access_token}&client_id=${email}&lang=en&dev=1`).toPromise();
  }

  async getContext2() {
    // Retrieve the object from storage
		//let context = JSON.parse(localStorage.getItem('context'))
		let access_token = localStorage.getItem('access_token')
		let email = localStorage.getItem('email')

		if (access_token !== null) {
			if (typeof(email) !== 'undefined' && typeof(access_token) !== 'undefined' && access_token !== null) {
				//validate the access_token
				await this.validateToken2(access_token, email)
					.then(newToken => {
            let a = newToken.json()
            if (typeof(a.message) !== 'undefined' && typeof(a.success) !== 'undefined') {
							if (a.message === 'Token is valid' && a.success === 0) {
								//Token is valid
                this._loggedIn = true;
                this._user.isAuthenticate = true;
                this._user.email = email;
                this._user.uid = localStorage.getItem('uid');
                this._user.name = localStorage.getItem('name');
                this._user.creationdate = localStorage.getItem('creationdate');
                this._user.admin = +localStorage.getItem('admin');
                if (typeof(a.access_token) !== 'undefined') {
                  this.updateContext(a.access_token);
                } else {
                  this._user.access_token = localStorage.getItem('access_token');
                }
							} else {
                //error
                if (a.message === 'Invalid token') {
                  this.destroyContext();
                }
							}
						}
          })
      }
    }
  }

  /*
	getContext() {
		// Retrieve the object from storage
		//let context = JSON.parse(localStorage.getItem('context'))
		let access_token = localStorage.getItem('access_token')
		let email = localStorage.getItem('email')

		if (access_token !== null) {
			if (typeof(email) !== 'undefined' && typeof(access_token) !== 'undefined' && access_token !== null) {
				//validate the access_token
				this.validateToken(access_token)
					.subscribe(newToken => {
						if (typeof(newToken.message) !== 'undefined' && typeof(newToken.success) !== 'undefined') {
							if (newToken.message === 'Token is valid' && newToken.success === 0) {
								//Token is valid
                this._loggedIn = true;
                this._user.isAuthenticate = true;
                this._user.email = email;
                this._user.uid = localStorage.getItem('uid');
                this._user.name = localStorage.getItem('name');
                this._user.creationdate = localStorage.getItem('creationdate');
                this._user.admin = +localStorage.getItem('admin');
                this._user.access_token = localStorage.getItem('access_token');
							} else {
								if (newToken.message === 'Token has expired') {
									//renew access_token
									this.renewToken(access_token, email)
										.subscribe(renewToken => {
											if (typeof(renewToken.access_token) !== 'undefined') {
                        access_token = renewToken.access_token
                        this.updateContext(renewToken.access_token)
											}
										});
								} else {
									//error
									if (newToken.message === 'Invalid token') {
										this.destroyContext();
									}
								}
							}
						}
					})
					// .catch(error => {
					// 	if (error.response) {
					// 			alert(error.response);
					// 	}
					// })
			} else {
				this.destroyContext()
			}
		} else {
			this.destroyContext()
    }
  }
  */

	destroyContext() {
			localStorage.removeItem("access_token");
			localStorage.removeItem("email");
			localStorage.removeItem("name");
			localStorage.removeItem("uid");
			localStorage.removeItem("creationdate");
			localStorage.removeItem("admin");

      this._loggedIn = false;
      this._user.isAuthenticate = false;
      this._user.email = '';
      this._user.uid = '';
      this._user.name = '';
      this._user.creationdate = '';
      this._user.admin = 0;
      this._user.access_token = '';
	}
  
  isLoggedIn(): boolean {
    return this._loggedIn
  }

  user(): User {
    return this._user;
  }

  logIn(email: string, password: string): Observable<any> {
    let cred: {
      email: string,
      password: string
    }
    cred.email = email;
    cred.password = password;
    return this.http.get(this.url);
  }

}
