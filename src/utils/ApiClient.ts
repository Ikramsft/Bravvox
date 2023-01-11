import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import {userLogout} from '../redux/reducers/user/UserActions';
import {refreshAccessToken} from '../redux/reducers/user/UserServices';
import {store} from '../redux/store';

let isAlreadyFetchingAccessToken = false;
let subscribers: any[] = [];

function onAccessTokenFetched(accessToken: string) {
  subscribers = subscribers.filter(callback => callback(accessToken));
}

function addSubscriber(callback: (access_token: any) => void) {
  subscribers.push(callback);
}

const client = axios.create({
  headers: {'Content-Type': 'application/json'},
});

const AUTH_ROUTES = ['login', 'register', 'check-username']; // , 'access-token'

client.interceptors.request.use(
  (request: AxiosRequestConfig<any>) => {
    const authRoutes = AUTH_ROUTES.some(i => request?.url?.includes(i));
    const {token} = store.getState().user;
    if (!authRoutes && request.headers) {
      request.headers.Authorization = `${token}`;
    }
    return request;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

client.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data.error) {
      return Promise.reject(response.data);
    }
    return Promise.resolve(response.data);
  },
  async (error: AxiosError) => {
    if (error?.config?.url?.includes('access-token')) {
      store.dispatch(userLogout());
      return Promise.reject(error.response?.data);
    }
    if (error.response?.status === 401) {
      const originalRequest = error.config;
      const authRoutes = AUTH_ROUTES.some(i => error.config?.url?.includes(i));
      if (!authRoutes) {
        try {
          const retryOriginalRequest = new Promise(resolve => {
            addSubscriber(accessToken => {
              if (originalRequest?.headers) {
                originalRequest.headers.Authorization = accessToken;
              }
              resolve(client(originalRequest));
            });
          });

          if (!isAlreadyFetchingAccessToken) {
            isAlreadyFetchingAccessToken = true;
            await store.dispatch(refreshAccessToken());
            // await delay();
            const {token: newToken} = store.getState().user;
            isAlreadyFetchingAccessToken = false;
            onAccessTokenFetched(newToken);
          }

          return retryOriginalRequest;
        } catch (error1: any) {
          store.dispatch(userLogout());
        }
      }
    }
    return Promise.reject(error.response?.data);
  },
);

export default client;
