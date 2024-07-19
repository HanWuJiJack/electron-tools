import request from "request"
import _ from "underscore"
const userAgents = [
  // Desktop User-Agents
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59",
  // Mobile User-Agents
  "Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Mobile Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
];

function getRandomUserAgent(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
// http://0.0.0.0:5010/get?type=https

export default ({
  isJson = true,
  baseURL,
  url,
  proxy,
  method = "get",
  params = {},
  data = {},
  headers = {},
  timeout
}) => {
  const options = {
    url,
    baseUrl: baseURL,
    method: method.toLocaleUpperCase(),
    timeout,
    proxy,
    headers: {
      'User-Agent': getRandomUserAgent(userAgents),
      ...headers
    },
    qs: params
  };
  if (isJson) {
    _.extend(options, {
      json: true,
      body: data
    });
  } else {
    _.extend(options, {
      form: data
    });
  }
  return new Promise((resolve, reject) => {
    request(options, (err, res, data) => {
      if (err) {
        if (err.message.includes("timeout")) {
          // 判断请求异常信息中是否含有超时timeout字符串
          // console.log("错误回调", err);
          return reject({
            code: 50001,
            message: "请求超时",
          });
          // alert("网络超时");
        }
        if (err.message.includes("ECONNREFUSED")) {
          // 判断请求异常信息中是否含有超时timeout字符串
          // console.log("ECONNREFUSED88888");
          return reject({
            code: 50002,
            message: "拒绝连接",
          });
          // alert("网络超时");
        }
        return reject({
          code: 50003,
          message: err.message,
        });
      }
      resolve(data);
    });
  });
}
