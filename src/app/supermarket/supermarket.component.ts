import { NotFoundError } from './../common/not-found-error';
import { SupermarketService } from './../services/supermarket.service';
import { Component, OnInit } from '@angular/core';
import { AppError } from '../common/app.error';
import { InvalidRequest } from '../common/invalid-request-error';

@Component({
  selector: 'supermarket',
  templateUrl: './supermarket.component.html',
  styleUrls: ['./supermarket.component.css']
})
export class SupermarketComponent implements OnInit {
  supermarkets: any[];

  constructor(private service: SupermarketService) { }

  createPost(input: HTMLInputElement) {
    let sm = { title: input.value};
    this.supermarkets.splice(0, 0, sm);
    input.value = '';

    this.service.create(sm)
      .subscribe(newSm => {
        sm['id'] = newSm.id;
        console.log(newSm);
      }, 
      (error: AppError) => {
        this.supermarkets.splice(0, 1);

        if (error instanceof InvalidRequest) {
          //this.form.setErrors(error.json());
        } else throw error;
      });
  }

  updatePost(sm) {
    this.service.update(sm)
      .subscribe(updatedPost => {
        console.log(updatedPost);
      // }, 
      // error => {
      //   alert('An unexcepted error has occurred!');
      //   console.log(error);
      });
    //this.http.patch(this.url, JSON.stringify(post))
  }

  deletePost(sm) {
    let index = this.supermarkets.indexOf(sm);
    this.supermarkets.splice(index, 1);

    this.service.delete(sm)
      .subscribe(
        null, 
        (error: AppError) => {
          this.supermarkets.splice(index, 0, sm);
          
          if (error instanceof NotFoundError)
            alert('This post has already been deleted!');
          else throw error;
        });
    //this.http.patch(this.url, JSON.stringify(post))
  }

  ngOnInit() {
      this.service.getAll().subscribe(sm => this.supermarkets = sm); 
  }

}
