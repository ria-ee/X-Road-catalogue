import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, BehaviorSubject, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subsystem } from './subsystem';
import { Method } from './method';
import { Service } from './service';
import { AppConfig } from './app.config';
import { InstanceVersion } from './instance-version';

@Injectable({
  providedIn: 'root'
})
export class SubsystemsService {
  subsystemsSubject: BehaviorSubject<Subsystem[]> = new BehaviorSubject([]);
  filteredSubsystemsSubject: BehaviorSubject<Subsystem[]> = new BehaviorSubject([]);
  instanceVersionsSubject: BehaviorSubject<InstanceVersion[]> = new BehaviorSubject([]);
  warnings: EventEmitter<string> = new EventEmitter();
  private apiUrlBase = '';
  private limit: number = this.config.getConfig('DEFAULT_LIMIT');
  private nonEmpty = false;
  private filter = '';
  private instance = '';
  private instanceVersion = '';
  private updateFilter = new Subject<string>();

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

  getDefaultInstance(): string {
    return Object.keys(this.config.getConfig('INSTANCES'))[0];
  }

  getInstances(): string[] {
    return Object.keys(this.config.getConfig('INSTANCES'));
  }

  getInstance(): string {
    return this.instance;
  }

  // Not "private" to be able to override in unit tests
  updateSubsystems() {
    // Reset only if has values (less refreshes)
    if (this.subsystemsSubject.value.length) {
      this.subsystemsSubject.next([]);
    }
    this.http.get<Subsystem[]>(
      this.apiUrlBase + (this.instanceVersion ? 'index_' + this.instanceVersion + '.json' : this.config.getConfig('API_SERVICE'))
    ).pipe(
      catchError( () => {
        this.emitWarning('service.dataLoadingError');
        // Let the app keep running by returning an empty result.
        return of([]);
      })
    ).subscribe(subsystems => {
      this.subsystemsSubject.next(this.setFullNames(subsystems));
      this.updateFiltered();
    });
  }

  // Not "private" to be able to override in unit tests
  updateInstanceVersions() {
    this.instanceVersionsSubject.next([]);
    this.http.get<InstanceVersion[]>(this.apiUrlBase + this.config.getConfig('API_HISTORY'))
    .pipe(
      // Let the app keep running by returning an empty result.
      catchError(() => of([]))
    ).subscribe(history => {
      const versions: InstanceVersion[] = [];
      for (const version of history) {
        const matches = version.reportPath.match(/index_(\d+).json/);
        if (matches && matches.length === 2) {
          version.reportTimeCompact = matches[1];
          versions.push(version);
        }
        if (versions.length >= this.config.getConfig('HISTORY_LIMIT')) {
          break;
        }
      }
      this.instanceVersionsSubject.next(versions);
    });
  }

  setInstance(instance: string, instanceVersion: string = '') {
    this.instance = instance;
    this.instanceVersion = instanceVersion;
    this.apiUrlBase = this.config.getConfig('INSTANCES')[instance];

    this.updateSubsystems();
    this.updateInstanceVersions();
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

  getLimits(): Map<string, number> {
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

  getInstanceVersion(): string {
    return this.instanceVersion;
  }

  private filteredSubsystems(): Subsystem[] {
    const filtered: Subsystem[] = [];
    let limit: number = this.limit;
    for (let subsystem of this.subsystemsSubject.value) {
      if (this.nonEmpty && !subsystem.methods.length && !subsystem.services.length) {
        // Filtering out empty subsystems
        continue;
      }
      if (
        this.filter !== ''
        && !subsystem.methods.length
        && !subsystem.services.length
      ) {
        // Subsystem without methods and services
        if (subsystem.fullSubsystemName.toLowerCase().indexOf(this.filter.toLowerCase()) < 0) {
          // Subsystem name does not match the filter
          continue;
        }
      } else if (this.filter !== '') {
        // Subsystem with methods and/or services
        const filteredMethods: Method[] = [];
        for (const method of subsystem.methods) {
          if (method.fullMethodName.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0) {
            filteredMethods.push(method);
          }
        }
        const filteredServices: Service[] = [];
        for (const service of subsystem.services) {
          if (service.fullServiceName.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0) {
            filteredServices.push(service);
          }
        }
        if (!filteredMethods.length && !filteredServices.length) {
          // No matching method and/or services names found
          continue;
        }
        // Copy object to avoid overwriting methods array in subsystem object
        subsystem = Object.assign(Object.create(subsystem), subsystem);
        // Leaving only matcing methods and services
        subsystem.methods = filteredMethods;
        subsystem.services = filteredServices;
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
      if (!subsystem.servicesStatus) {
        // Fix missing data in previous versions
        subsystem.servicesStatus = 'ERROR';
      }
      if (!subsystem.services) {
        // Fix missing data in previous versions
        subsystem.services = [];
      }
      for (const service of subsystem.services) {
        service.fullServiceName = subsystem.fullSubsystemName
        + '/' + service.serviceCode;
      }
    }
    return subsystems;
  }

  private emitWarning(msg: string) {
    this.warnings.emit(msg);
  }

  private updateFiltered() {
    this.filteredSubsystemsSubject.next(this.filteredSubsystems());
  }
}
