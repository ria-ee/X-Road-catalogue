import { Injectable } from '@angular/core';
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
  private apiService = 'index.json';
  private apiUrl = this.apiUrlBase + this.apiService;
  private subsystems: Subsystem[];
  private observable: Observable<Subsystem[]>;

  constructor(private http: HttpClient) {
    this.observable = this.http.get<Subsystem[]>(this.apiUrl)
    .pipe(
      catchError(this.handleError('getMethods', []))
    );
    this.observable.subscribe(subsystems => this.subsystems = subsystems);
  }

  getMethods (): Observable<Subsystem[]> {
    if (this.subsystems) {
      return of(this.subsystems)
    } else {
      return this.observable;
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
