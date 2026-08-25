
import moment from "moment";

/**
 * Format date within Vietnam's timezone (GMT+7)
 */
export const dateFormat = (
    input: Date | string | number | number[],
    output = 'DD/MM/YYYY',
    targetTimezone = 7,
) => {
    if (!input) {
        return 'Invalid Date';
    }
    let dateUTC = new Date(input as string);
    if (dateUTC + '' === 'Invalid Date') {
        dateUTC = moment(input, ['YYYY-MM-DD', 'DD/MM/YYYY']).toDate();
        if (!moment(dateUTC).isValid()) {
            throw new Error(
                'Định dạng ngày không hợp lệ, phải là DD/MM/YYYY',
            );
        }
    }
    const currentZone = new Date().getTimezoneOffset();
    const offsetUTC: number = (targetTimezone * 60 + currentZone) * 60 * 1000;
    const timestampUTC: number = dateUTC.getTime() + offsetUTC;
    const convertedDate = new Date(timestampUTC).toISOString();

    const date = new Date(convertedDate as string);
    if (date + '' === 'Invalid Date') {
        return 'Invalid Date';
    }

    const D = date.getDate();
    const M = date.getMonth() + 1;
    const YYYY = date.getFullYear();
    const H = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    const A = H > 11 ? 'PM' : 'AM';
    const filter = {
        D,
        DD: ('0' + D).slice(-2),
        M,
        MM: ('0' + M).slice(-2),
        YYYY,
        YY: ('' + YYYY).slice(-2),
        H,
        HH: ('0' + H).slice(-2),
        h: H % 12,
        hh: ('0' + (H % 12)).slice(-2),
        m,
        mm: ('0' + m).slice(-2),
        s,
        ss: ('0' + s).slice(-2),
        A,
        a: A.toLowerCase(),
    };

    return output.replace(/[a-z]+/gi, (w) => filter[w]);
};

export const toSnakeCase = (str: string): string => {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .trim()
        .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
        .replace(/[\s\-]+/g, "_")
        .replace(/[^a-zA-Z0-9_]/g, "")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "")
        .toLowerCase() || "field";
};

export const DEFAULT_LIMIT_SIZE = 10;

export enum ORDER_DIRECTION {
    ASC = 'asc',
    DESC = 'desc',
}
