import https from 'https';
import fs from 'fs';
import Day from '../../lib/day.js';

const sleep = (time = 300) => new Promise((resolve) => setTimeout(resolve, time));
const getData = (date) =>
  new Promise((resolve, reject) => {
    const data = JSON.stringify({
      title: 'foo',
      body: 'bar',
      userId: 1,
    });

    const options = {
      hostname: 'xiaoce.fun',
      port: 443, // HTTPS默认端口
      path: '/api/v0/quiz/daily/lyric/get?date=' + date,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'fun-device': 'web',
        pragma: 'no-cache',
        priority: 'u=1, i',
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        const data = JSON.parse(responseData).data.data;
        fs.writeFileSync(`./${date}.json`, JSON.stringify(data));
        resolve(true);
      });
    });

    req.on('error', (error) => {
      console.error(error);
      reject(error);
    });

    // 写入数据到请求体
    req.write(data);
    req.end();
  });

const load = async () => {
  const day = new Day('2025-07-05');
  let i = 0;
  while (i < 300) {
    try {
      console.log(day.format('YYYYMMDD'));
      await getData(day.format('YYYYMMDD'));
      day.subtract(1, 'day');
      i++;
      await sleep();
    } catch (error) {
      console.log(error);
      i++;
      await sleep();
    }
  }
};

load();
