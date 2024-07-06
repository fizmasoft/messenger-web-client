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

//   const { data } = await request.get<ApiAuth.IToken>(token.refresh);
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
