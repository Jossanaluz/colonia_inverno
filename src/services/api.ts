import axios from 'axios';
import Config from '../Config';

const api = axios.create({
  baseURL: Config.urlAPI,
//   headers: {
//     'Access-Control-Allow-Origin': '*',
//  }
});

api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response.status === 401 || error.response.status === 403) {
      // localStorage.removeItem('@FALKENAUGE:token');
      // localStorage.removeItem('@FALKENAUGE:user');

      document.location = '/';
    }
    return Promise.reject(error);
  },
);

export const apiExterno = axios.create({});

export default api;
