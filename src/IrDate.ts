import { DateTime, ILocale } from "@vesta/culture";
import { IrLocale } from "./IrLocale";

declare function parseInt(s: string | number, radix?: number): number;

export class IrDate extends DateTime {
    public locale: ILocale = IrLocale;
    private gregorianDate: Date;
    private gregorianDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    private persianDaysInMonth: Array<number> = IrLocale.daysInMonth;

    // constructor();
    // constructor(value:number);
    // constructor(value:string);
    // constructor(year:number, month:number, date?:number, hours?:number, minutes?:number, seconds?:number, ms?:number);
    // constructor(year?:number, month?:number, date?:number, hours?:number, minutes?:number, seconds?:number, ms?:number){}
    constructor() {
        super();
        this.gregorianDate = new Date();
    }

    public getDate(): number {
        const gd = this.gregorianDate.getDate();
        const gm = this.gregorianDate.getMonth();
        const gy = this.gregorianDate.getFullYear();
        const j = this.toPersian(gy, gm, gd);
        return j[2];
    }

    public getDay(): number {
        let day = this.gregorianDate.getDay();
        day = (day + 1) % 7;
        return day;
    }

    public getFullYear(): number {
        const gd = this.gregorianDate.getDate();
        const gm = this.gregorianDate.getMonth();
        const gy = this.gregorianDate.getFullYear();
        const j = this.toPersian(gy, gm, gd);
        return j[0];
    }

    public getHours(): number {
        return this.gregorianDate.getHours();
    }

    public getMinutes(): number {
        return this.gregorianDate.getMinutes();
    }

    public getMonth(): number {
        const gd = this.gregorianDate.getDate();
        const gm = this.gregorianDate.getMonth();
        const gy = this.gregorianDate.getFullYear();
        const j = this.toPersian(gy, gm, gd);
        return j[1];
    }

    public getSeconds(): number {
        return this.gregorianDate.getSeconds();
    }

    public getTime(): number {
        return this.gregorianDate.getTime();
    }

    public setDate(d: number) {
        const gd = this.gregorianDate.getDate();
        const gm = this.gregorianDate.getMonth();
        const gy = this.gregorianDate.getFullYear();
        const j = this.toPersian(gy, gm, gd);
        j[2] = d;
        const g = this.toGregorian(j[0], j[1], j[2]);
        return this.gregorianDate.setFullYear(g[0], g[1], g[2]);
    }

    // 0 <= mount <= 11
    public setFullYear(year: number, month?: number, date?: number) {
        const persianDate = this.toPersian(this.gregorianDate.getFullYear(), this.gregorianDate.getMonth(), this.gregorianDate.getDate());
        if (year < 100) { year += 1300; }
        persianDate[0] = year;
        if (month != undefined) {
            if (month > 11) {
                persianDate[0] += Math.floor(month / 12);
                month = month % 12;
            }
            persianDate[1] = month;
        }
        if (date != undefined) {
            persianDate[2] = date;
        }
        const g = this.toGregorian(persianDate[0], persianDate[1], persianDate[2]);
        return this.gregorianDate.setFullYear(g[0], g[1], g[2]);
    }

    public setHours(hour: number, minute?: number, second?: number): number {
        minute = isNaN(minute as number) ? this.gregorianDate.getMinutes() : minute;
        second = isNaN(second as number) ? this.gregorianDate.getSeconds() : second;
        return this.gregorianDate.setHours(hour, minute, second);
    }

    public setMinutes(minute: number, second?: number): number {
        second = isNaN(second as number) ? this.gregorianDate.getSeconds() : second;
        return this.gregorianDate.setMinutes(minute, second);
    }

    // 0 <= mount <= 11
    public setMonth(month: number, date?: number) {
        const gd = this.gregorianDate.getDate();
        const gm = this.gregorianDate.getMonth();
        const gy = this.gregorianDate.getFullYear();
        const j = this.toPersian(gy, gm, gd);
        if (month > 11) {
            j[0] += Math.floor(month / 12);
            month = month % 12;
        }
        j[1] = month;
        if (date != undefined) { j[2] = date; }
        const g = this.toGregorian(j[0], j[1], j[2]);
        return this.gregorianDate.setFullYear(g[0], g[1], g[2]);
    }

    public setSeconds(second: number): number {
        return this.gregorianDate.setSeconds(second);
    }

