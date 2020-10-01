export class SearchCriteria {
    key: string;
    value: any;
    operation: string;

    constructor(key: string, value: any, operation: string) {
        this.key = key;
        this.value = value;
        this.operation = operation;
    }
}