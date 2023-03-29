import axios from 'axios';
import { token, getToken } from './util';
import { addPendingRequest, deletePendingRequest } from './preventRepeatedHttp';

const instance = axios.create({
  baseURL: 'api'
})

instance.interceptors.request.use(async config => {
  let headerToken = token;
  if (headerToken) {
    console.log('token已存在', headerToken);
  } else {
    console.log('token不存在, 发起请求');
    headerToken = await getToken();
  }
  addPendingRequest(config);
  config.headers.token = headerToken;

  return config;
})

instance.interceptors.response.use(res => {
  deletePendingRequest(res.config);
  return res.data;
}, error => {
  if (axios.isCancel(error)) {
    console.log('此请求被取消', error);
  }
  return Promise.reject(error);
})

export const getTabs = () => instance.get('/tabs');

export const getNewsList = () => instance.get('/news/list');