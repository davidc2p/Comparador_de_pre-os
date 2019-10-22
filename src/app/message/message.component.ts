import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  @Input('isError') isError: boolean;
  @Input('message') message: string;

  constructor() { }

  ngOnInit() {
  }

}
