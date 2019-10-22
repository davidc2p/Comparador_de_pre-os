import { NotFoundError } from './../common/not-found-error';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/throw';

import { AppError } from '../common/app.error';
import { InvalidRequest } from '../common/invalid-request-error';
import { NotAllowedError } from '../common/not-allowed-error';


@Injectable()
export class DataService {
  url: string;

  constructor(private http: Http) { 
  }

  getAll() {
    return this.http.get(this.url)
        .map(response => response.json())
        .catch(this.handleError);
  }

  create(resource) {

    //return Observable.throw(new AppError());

    return this.http.post(this.url, JSON.stringify(resource))
      .map(response => response.json())
      .catch(this.handleError);
  }

  update(resource) {
    return this.http.put(this.url, JSON.stringify(resource))
      .map(response => response.json())
      .catch(this.handleError);
  }

  delete(id) {
//    return Observable.throw(new AppError())
//    .map(response => response.json())
    //.toPromise()
    //.retry(3)
//    .catch(this.handleError);

    return this.http.delete(this.url + '/' + id)
      .map(response => response.json())
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    if (error.status === 400) {
      return Observable.throw(new InvalidRequest());
    }

    if (error.status === 404) {
      return Observable.throw(new NotFoundError());
    } 
    
    if (error.status === 405) {
      return Observable.throw(new NotAllowedError(error));
    } else {
      return Observable.throw(new AppError(error));
    }
  }
}
