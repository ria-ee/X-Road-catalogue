import { Component, OnInit } from '@angular/core';
import { MethodsService } from '../methods.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  message: string = ''

  constructor(private methodsService: MethodsService) { }

  ngOnInit() {
    this.message = this.methodsService.getMessage();
    // Service will tell when updated data is available!
    this.methodsService.newMessage.subscribe(signal => {
      this.message = signal;
    });
  }

}
