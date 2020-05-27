import Axios from 'axios';
import {deepMerge} from './utils';
import {Observable} from 'rxjs';

const baseUrl = '/';

const defaultAxiosConf = {
  timeout: 15000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  baseURL: baseUrl
};

export function http(params: { [prop: string]: any } = {}): Observable<any> {
  return new Observable<any>(subscribe => {
    const source = Axios.CancelToken.source();
    Axios(deepMerge(defaultAxiosConf, params, {
      cancelToken: source
    })).then(res => {
      subscribe.next(res);
      subscribe.complete();
    }).catch(error => {
      if (!Axios.isCancel(error)) {
        subscribe.error(error);
      }
    })
    return { unsubscribe() { source.cancel('Cancel'); } };
  });
}

export function get(url: string, params: { [prop: string]: any }): Observable<any> {
  return http({ method: 'get', url, data: params });
}

export function post(url: string, data: { [prop: string]: any }): Observable<any> {
  return http({ method: 'post', url, data });
}

export function upload(url: string, form: FormData, params?: { [prop: string]: string }, cb?: (percent: number) => any): Observable<any> {
  return http({
    method: 'post',
    header: { 'Content-Type': 'multipart/form-data;' },
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
