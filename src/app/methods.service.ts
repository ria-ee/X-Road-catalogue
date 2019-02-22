import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Subsystem } from './subsystem';

@Injectable({
  providedIn: 'root'
})
export class MethodsService {

  //private apiUrlBase = 'https://www.x-tee.ee/catalogue/EE/wsdls/';
  public apiUrlBase = 'http://localhost/';
  private limit: number = 15;
  private offset: number = 0;
  private apiService = 'index.json';
  private apiUrl = this.apiUrlBase + this.apiService;
  private subsystems: Subsystem[];

  @Output() subsystemsUpdated: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient) {
    this.http.get<Subsystem[]>(this.apiUrl)
    .pipe(
      catchError(this.handleError('getMethods', []))
    ).subscribe(subsystems => {
      this.subsystems = subsystems;
      this.signalRefresh();
    })
  }

  private signalRefresh() {
    this.subsystemsUpdated.emit(null);
  }

  private filtered(data: Subsystem[]): Subsystem[] {
    return data.slice(this.offset, this.limit);
  }

  getMethods(): Subsystem[] {
    return this.filtered(this.subsystems);
  }

  filterNonEmpty(checked: boolean) {
    console.log(checked)
    if (checked) {
      this.limit = 5;
    } else {
      this.limit = 10;
    }
    this.signalRefresh();
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
