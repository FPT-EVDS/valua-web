import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'content-type': 'application/json',
  },
});

axiosClient.interceptors.request.use(async config => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customHeaders: any = {};

  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    customHeaders.Authorization = accessToken;
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
