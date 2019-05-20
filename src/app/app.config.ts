import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppConfig {
    private config: any = null;

    constructor(private http: HttpClient) { }

    /**
     * Use to get the data found in the config file
     */
    public getConfig(key: any) {
        return this.config[key];
    }

    /**
     * This method loads "config.json" to get all configuration variables
     */
    public load() {
        return new Promise(resolve => {
            // Not handling errors. App cannot work without valid configuration
            this.http.get<any>('./assets/config.json')
            .subscribe(responseData => {
                this.config = responseData;
                resolve(true);
            });

        });
    }
}
