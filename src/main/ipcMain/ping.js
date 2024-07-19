// import request from "../tools/request"
import request from "../tools/requestProxy"

function getRandomUserAgent(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export function ping(data) {
  const urlList = JSON.parse(data.urlList)
  return new Promise((resolve, reject) => {
    const lh = parseInt(data.sum)
    // console.log(data)
    // console.log(new Array(lh).fill(0))
    Promise.allSettled(new Array(lh).fill(0).map(() => request({
      url: data.url,
      proxy: getRandomUserAgent(urlList),
    }))).then(res => {
      resolve(res)
    })
  })
}
