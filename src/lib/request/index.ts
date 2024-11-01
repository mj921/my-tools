export interface RequestOptions {
  url: string;
  method?: 'get' | 'post' | 'delete' | 'options' | 'put' | 'patch';
  headers?: Record<string, string>;
  data: Record<string, any>;
  success?: (res?: any) => void;
  fail?: (err?: any) => void;
}

const request = (options: RequestOptions) => {
  return new Promise((resolve, reject) => {
    const url = options.url;
    const method = options.method || 'get';
    const data = options.data;
    const headers = options.headers;
    const success = options.success || function () {};
    const fail = options.fail || function () {};
    const xhr = new XMLHttpRequest();
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
          const error = new Error('Request failed. Returned status of ' + xhr.status);
          (error as any).response = res;
          fail(error);
          reject(error);
        }
      }
    };
    if (data) {
      xhr.send(JSON.stringify(data));
    } else {
      xhr.send();
    }
  });
};

export default request;
