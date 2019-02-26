import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Subsystem } from './subsystem';
import { Method } from './method';

const MAX_LIMIT: number = 1000000;

@Injectable({
  providedIn: 'root'
})
export class MethodsService {

  private apiUrlBase = 'https://www.x-tee.ee/catalogue/EE/wsdls/';
  //public apiUrlBase = 'http://localhost/';
  private limit: number = 10;
  private offset: number = 0;
  private nonEmpty: boolean = false;
  private filter: string = "";
  private apiService = 'index.json';
  private apiUrl = this.apiUrlBase + this.apiService;
  private subsystems: Subsystem[] = [];
  private loadingDone: boolean = false;

  @Output() subsystemsUpdated: EventEmitter<any> = new EventEmitter();
  @Output() hideDetails: EventEmitter<boolean> = new EventEmitter();

  constructor(private http: HttpClient) {
    this.http.get<Subsystem[]>(this.apiUrl)
    .pipe(
      catchError(this.handleError('getMethods', []))
    ).subscribe(subsystems => {
      this.subsystems = subsystems;
      this.setFullNames();
      this.loadingDone = true;
      this.signalRefresh();
    })
  }

  private signalRefresh() {
    this.subsystemsUpdated.emit(null);
  }

  private signalHideDetails(signal: boolean) {
    this.hideDetails.emit(signal);
  }

  private filteredSubsystems(): Subsystem[] {
    let filtered: Subsystem[] = []
    let limit: number = this.limit
    for (let subsystem of this.subsystems) {
      if (this.nonEmpty && !subsystem.methods.length) {
        // Filtering out empty subsystems
        continue
      }
      if (
        this.filter != ''
        && !subsystem.methods.length
      ) {
        // Subsystem without methods
        if (subsystem.fullSubsystemName.toLowerCase().indexOf(this.filter.toLowerCase()) < 0) {
          // Subsystem name does not match the filter
          continue
        }
      } else if (this.filter != '') {
        // Subsystem with methods
        let filteredMethods: Method[] = []
        for (let method of subsystem.methods) {
          if(method.fullMethodName.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0) {
            filteredMethods.push(method)
          }
        }
        if (!filteredMethods.length) {
          // No matching method names found
          continue
        }
        // Leaving only matcing methods
        subsystem.methods = filteredMethods
      }

      filtered.push(subsystem)
      limit -= 1
      if (limit == 0) {
        break
      }
    }

    return filtered.slice(this.offset, this.limit);
  }

  private setFullNames() {
    for (let i in this.subsystems) {
      this.subsystems[i].fullSubsystemName = this.subsystems[i].xRoadInstance
        + '/' + this.subsystems[i].memberClass
        + '/' + this.subsystems[i].memberCode
        + '/' + this.subsystems[i].subsystemCode
      for (let j in this.subsystems[i].methods) {
        this.subsystems[i].methods[j].fullMethodName = this.subsystems[i].fullSubsystemName
        + '/' + this.subsystems[i].methods[j].serviceCode
        + '/' + this.subsystems[i].methods[j].serviceVersion
      }
    }
  }

  getLimit(): string {
    if (this.limit == MAX_LIMIT) {
      return 'All'
    }
    return this.limit.toString()
  }

  getNonEmpty(): boolean {
    return this.nonEmpty
  }

  getfilter(): string {
    return this.filter
  }

  isLoadingDone(): boolean {
    return this.loadingDone
  }

  getMethods(): Subsystem[] {
    return this.filteredSubsystems();
  }

  setNonEmpty(nonEmpty: boolean) {
    this.nonEmpty = nonEmpty;
    this.signalRefresh();
  }

  setLimit (limit: string) {
    switch(limit) {
      case '20':
        this.limit = 20;
        break;
      case '50':
        this.limit = 50;
        break;
      case 'All':
        this.limit = MAX_LIMIT;
        break;
      default:
        this.limit = 10;
    }
    this.signalRefresh();
  }

  setFilter(filter: string) {
    if (this.filter != filter.trim()) {
      if (filter.trim() == '') {
        // Always close methods when filter is deleted
        this.signalHideDetails(true)
      } else {
        // Always open methods when filter is inserted
        this.signalHideDetails(false)
      }
      this.filter = filter.trim();
      this.signalRefresh();
    }
  }

  getSubsystem(name: string): Subsystem {
    return this.subsystems.find(function(element) {
      return element.fullSubsystemName === name;
    })
  }

  getHideDetails(): boolean {
    if (this.filter == '') {
      return true
    } else {
      return false
    }
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
