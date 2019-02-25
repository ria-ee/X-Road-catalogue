import { Component, OnInit } from '@angular/core';
import { MethodsService } from '../methods.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  nonEmpty: boolean = false
  limit: string = '10'
  filter: string = ''

  constructor(private methodsService: MethodsService) { }

  ngOnInit() {
  }

  setNonEmpty(nonEmpty: boolean) {
    this.methodsService.setNonEmpty(nonEmpty)
  }

  setLimit(limit: string) {
    this.methodsService.setLimit(limit)
  }

  setFilter(filter: string) {
    this.methodsService.setFilter(filter)
  }

}
