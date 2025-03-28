export class Config {
    MAX_LIMIT: number;
    DEFAULT_LIMIT: number;
    LIMITS: Record<number, number>;
    INSTANCES: Record<string, string>;
    API_SERVICE: string;
    API_HISTORY: string;
    HISTORY_LIMIT: number;
    LANGUAGES: Record<string, string>;
    PREVIEW_SIZE: number;
    FILTER_DEBOUNCE: number;
}
