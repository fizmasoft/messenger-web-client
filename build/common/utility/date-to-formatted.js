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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS10by1mb3JtYXR0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbW9uL3V0aWxpdHkvZGF0ZS10by1mb3JtYXR0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUc7SUFDM0IsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDO0lBRXZCLE9BQU87UUFDTCxRQUFRLEVBQUUsSUFBSTtRQUNkLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFO1FBQ3ZCLElBQUksRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRTtZQUNoQyxJQUFJLEVBQUUsU0FBUztZQUNmLE1BQU0sRUFBRSxTQUFTO1lBQ2pCLE1BQU0sRUFBRSxLQUFLO1NBQ2QsQ0FBQztRQUNGLElBQUksRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRTtZQUNoQyxHQUFHLEVBQUUsU0FBUztZQUNkLEtBQUssRUFBRSxTQUFTO1lBQ2hCLElBQUksRUFBRSxTQUFTO1NBQ2hCLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQztRQUN0QixTQUFTLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUU7WUFDckMsSUFBSSxFQUFFLFNBQVM7WUFDZixLQUFLLEVBQUUsU0FBUztZQUNoQixHQUFHLEVBQUUsU0FBUztZQUNkLElBQUksRUFBRSxTQUFTO1lBQ2YsTUFBTSxFQUFFLFNBQVM7WUFDakIsTUFBTSxFQUFFLFNBQVM7WUFDakIsTUFBTSxFQUFFLEtBQUs7U0FDZCxDQUFDO2FBQ0MsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUM7YUFDbkIsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUM7S0FDdEIsQ0FBQztBQUNKLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIkRhdGUucHJvdG90eXBlLnRvRm9ybWF0dGVkID0gZnVuY3Rpb24gKCkge1xyXG4gIGNvbnN0IGxvY2FsZSA9ICd1ei1VWic7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBvcmlnaW5hbDogdGhpcyxcclxuICAgIGlzbzogdGhpcy50b0lTT1N0cmluZygpLFxyXG4gICAgdGltZTogdGhpcy50b0xvY2FsZVN0cmluZyhsb2NhbGUsIHtcclxuICAgICAgaG91cjogJzItZGlnaXQnLFxyXG4gICAgICBtaW51dGU6ICcyLWRpZ2l0JyxcclxuICAgICAgaG91cjEyOiBmYWxzZSxcclxuICAgIH0pLFxyXG4gICAgZGF0ZTogdGhpcy50b0xvY2FsZVN0cmluZyhsb2NhbGUsIHtcclxuICAgICAgZGF5OiAnMi1kaWdpdCcsXHJcbiAgICAgIG1vbnRoOiAnMi1kaWdpdCcsXHJcbiAgICAgIHllYXI6ICdudW1lcmljJyxcclxuICAgIH0pLnJlcGxhY2UoL1xcLy9nLCAnLicpLFxyXG4gICAgZm9ybWF0dGVkOiB0aGlzLnRvTG9jYWxlU3RyaW5nKGxvY2FsZSwge1xyXG4gICAgICB5ZWFyOiAnbnVtZXJpYycsXHJcbiAgICAgIG1vbnRoOiAnMi1kaWdpdCcsXHJcbiAgICAgIGRheTogJzItZGlnaXQnLFxyXG4gICAgICBob3VyOiAnMi1kaWdpdCcsXHJcbiAgICAgIG1pbnV0ZTogJzItZGlnaXQnLFxyXG4gICAgICBzZWNvbmQ6ICcyLWRpZ2l0JyxcclxuICAgICAgaG91cjEyOiBmYWxzZSxcclxuICAgIH0pXHJcbiAgICAgIC5yZXBsYWNlKC9cXC8vZywgJy0nKVxyXG4gICAgICAucmVwbGFjZSgvXFwsL2csICcnKSxcclxuICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IHt9O1xyXG5cclxuZGVjbGFyZSBnbG9iYWwge1xyXG4gIGludGVyZmFjZSBJRm9ybWF0dGVkRGF0ZSB7XHJcbiAgICBvcmlnaW5hbDogc3RyaW5nO1xyXG4gICAgaXNvOiBzdHJpbmc7XHJcbiAgICB0aW1lOiBzdHJpbmc7XHJcbiAgICBkYXRlOiBzdHJpbmc7XHJcbiAgICBmb3JtYXR0ZWQ6IHN0cmluZztcclxuICB9XHJcblxyXG4gIGludGVyZmFjZSBEYXRlIHtcclxuICAgIHRvRm9ybWF0dGVkOiAoKSA9PiBJRm9ybWF0dGVkRGF0ZTtcclxuICB9XHJcbn1cclxuIl19