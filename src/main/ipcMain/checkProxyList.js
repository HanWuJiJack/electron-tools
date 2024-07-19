import request from "../tools/requestProxy"



// 获取代理链接
export function checkProxyList(data) {
  const list = JSON.parse(data.urlList)
  // console.log("list", list)
  let url = ""
  if (data.type == "https") {
    url = "https://www.qq.com"
  } else {
    url = "http://httpbin.org"
  }
  return Promise.allSettled(list.map(item => request({
    // url: data.type + "://www.baidu.com/img/flexible/logo/pc/result.png",
    url,
    proxy: item,
    isJson: false,
  })))
}
