import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Subsystem } from './subsystem';
import { Method } from './method';

const MAX_LIMIT: number = 1000000;
const CONFIG = {
  'EE': 'https://www.x-tee.ee/catalogue/EE/wsdls/',
  'ee-test': 'https://www.x-tee.ee/catalogue/ee-test/wsdls/',
  'ee-dev': 'https://www.x-tee.ee/catalogue/ee-dev/wsdls/'
}
const API_SERVICE = 'index.json';

@Injectable({
  providedIn: 'root'
})
export class MethodsService {
  private apiUrlBase = '';
  private limit: number = 10;
  private offset: number = 0;
  private nonEmpty: boolean = false;
  private filter: string = "";
  private subsystems: Subsystem[] = [];
  private loadingDone: boolean = false;
  private loadingError: boolean = false;
  private instance: string = '';
  private instanceData = new Object();

  @Output() subsystemsUpdated: EventEmitter<any> = new EventEmitter();
  @Output() warnings: EventEmitter<string> = new EventEmitter();

  constructor(private http: HttpClient) {}

  private signalRefresh() {
    this.subsystemsUpdated.emit(null);
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

        // Copy object to avoid overwriting methods array in subsystem object
        // TODO: Is there a better way???
        subsystem = Object.assign(Object.create(subsystem), subsystem);
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

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (result?: T) {
    return (error: any): Observable<T> => {
      this.loadingError = true
      this.emitWarning('Error while loading data from server!')

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getDefaultInstance(): string {
    return Object.keys(CONFIG)[0]
  }

  getInstances(): string[] {
    return Object.keys(CONFIG)
  }

  getInstance(): string {
    return this.instance
  }

  emitWarning(msg: string) {
    this.warnings.emit(msg);
  }

  setInstance(instance: string) {
    this.instance = instance
    this.apiUrlBase = CONFIG[instance]

    // Data of this instance already loaded
    if (this.instanceData[instance] && this.instanceData[instance].length) {
      this.subsystems = this.instanceData[instance]
      this.signalRefresh();
    } else {
      this.loadingDone = false;
      this.loadingError = false;
      this.http.get<Subsystem[]>(this.apiUrlBase + API_SERVICE)
      .pipe(
        catchError(this.handleError([]))
      ).subscribe(subsystems => {
        this.instanceData[instance] = subsystems
        this.subsystems = this.instanceData[instance]
        this.setFullNames();
        this.loadingDone = true;
        this.signalRefresh();
      })
    }
  }

  getApiUrlBase(): string {
    return this.apiUrlBase
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

  isLoadingError(): boolean {
    return this.loadingError
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
      this.filter = filter.trim();
      this.signalRefresh();
    }
  }

  getSubsystem(name: string): Subsystem {
    return this.subsystems.find(function(element) {
      return element.fullSubsystemName === name;
    })
  }
}
