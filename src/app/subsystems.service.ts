import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subsystem } from './subsystem';
import { Method } from './method';
import { MAX_LIMIT, DEFAULT_LIMIT, INSTANCES, API_SERVICE, FILTER_DEBOUNCE } from './config';

@Injectable({
  providedIn: 'root'
})
export class SubsystemsService {
  private apiUrlBase = '';
  private limit: number = DEFAULT_LIMIT;
  private nonEmpty = false;
  private filter = '';
  private instance = '';
  subsystemsSubject: BehaviorSubject<Subsystem[]> = new BehaviorSubject([]);
  filteredSubsystemsSubject: BehaviorSubject<Subsystem[]> = new BehaviorSubject([]);
  private updateFilter = new Subject<string>();

  warnings: EventEmitter<string> = new EventEmitter();

  constructor(private http: HttpClient) {
    // Debouncing update of filter
    this.updateFilter.pipe(
      debounceTime(FILTER_DEBOUNCE),
      distinctUntilChanged()
    ).subscribe(() => {
      this.updateFiltered();
    });
  }

  private filteredSubsystems(): Subsystem[] {
    const filtered: Subsystem[] = [];
    let limit: number = this.limit;
    for (let subsystem of this.subsystemsSubject.value) {
      if (this.nonEmpty && !subsystem.methods.length) {
        // Filtering out empty subsystems
        continue;
      }
      if (
        this.filter !== ''
        && !subsystem.methods.length
      ) {
        // Subsystem without methods
        if (subsystem.fullSubsystemName.toLowerCase().indexOf(this.filter.toLowerCase()) < 0) {
          // Subsystem name does not match the filter
          continue;
        }
      } else if (this.filter !== '') {
        // Subsystem with methods
        const filteredMethods: Method[] = [];
        for (const method of subsystem.methods) {
          if (method.fullMethodName.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0) {
            filteredMethods.push(method);
          }
        }
        if (!filteredMethods.length) {
          // No matching method names found
          continue;
        }
        // Copy object to avoid overwriting methods array in subsystem object
        subsystem = Object.assign(Object.create(subsystem), subsystem);
        // Leaving only matcing methods
        subsystem.methods = filteredMethods;
      }
      filtered.push(subsystem);
      limit -= 1;
      if (limit === 0) {
        break;
      }
    }
    return filtered;
  }

  private setFullNames(subsystems: Subsystem[]): Subsystem[] {
    for (const subsystem of subsystems) {
      subsystem.fullSubsystemName = subsystem.xRoadInstance
        + '/' + subsystem.memberClass
        + '/' + subsystem.memberCode
        + '/' + subsystem.subsystemCode;
      for (const method of subsystem.methods) {
        method.fullMethodName = subsystem.fullSubsystemName
        + '/' + method.serviceCode
        + '/' + method.serviceVersion;
      }
    }
    return subsystems;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      this.emitWarning('service.dataLoadingError');
      // Let the app keep running by returning an empty result.
      return of(result);
    };
  }

  private emitWarning(msg: string) {
    this.warnings.emit(msg);
  }

  private updateFiltered() {
    this.filteredSubsystemsSubject.next(this.filteredSubsystems());
  }

  getDefaultInstance(): string {
    return Object.keys(INSTANCES)[0];
  }

  getInstances(): string[] {
    return Object.keys(INSTANCES);
  }

  getInstance(): string {
    return this.instance;
  }

  setInstance(instance: string) {
    this.instance = instance;
    this.apiUrlBase = INSTANCES[instance];

    // Reset only if has values (less refreshes)
    if (this.subsystemsSubject.value.length) {
      this.subsystemsSubject.next([]);
    }
    this.http.get<Subsystem[]>(this.apiUrlBase + API_SERVICE)
    .pipe(
      catchError(this.handleError([]))
    ).subscribe(subsystems => {
      this.subsystemsSubject.next(this.setFullNames(subsystems));
      this.updateFiltered();
    });
  }

  getApiUrlBase(): string {
    return this.apiUrlBase;
  }

  getApiUrl(): string {
    return this.apiUrlBase + API_SERVICE;
  }

  getLimit(): string {
    if (this.limit === MAX_LIMIT) {
      return 'all';
    }
    return this.limit.toString();
  }

  setLimit(limit: string) {
    switch (limit) {
      case '20':
        this.limit = 20;
        break;
      case '50':
        this.limit = 50;
        break;
      case 'all':
        this.limit = MAX_LIMIT;
        break;
      default:
        this.limit = 10;
    }
    this.updateFiltered();
  }

  getNonEmpty(): boolean {
    return this.nonEmpty;
  }

  setNonEmpty(nonEmpty: boolean) {
    this.nonEmpty = nonEmpty;
    this.updateFiltered();
  }

  getfilter(): string {
    return this.filter;
  }

  setFilter(filter: string) {
    if (this.filter !== filter.trim()) {
      this.filter = filter.trim();
      // Debouncing update of filter
      this.updateFilter.next(this.filter);
    }
  }
}
