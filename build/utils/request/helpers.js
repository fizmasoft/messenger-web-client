// import type { AxiosRequestConfig } from 'axios';
// // import { useAuthStore } from '@/store';
// import { localStg } from '@/utils';
// import { request } from '.';
// /**
//  * Refresh token
//  * @param axiosConfig - Request configuration when token expires
//  */
// export async function handleRefreshToken(axiosConfig: AxiosRequestConfig) {
//   // const { resetAuthStore } = useAuthStore();
//   const token = localStg.get('token');
//   if (!token) {
//     return null;
//   }
//   const { data } = await request.get<IToken>(token.refresh);
//   if (!data) {
//     // resetAuthStore();
//     return null;
//   }
//   localStg.set('token', {
//     access: data.accessToken,
//     refresh: token.refresh,
//   });
//   const config = { ...axiosConfig };
//   if (config.headers) {
//     config.headers.Authorization = `Bearer ${data.accessToken}`;
//   }
//   return config;
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9yZXF1ZXN0L2hlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsbURBQW1EO0FBQ25ELDZDQUE2QztBQUM3QyxzQ0FBc0M7QUFDdEMsK0JBQStCO0FBRS9CLE1BQU07QUFDTixtQkFBbUI7QUFDbkIsbUVBQW1FO0FBQ25FLE1BQU07QUFDTiw4RUFBOEU7QUFDOUUsa0RBQWtEO0FBQ2xELHlDQUF5QztBQUN6QyxrQkFBa0I7QUFDbEIsbUJBQW1CO0FBQ25CLE1BQU07QUFFTiwrREFBK0Q7QUFDL0QsaUJBQWlCO0FBQ2pCLDJCQUEyQjtBQUUzQixtQkFBbUI7QUFDbkIsTUFBTTtBQUVOLDRCQUE0QjtBQUM1QixnQ0FBZ0M7QUFDaEMsOEJBQThCO0FBQzlCLFFBQVE7QUFFUix1Q0FBdUM7QUFDdkMsMEJBQTBCO0FBQzFCLG1FQUFtRTtBQUNuRSxNQUFNO0FBRU4sbUJBQW1CO0FBQ25CLElBQUkiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgdHlwZSB7IEF4aW9zUmVxdWVzdENvbmZpZyB9IGZyb20gJ2F4aW9zJztcbi8vIC8vIGltcG9ydCB7IHVzZUF1dGhTdG9yZSB9IGZyb20gJ0Avc3RvcmUnO1xuLy8gaW1wb3J0IHsgbG9jYWxTdGcgfSBmcm9tICdAL3V0aWxzJztcbi8vIGltcG9ydCB7IHJlcXVlc3QgfSBmcm9tICcuJztcblxuLy8gLyoqXG4vLyAgKiBSZWZyZXNoIHRva2VuXG4vLyAgKiBAcGFyYW0gYXhpb3NDb25maWcgLSBSZXF1ZXN0IGNvbmZpZ3VyYXRpb24gd2hlbiB0b2tlbiBleHBpcmVzXG4vLyAgKi9cbi8vIGV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVSZWZyZXNoVG9rZW4oYXhpb3NDb25maWc6IEF4aW9zUmVxdWVzdENvbmZpZykge1xuLy8gICAvLyBjb25zdCB7IHJlc2V0QXV0aFN0b3JlIH0gPSB1c2VBdXRoU3RvcmUoKTtcbi8vICAgY29uc3QgdG9rZW4gPSBsb2NhbFN0Zy5nZXQoJ3Rva2VuJyk7XG4vLyAgIGlmICghdG9rZW4pIHtcbi8vICAgICByZXR1cm4gbnVsbDtcbi8vICAgfVxuXG4vLyAgIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgcmVxdWVzdC5nZXQ8SVRva2VuPih0b2tlbi5yZWZyZXNoKTtcbi8vICAgaWYgKCFkYXRhKSB7XG4vLyAgICAgLy8gcmVzZXRBdXRoU3RvcmUoKTtcblxuLy8gICAgIHJldHVybiBudWxsO1xuLy8gICB9XG5cbi8vICAgbG9jYWxTdGcuc2V0KCd0b2tlbicsIHtcbi8vICAgICBhY2Nlc3M6IGRhdGEuYWNjZXNzVG9rZW4sXG4vLyAgICAgcmVmcmVzaDogdG9rZW4ucmVmcmVzaCxcbi8vICAgfSk7XG5cbi8vICAgY29uc3QgY29uZmlnID0geyAuLi5heGlvc0NvbmZpZyB9O1xuLy8gICBpZiAoY29uZmlnLmhlYWRlcnMpIHtcbi8vICAgICBjb25maWcuaGVhZGVycy5BdXRob3JpemF0aW9uID0gYEJlYXJlciAke2RhdGEuYWNjZXNzVG9rZW59YDtcbi8vICAgfVxuXG4vLyAgIHJldHVybiBjb25maWc7XG4vLyB9XG4iXX0=