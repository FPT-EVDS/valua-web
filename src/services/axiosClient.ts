import axios, { AxiosError } from 'axios';

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

const responseInterceptor = axiosClient.interceptors.response.use(
  response => response,
  async (errorResponse: AxiosError) => {
    if (errorResponse.response?.status !== 401)
      return Promise.reject(errorResponse);
    axios.interceptors.response.eject(responseInterceptor);
    const refreshToken = localStorage.getItem('refresh_token');
    try {
      if (refreshToken) {
        const response = await axiosClient.get('/authentication/refreshToken', {
          headers: {
            refreshToken,
          },
        });
        const { token } = response.data;
        localStorage.setItem('access_token', token);
        errorResponse.response.config.headers.Authorization = `Bearer ${String(
          token,
        )}`;
      }
    } catch (error) {
      return Promise.reject(error);
    }
    return axiosClient(errorResponse.response.config);
  },
);

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
