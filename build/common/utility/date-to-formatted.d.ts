export {};
declare global {
    interface IFormattedDate {
        original: string;
        iso: string;
        time: string;
        date: string;
        formatted: string;
    }
    interface Date {
        toFormatted: () => IFormattedDate;
    }
}
