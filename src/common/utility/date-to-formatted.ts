Date.prototype.toFormatted = function () {
  const locale = 'uz-UZ';

  return {
    original: this,
    iso: this.toISOString(),
    time: this.toLocaleString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
    date: this.toLocaleString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(/\//g, '.'),
    formatted: this.toLocaleString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
      .replace(/\//g, '-')
      .replace(/\,/g, ''),
  };
};

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
