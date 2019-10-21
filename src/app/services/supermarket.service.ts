
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { DataService } from './data.service';

@Injectable()
export class SupermarketService extends DataService {
  //private url: string ='https://jsonplaceholder.typicode.com/posts';

  constructor(http: Http) { 
    super('http://127.0.0.1:8080/scrapingweb/API/V1/supermarket/index.php?method=getSupermarket', http);
  }
}
