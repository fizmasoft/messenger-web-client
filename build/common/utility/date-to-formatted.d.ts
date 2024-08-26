export declare function formatDate(date: Date): IFormattedDate;
export {};
declare global {
    interface IFormattedDate {
        date: Date;
        iso: string;
        hh_mm: string;
        hh_mm_ss: string;
        YYYY_MM_DD: string;
        YYYY_MM_DD_hh_mm_ss: string;
    }
    interface Date {
        toFormatted: () => IFormattedDate;
    }
}
