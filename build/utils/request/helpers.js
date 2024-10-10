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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9yZXF1ZXN0L2hlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsbURBQW1EO0FBQ25ELDZDQUE2QztBQUM3QyxzQ0FBc0M7QUFDdEMsK0JBQStCO0FBRS9CLE1BQU07QUFDTixtQkFBbUI7QUFDbkIsbUVBQW1FO0FBQ25FLE1BQU07QUFDTiw4RUFBOEU7QUFDOUUsa0RBQWtEO0FBQ2xELHlDQUF5QztBQUN6QyxrQkFBa0I7QUFDbEIsbUJBQW1CO0FBQ25CLE1BQU07QUFFTiwrREFBK0Q7QUFDL0QsaUJBQWlCO0FBQ2pCLDJCQUEyQjtBQUUzQixtQkFBbUI7QUFDbkIsTUFBTTtBQUVOLDRCQUE0QjtBQUM1QixnQ0FBZ0M7QUFDaEMsOEJBQThCO0FBQzlCLFFBQVE7QUFFUix1Q0FBdUM7QUFDdkMsMEJBQTBCO0FBQzFCLG1FQUFtRTtBQUNuRSxNQUFNO0FBRU4sbUJBQW1CO0FBQ25CLElBQUkiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgdHlwZSB7IEF4aW9zUmVxdWVzdENvbmZpZyB9IGZyb20gJ2F4aW9zJztcclxuLy8gLy8gaW1wb3J0IHsgdXNlQXV0aFN0b3JlIH0gZnJvbSAnQC9zdG9yZSc7XHJcbi8vIGltcG9ydCB7IGxvY2FsU3RnIH0gZnJvbSAnQC91dGlscyc7XHJcbi8vIGltcG9ydCB7IHJlcXVlc3QgfSBmcm9tICcuJztcclxuXHJcbi8vIC8qKlxyXG4vLyAgKiBSZWZyZXNoIHRva2VuXHJcbi8vICAqIEBwYXJhbSBheGlvc0NvbmZpZyAtIFJlcXVlc3QgY29uZmlndXJhdGlvbiB3aGVuIHRva2VuIGV4cGlyZXNcclxuLy8gICovXHJcbi8vIGV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVSZWZyZXNoVG9rZW4oYXhpb3NDb25maWc6IEF4aW9zUmVxdWVzdENvbmZpZykge1xyXG4vLyAgIC8vIGNvbnN0IHsgcmVzZXRBdXRoU3RvcmUgfSA9IHVzZUF1dGhTdG9yZSgpO1xyXG4vLyAgIGNvbnN0IHRva2VuID0gbG9jYWxTdGcuZ2V0KCd0b2tlbicpO1xyXG4vLyAgIGlmICghdG9rZW4pIHtcclxuLy8gICAgIHJldHVybiBudWxsO1xyXG4vLyAgIH1cclxuXHJcbi8vICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCByZXF1ZXN0LmdldDxJVG9rZW4+KHRva2VuLnJlZnJlc2gpO1xyXG4vLyAgIGlmICghZGF0YSkge1xyXG4vLyAgICAgLy8gcmVzZXRBdXRoU3RvcmUoKTtcclxuXHJcbi8vICAgICByZXR1cm4gbnVsbDtcclxuLy8gICB9XHJcblxyXG4vLyAgIGxvY2FsU3RnLnNldCgndG9rZW4nLCB7XHJcbi8vICAgICBhY2Nlc3M6IGRhdGEuYWNjZXNzVG9rZW4sXHJcbi8vICAgICByZWZyZXNoOiB0b2tlbi5yZWZyZXNoLFxyXG4vLyAgIH0pO1xyXG5cclxuLy8gICBjb25zdCBjb25maWcgPSB7IC4uLmF4aW9zQ29uZmlnIH07XHJcbi8vICAgaWYgKGNvbmZpZy5oZWFkZXJzKSB7XHJcbi8vICAgICBjb25maWcuaGVhZGVycy5BdXRob3JpemF0aW9uID0gYEJlYXJlciAke2RhdGEuYWNjZXNzVG9rZW59YDtcclxuLy8gICB9XHJcblxyXG4vLyAgIHJldHVybiBjb25maWc7XHJcbi8vIH1cclxuIl19