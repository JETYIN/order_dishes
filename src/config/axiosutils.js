import axios from 'axios'
import { baseUrl } from './env'
import { Message } from 'element-ui';
import router from '../router';

export const service = axios.create({
  baseURL: baseUrl,
  timeout: 5000 //请求超时时间
});

// 添加请求拦截器，如果当前保存的用户token不为空，在请求头中加token
service.interceptors.request.use(
  config => {
    if (localStorage.getItem('Authorization')) {
      config.headers.Authorization = localStorage.getItem('Authorization');

    }
    return config;
  },
  error => {
    Message.error({ message: '请求超时!' });
  });


//添加返回请求拦截器，当后端返回401时需要重新进行登录授权
service.interceptors.response.use(data => {
  
  if (data.status && data.status == 200 && data.data.status == 500) {
    Message.error({ message: data.data.msg });
    return;
  }
  if (data.data.msg) {
    //Message.success({ message: data.data.msg });
  }
  return data;
}, err => {
  if (err.response.status == 504 || err.response.status == 404) {
    Message.error({ message: '服务器被吃了⊙﹏⊙∥' });
  } else if (err.response.status == 403) {
    Message.error({ message: '权限不足,请联系管理员!' });
  } else if (err.response.status == 401) {
    Message.error({ message: err.response.data.msg });
    //后端请求返回401未授权需要跳转到登录界面进行重新授权操作

    localStorage.removeItem('Authorization');

    router.replace({
      path: '/',
      query: { redirect: router.currentRoute.fullPath }//登录成功后跳入浏览的当前页面  
    })

  } else {
    if (err.response.data.msg) {
      Message.error({ message: err.response.data.msg });
    } else {
      Message.error({ message: '未知错误!' });
    }
  }
  //return Promise.resolve(err);
});


export const postRequest = (url, params) => {

  return service({
    method: 'post',
    url: url,
    params: {},
    data: params,
    transformRequest: [function (data) {
      data = JSON.stringify(data)
      return data
    }],
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  });
}

//end
export const getRequest = (url) => {

  return service({
    method: 'get',
    url: url

  });
}

export const uploadFileRequest = (url, params) => {
  return service({
    method: 'post',
    url: url,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
export const putRequest = (url, params) => {
  return service({
    method: 'put',
    url: url,
    params: {},
    data: params,
    transformRequest: [function (data) {
      data = JSON.stringify(data)
      return data
    }],
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  });
}
export const deleteRequest = (url, params) => {
  return service({
    method: 'delete',
    url: url,
    params: {},
    data: params,
    transformRequest: [function (data) {
      data = JSON.stringify(data)
      return data
    }],
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  });
}

