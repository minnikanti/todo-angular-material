import { DatePipe } from '@angular/common';

export class DateHelper {

    static datePipe = new DatePipe('en-US');

    static getFormattedDate(date, format): string {
        return this.formatDate(date, format);
    }

    private static formatDate(date, format): string {    
        return this.datePipe.transform(date, format);
    }
}