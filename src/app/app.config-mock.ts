import { Injectable } from '@angular/core';
import { AppConfig } from './app.config';

@Injectable()
export class AppConfigMock extends AppConfig {
    private configMock: any = {
        MAX_LIMIT: 1000000,
        DEFAULT_LIMIT: 10,
        INSTANCES: {
            EE: 'https://www.x-tee.ee/catalogue/EE/wsdls/',
            'ee-test': 'https://www.x-tee.ee/catalogue/ee-test/wsdls/',
            'ee-dev': 'https://www.x-tee.ee/catalogue/ee-dev/wsdls/'
        },
        API_SERVICE: 'index.json',
        LANGUAGES: {
            EST: 'est',
            ENG: 'eng'
        },
        PREVIEW_SIZE: 5,
        FILTER_DEBOUNCE: 200
    };

    public getConfig(key: any) {
        return this.configMock[key];
    }
}
