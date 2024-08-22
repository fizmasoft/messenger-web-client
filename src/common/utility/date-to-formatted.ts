export function formatDate(date: Date): IFormattedDate {
  const locale = 'uz-UZ';

  return {
    date: date,
    iso: date.toISOString(),
    hh_mm: date.toLocaleString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
    hh_mm_ss: date.toLocaleString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }),
    YYYY_MM_DD: date.toLocaleString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
    YYYY_MM_DD_hh_mm_ss: date.toLocaleString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }),
  };
}

Date.prototype.toFormatted = function () {
  return formatDate(this as Date);
};

export { };

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
