import Axios, { AxiosRequestConfig, Canceler } from 'axios';
import { deepMerge } from './utils';
import { Observable } from 'rxjs';
import { queryString } from './query';

const baseUrl = '/';

const defaultAxiosConf = {
  timeout: 15000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  },
  baseURL: baseUrl
};

export function http(params: AxiosRequestConfig): Observable<any> {
  return new Observable<any>(subscribe => {
    let cancel: Canceler;
    const config = deepMerge(defaultAxiosConf, params);
    config.cancelToken = new Axios.CancelToken(c => {
      cancel = c;
    });
    Axios(config).then(res => {
      subscribe.next(res.data);
      subscribe.complete();
    }).catch(error => {
      subscribe.error(error);
      subscribe.complete();
    });
    return {
      unsubscribe() {
        if (typeof cancel === 'function') { cancel('Cancel'); }
      }
    };
  });
}

export function get(url: string, params: { [prop: string]: any }): Observable<any> {
  return http({ method: 'get', url, data: params });
}

export function post(url: string, data: { [prop: string]: any }): Observable<any> {
  return http({ method: 'post', url, data: queryString(data) });
}

export function upload(url: string, form: FormData, params?: { [prop: string]: string }, cb?: (percent: number) => any): Observable<any> {
  return http({
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data;' },
    url,
    data: form,
    onUploadProgress(processEvent: any) {
      const percent = processEvent.loaded / processEvent.total * 100;
      if (typeof cb === 'function') {
        cb(percent);
      }
    }
  });
}
