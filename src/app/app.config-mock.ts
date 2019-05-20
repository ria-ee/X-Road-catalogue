import { Injectable } from '@angular/core';
import { AppConfig } from './app.config';

@Injectable()
export class AppConfigMock extends AppConfig {
    private configMock: any = {
        MAX_LIMIT: 1000000,
        DEFAULT_LIMIT: 10,
        LIMITS: {
            10: 10,
            20: 20,
            50: 50
        },
        INSTANCES: {
            EE: 'https://www.x-tee.ee/catalogue/EE/wsdls/',
            'ee-test': 'https://www.x-tee.ee/catalogue/ee-test/wsdls/',
            'ee-dev': 'https://www.x-tee.ee/catalogue/ee-dev/wsdls/'
        },
        API_SERVICE: 'index.json',
        API_HISTORY: 'history.json',
        HISTORY_LIMIT: 30,
        LANGUAGES: {
            EST: 'est',
            ENG: 'eng'
        },
        PREVIEW_SIZE: 5,
        // Smaller value for faster unit testing
        FILTER_DEBOUNCE: 20
    };

    public getConfig(key: any) {
        return this.configMock[key];
    }
}
