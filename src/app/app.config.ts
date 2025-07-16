import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from './config';

@Injectable()
export class AppConfig {
    private http = inject(HttpClient);

    private config: Config = null;

    /**
     * Use to get the data found in the config file
     */
    public getConfig(key: string) {
        return this.config[key];
    }

    /**
     * This method loads "config.json" to get all configuration variables
     */
    public load() {
        return new Promise(resolve => {
            // Not handling errors. App cannot work without valid configuration
            this.http.get<Config>('./assets/config.json')
            .subscribe(responseData => {
                this.config = responseData;
                resolve(true);
            });

        });
    }
}
