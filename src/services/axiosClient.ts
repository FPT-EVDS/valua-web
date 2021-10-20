import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'content-type': 'application/json',
  },
});

axiosClient.interceptors.request.use(async config => {
  const customHeaders: Record<string, unknown> = {};

  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    customHeaders.Authorization = `Bearer ${String(accessToken)}`;
  }

  return {
    ...config,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    headers: {
      ...customHeaders, // auto attach token
      ...config.headers, // but you can override for some requests
    },
  };
});

const refreshAuthLogic = async (failedRequest: {
  response: { config: { headers: { [x: string]: string } } };
}) => {
  const refreshToken = localStorage.getItem('refresh_token');
  try {
    const response = await axiosClient.get('/authentication/refreshToken', {
      headers: {
        refreshToken,
      },
    });
    const { token } = response.data;
    localStorage.setItem('access_token', token);
    failedRequest.response.config.headers.Authorization = `Bearer ${String(
      token,
    )}`;
    return await Promise.resolve();
  } catch (error) {
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('access_token');
    return await Promise.reject(error);
  }
};

createAuthRefreshInterceptor(axiosClient, refreshAuthLogic);

// HOW TO CALL EXTERNAL API

// const getExternalApi = () => {
//   const url = '/resource-name';
//   const config = {
//     baseURL: 'https://your-new-base-api-url.com/api',
//     headers: {
//       Authorization: 'your-new-token-to-use-in-new-api',
//     },
//   };

//   return axiosClient.get(url, config);
// };

export default axiosClient;
