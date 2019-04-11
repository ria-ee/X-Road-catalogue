import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subsystem } from './subsystem';
import { Method } from './method';
import { AppConfig } from './app.config';

@Injectable({
  providedIn: 'root'
})
export class SubsystemsService {
  private apiUrlBase = '';
  private limit: number = this.config.getConfig('DEFAULT_LIMIT');
  private nonEmpty = false;
  private filter = '';
  private instance = '';
  subsystemsSubject: BehaviorSubject<Subsystem[]> = new BehaviorSubject([]);
  filteredSubsystemsSubject: BehaviorSubject<Subsystem[]> = new BehaviorSubject([]);
  private updateFilter = new Subject<string>();

  warnings: EventEmitter<string> = new EventEmitter();

  constructor(
    private http: HttpClient,
    private config: AppConfig
  ) {
    // Debouncing update of filter
    this.updateFilter.pipe(
      debounceTime(this.config.getConfig('FILTER_DEBOUNCE')),
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
    return Object.keys(this.config.getConfig('INSTANCES'))[0];
  }

  getInstances(): string[] {
    return Object.keys(this.config.getConfig('INSTANCES'));
  }

  getInstance(): string {
    return this.instance;
  }

  setInstance(instance: string) {
    this.instance = instance;
    this.apiUrlBase = this.config.getConfig('INSTANCES')[instance];

    // Reset only if has values (less refreshes)
    if (this.subsystemsSubject.value.length) {
      this.subsystemsSubject.next([]);
    }
    this.http.get<Subsystem[]>(this.apiUrlBase + this.config.getConfig('API_SERVICE'))
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
    return this.apiUrlBase + this.config.getConfig('API_SERVICE');
  }

  getLimit(): string {
    if (this.limit === this.config.getConfig('MAX_LIMIT')) {
      return 'all';
    }
    return this.limit.toString();
  }

  getLimits(): object {
    return this.config.getConfig('LIMITS');
  }

  setLimit(limit: string) {
    const limits = this.config.getConfig('LIMITS');
    let found = false;
    for (const key of Object.keys(limits)) {
      if (limit === key) {
        this.limit = limits[key];
        found = true;
        break;
      }
    }
    if (!found && limit === 'all') {
      this.limit = this.config.getConfig('MAX_LIMIT');
      found = true;
    }
    if (!found) {
      this.limit = this.config.getConfig('DEFAULT_LIMIT');
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
