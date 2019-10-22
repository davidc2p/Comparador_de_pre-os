import { NotFoundError } from './../common/not-found-error';
import { SupermarketService } from './../services/supermarket.service';
import { Component, OnInit, } from '@angular/core';
import { AppError } from '../common/app.error';
import { InvalidRequest } from '../common/invalid-request-error';
import { NotAllowedError } from '../common/not-allowed-error';
//import { DataService } from '../services/data.service';

@Component({
  selector: 'supermarket',
  templateUrl: './supermarket.component.html',
  styleUrls: ['./supermarket.component.css']
})
export class SupermarketComponent implements OnInit {
  supermarkets: any[];
  supermarketname: string = "";
  supermarketid: number = null;
  erro: string = "";
  isError: boolean;

  constructor(private service: SupermarketService) { }

  createSupermarket() {
      if (this.supermarketid !== null) {
        this.updateSupermarket();
      } else {
        this.insertSupermarket();
      }
  }

  insertSupermarket() {
    let payload = { method: 'setSupermarket', name: this.supermarketname };
		//Optimistic display of values (no id so far)
		let sm = { id: 0, name: payload['name'] };
		this.supermarkets.splice(0, 0, sm);

		//Clear field values
    this.supermarketid = null;
    this.supermarketname = '';
    
		this.service.url = 'http://127.0.0.1:8080/scrapingweb/API/V1/supermarket/index.php';
    this.service.create(payload)
      .subscribe(newSm => {
        if (newSm.id !== undefined) {
						//Pessimistic updated of ID
            this.supermarkets[0].id = newSm.id;
        }
				//Send messages from service
        if (newSm.success !== undefined) {
            this.isError = (+newSm.success==1)?true:false;
            if (newSm.message !== undefined) {
                this.erro = newSm.message;
            }  
        }
        console.log(newSm);
      }, 
      (error: AppError) => {
					//Remove item optimistically inserted
					this.supermarkets.splice(0, 1);

          this.isError = true;
          let strError = error.originalError.json();
          this.erro = strError.message;
      });
  }

  copySupermarket(sm) {
      this.supermarketid = sm.id;
      this.supermarketname = sm.name;
  }

  updateSupermarket() {
    let payload = { method: 'updSupermarket', id: this.supermarketid, name: this.supermarketname };
    let sm = { id: this.supermarketid, name: this.supermarketname };
    let backSupermarketname: string = "";
    for (let i=0; i < this.supermarkets.length; i++) {
        if (sm.id === this.supermarkets[i].id) {
            backSupermarketname = this.supermarkets[i].name;
            this.supermarkets[i].name = sm.name;
        }
    }
    this.service.url = 'http://127.0.0.1:8080/scrapingweb/API/V1/supermarket/index.php';
    this.service.update(payload)
      .subscribe(updatedSupermarket => {

				//clear fields
        this.supermarketid = null;
        this.supermarketname = '';

				//Send messages from service
				if (updatedSupermarket.success !== undefined) {
            this.isError = (+updatedSupermarket.success==1)?true:false;
            if (updatedSupermarket.message !== undefined) {
                this.erro = updatedSupermarket.message;
            }  
        }
        console.log(updatedSupermarket);
      }, 
      error => {
					for (let i=0; i < this.supermarkets.length; i++) {
						if (sm.id === this.supermarkets[i].id) {
							this.supermarkets[i].name = backSupermarketname;
						}
        	}
    	    this.isError = true;
          let strError = error.originalError.json();
          this.erro = strError.message;
      });
    //this.http.patch(this.url, JSON.stringify(post))
  }

  deleteSupermarket(sm) {
    let index = this.supermarkets.indexOf(sm);
    this.supermarkets.splice(index, 1);
    this.service.url = 'http://127.0.0.1:8080/scrapingweb/API/V1/supermarket/index.php?method=delSupermarket&id='+sm.id;

    this.service.delete(sm)
      .subscribe(newSm => {
            if (newSm.success !== undefined) {
                this.isError = (+newSm.success==1)?true:false;
                if (newSm.message !== undefined) {
                    this.erro = newSm.message;
                }  
            }
            console.log(newSm);
        },  
        (error: AppError) => {
          this.supermarkets.splice(index, 0, sm);
          this.isError = true;
          let strError = error.originalError.json();
          this.erro = strError.message;
          
          if (error instanceof NotFoundError)
            console.log(error);
            
          if (error instanceof NotAllowedError)
            console.log(error);
        });
    //this.http.patch(this.url, JSON.stringify(post))
  }

  ngOnInit() {
      this.service.url = 'http://127.0.0.1:8080/scrapingweb/API/V1/supermarket/index.php?method=getSupermarket';
      this.service.getAll().subscribe(sm => this.supermarkets = sm); 
  }

}
