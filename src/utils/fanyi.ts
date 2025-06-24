import { jsonpRequest } from '@/lib/request';
import crypto from 'crypto-js';

export const baiduFanyi = ({
  q,
  appid,
  key,
  from = 'auto',
  to = 'en',
}: {
  q: string;
  appid: string;
  key: string;
  from?: string;
  to?: string;
}) => {
  const salt = Math.random().toString().slice(2);
  const sign = crypto.MD5(appid + q + salt + key).toString();
  return jsonpRequest<{
    from: string;
    to: string;
    trans_result: Array<{ src: string; dst: string }>;
  }>(
    'https://fanyi-api.baidu.com/api/trans/vip/translate',
    // method: 'post',
    // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    {
      q,
      appid,
      from,
      to,
      salt,
      sign,
    },
  );
};
