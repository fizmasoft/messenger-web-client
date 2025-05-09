const correctDate = (num) => (num < 10 ? `0${num}` : num);
/**
 *
 * @param date
 * @param separator default '-'
 * @returns  date string e.g: YYYY-MM-DD
 */
export function getDateYYYYMMDD(date, separator = '-') {
    return `${date.getFullYear()}${separator}${correctDate(date.getMonth() + 1)}${separator}${correctDate(date.getDate())}`;
}
export function getDateMMDDYYYY(date, separator = '-') {
    date = new Date(date);
    return `${correctDate(date.getMonth() + 1)}${separator}${correctDate(date.getDate())}${separator}${date.getFullYear()}`;
}
export function getDateDDMMYYYY(date, separator = '-') {
    return `${correctDate(date.getDate())}${separator}${correctDate(date.getMonth() + 1)}${separator}${date.getFullYear()}`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1mb3JtYXR0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbW9uL3V0aWxpdHkvZGF0ZS1mb3JtYXR0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxXQUFXLEdBQUcsQ0FBQyxHQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFFbEU7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsZUFBZSxDQUFDLElBQVUsRUFBRSxTQUFTLEdBQUcsR0FBRztJQUN6RCxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLFNBQVMsR0FBRyxXQUFXLENBQ3BELElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQ3BCLEdBQUcsU0FBUyxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDO0FBQ2hELENBQUM7QUFFRCxNQUFNLFVBQVUsZUFBZSxDQUFDLElBQW1CLEVBQUUsU0FBUyxHQUFHLEdBQUc7SUFDbEUsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RCLE9BQU8sR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLFNBQVMsR0FBRyxXQUFXLENBQ2xFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FDZixHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQztBQUN2QyxDQUFDO0FBRUQsTUFBTSxVQUFVLGVBQWUsQ0FBQyxJQUFVLEVBQUUsU0FBUyxHQUFHLEdBQUc7SUFDekQsT0FBTyxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxTQUFTLEdBQUcsV0FBVyxDQUM3RCxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUNwQixHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQztBQUN2QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgY29ycmVjdERhdGUgPSAobnVtOiBudW1iZXIpID0+IChudW0gPCAxMCA/IGAwJHtudW19YCA6IG51bSk7XHJcblxyXG4vKipcclxuICpcclxuICogQHBhcmFtIGRhdGVcclxuICogQHBhcmFtIHNlcGFyYXRvciBkZWZhdWx0ICctJ1xyXG4gKiBAcmV0dXJucyAgZGF0ZSBzdHJpbmcgZS5nOiBZWVlZLU1NLUREXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGF0ZVlZWVlNTUREKGRhdGU6IERhdGUsIHNlcGFyYXRvciA9ICctJyk6IHN0cmluZyB7XHJcbiAgcmV0dXJuIGAke2RhdGUuZ2V0RnVsbFllYXIoKX0ke3NlcGFyYXRvcn0ke2NvcnJlY3REYXRlKFxyXG4gICAgZGF0ZS5nZXRNb250aCgpICsgMSxcclxuICApfSR7c2VwYXJhdG9yfSR7Y29ycmVjdERhdGUoZGF0ZS5nZXREYXRlKCkpfWA7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXREYXRlTU1ERFlZWVkoZGF0ZTogRGF0ZSB8IHN0cmluZywgc2VwYXJhdG9yID0gJy0nKTogc3RyaW5nIHtcclxuICBkYXRlID0gbmV3IERhdGUoZGF0ZSk7XHJcbiAgcmV0dXJuIGAke2NvcnJlY3REYXRlKGRhdGUuZ2V0TW9udGgoKSArIDEpfSR7c2VwYXJhdG9yfSR7Y29ycmVjdERhdGUoXHJcbiAgICBkYXRlLmdldERhdGUoKSxcclxuICApfSR7c2VwYXJhdG9yfSR7ZGF0ZS5nZXRGdWxsWWVhcigpfWA7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXREYXRlRERNTVlZWVkoZGF0ZTogRGF0ZSwgc2VwYXJhdG9yID0gJy0nKTogc3RyaW5nIHtcclxuICByZXR1cm4gYCR7Y29ycmVjdERhdGUoZGF0ZS5nZXREYXRlKCkpfSR7c2VwYXJhdG9yfSR7Y29ycmVjdERhdGUoXHJcbiAgICBkYXRlLmdldE1vbnRoKCkgKyAxLFxyXG4gICl9JHtzZXBhcmF0b3J9JHtkYXRlLmdldEZ1bGxZZWFyKCl9YDtcclxufVxyXG4iXX0=