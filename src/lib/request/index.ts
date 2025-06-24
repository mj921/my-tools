export interface RequestOptions {
  url: string;
  method?: 'get' | 'post' | 'delete' | 'options' | 'put' | 'patch';
  headers?: Record<string, string>;
  data?: Record<string, any>;
  params?: Record<string, any>;
  success?: (res?: any) => void;
  fail?: (err?: any) => void;
}

const request = (options: RequestOptions) => {
  return new Promise((resolve, reject) => {
    let url = options.url;
    const method = options.method || 'get';
    const data = options.data;
    const params = options.params;
    const headers = options.headers;
    const success = options.success || function () {};
    const fail = options.fail || function () {};
    const xhr = new XMLHttpRequest();
    if (params) {
      const query = new URLSearchParams(params);
      url = url + (url.includes('?') ? '&' : '?') + query.toString();
    }
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    if (headers) {
      for (const header in headers) {
        xhr.setRequestHeader(header, headers[header]);
      }
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        let res = xhr.responseText;
        try {
          res = JSON.parse(xhr.responseText);
        } catch (e) {
          /* empty */
        }
        if (xhr.status >= 200 && xhr.status < 300) {
          success(res);
          resolve(res);
        } else {
          console.log(xhr);
          const error = new Error('Request failed. Returned status of ' + xhr.status);
          (error as any).response = res;
          fail(error);
          reject(error);
        }
      }
    };
    if (data) {
      if (headers?.['Content-Type'] === 'application/x-www-form-urlencoded') {
        const formData = new FormData();
        for (const key in data) {
          formData.set(key, data[key]);
        }
        xhr.send(formData);
      } else {
        xhr.send(JSON.stringify(data));
      }
    } else {
      xhr.send();
    }
  });
};

export const jsonpRequest = <R>(url: string, params?: Record<string, any>): Promise<R> =>
  new Promise((resolve, reject) => {
    // 生成一个唯一的回调函数名
    const callbackName = `jsonpCallback_${new Date().getTime()}_${Math.random().toString(16).slice(2)}`;
    (window as any)[callbackName] = (data: any) => {
      // 调用用户传入的回调函数处理数据
      // 移除全局回调函数
      delete (window as any)[callbackName];
      resolve(data);
    };
    const arr = url.split('?');
    url = [
      arr[0],
      [`callback=${callbackName}`, arr[1], new URLSearchParams(params || {}).toString()]
        .filter((el) => el)
        .join('&'),
    ].join('?');

    // 创建一个 script 标签
    const script = document.createElement('script');
    script.src = url;
    document.head.appendChild(script);

    // 为了防止内存泄漏，当 script 加载完成后移除
    script.onload = () => {
      document.head.removeChild(script);
    };
    script.onerror = (err) => {
      reject(err);
    };
  });

export default request;
