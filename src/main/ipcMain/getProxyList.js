import request from "../tools/request"
// 获取代理链接
export function getProxyList(data) {
  console.log(import.meta.env.VITE_KEY) // "123"
  console.log(import.meta.env.MAIN_VITE_KEY) // "123"
  return new Promise((resolve, reject) => {
    request({
      url: data.path,
      // params: {
      //   type: data.type
      // },
      isJson: true,
    }).then(res => {
      // console.log("res=>", res)
      resolve(res)
    }, err => {
      // console.log("err=>", err)
      reject(err)
    })
  })
}
