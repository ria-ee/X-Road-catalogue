import { Component, OnInit } from '@angular/core';
import { MethodsService } from '../methods.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  nonEmpty: boolean = false

  constructor(private methodsService: MethodsService) { }

  ngOnInit() {
  }

}