    public setTime(time: number): number {
        return this.gregorianDate.setTime(time);
    }

    // 0 <= mount <= 11, 1<= day <= 31
    public toGregorian(year: number, month: number, day: number): Array<number> {
        const jy: number = year - 979;
        const jm: number = month;
        const jd: number = day - 1;

        let jalaliDayNo = 365 * jy + parseInt(jy / 33, 10) * 8 + parseInt((jy % 33 + 3) / 4, 10);
        for (let i = 0; i < jm; ++i) { jalaliDayNo += this.persianDaysInMonth[i]; }

        jalaliDayNo += jd;

        let gregorianDayNo = jalaliDayNo + 79;

        let gy = 1600 + 400 * parseInt(gregorianDayNo / 146097, 10);
        /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
        gregorianDayNo = gregorianDayNo % 146097;

        let leap = true;
        if (gregorianDayNo >= 36525) {
            gregorianDayNo--;
            gy += 100 * parseInt(gregorianDayNo / 36524, 10);
            /* 36524 = 365*100 + 100/4 - 100/100 */
            gregorianDayNo = gregorianDayNo % 36524;

            if (gregorianDayNo >= 365) {
                gregorianDayNo++;
            } else {
                leap = false;
            }
        }

        gy += 4 * parseInt(gregorianDayNo / 1461, 10);
        /* 1461 = 365*4 + 4/4 */
        gregorianDayNo %= 1461;

        if (gregorianDayNo >= 366) {
            leap = false;

            gregorianDayNo--;
            gy += parseInt(gregorianDayNo / 365, 10);
            gregorianDayNo = gregorianDayNo % 365;
        }
        let j = 0;
        for (; gregorianDayNo >= this.gregorianDaysInMonth[j] + (j == 1 && leap ? 1 : 0); j++) {
            gregorianDayNo -= this.gregorianDaysInMonth[j] + (j == 1 && leap ? 1 : 0);
        }
        // const gm = j;
        // const gd = gregorianDayNo + 1;

        return [gy, j, gregorianDayNo + 1];
    }

    // 0 <= mount <= 11, 1<= day <= 31
    public toPersian(year: number, month: number, day: number) {
        const gy = year - 1600;
        const gm = month;
        const gd = day - 1;

        let gregorianDayNo = 365 * gy + parseInt((gy + 3) / 4, 10) - parseInt((gy + 99) / 100, 10) + parseInt((gy + 399) / 400, 10);

        for (let i = 0; i < gm; ++i) {
            gregorianDayNo += this.gregorianDaysInMonth[i];
        }
        if (gm > 1 && ((gy % 4 == 0 && gy % 100 != 0) || (gy % 400 == 0))) {
            /* leap and after Feb */
            ++gregorianDayNo;
        }
        gregorianDayNo += gd;

        let jalaliDayNo = gregorianDayNo - 79;

        const jnp = parseInt(jalaliDayNo / 12053, 10);
        jalaliDayNo %= 12053;

        let jy = 979 + 33 * jnp + 4 * parseInt(jalaliDayNo / 1461, 10);

        jalaliDayNo %= 1461;

        if (jalaliDayNo >= 366) {
            jy += parseInt((jalaliDayNo - 1) / 365, 10);
            jalaliDayNo = (jalaliDayNo - 1) % 365;
        }
        let j = 0;
        for (; j < 11 && jalaliDayNo >= this.persianDaysInMonth[j]; ++j) {
            jalaliDayNo -= this.persianDaysInMonth[j];
        }
        // const jm = j;
        // const jd = jalaliDayNo + 1;

        return [jy, j, jalaliDayNo + 1];
    }

    public valueOf(): number {
        return this.gregorianDate.getTime();
    }

    // 0 <= mount <= 11
    protected validateLocale(year: number, month: number, day: number): boolean {
        const result = this.checkDate(year, month, day);
        if (result) {
            this.setFullYear(year, month, day);
            return true;
        }
        return false;
    }

    // 0 <= mount <= 11
    private checkDate(year: number, month: number, day: number): boolean {
        let dayOffset = 0;
        if (month == 11 && (year - 979) % 33 % 4) {
            dayOffset = 1;
        }
        return !(year < 0 || year > 32767 ||
            month < 1 || month > 11 ||
            day < 1 || day > (this.persianDaysInMonth[month - 1] + dayOffset));
    }
}
