import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from './config';

@Injectable()
export class AppConfig {
    private http = inject(HttpClient);

    private config!: Config;

    public getConfig<K extends keyof Config>(key: K): Config[K] {
        return this.config[key];
    }

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
