const path = require('path');
const puppeteer = require('puppeteer');
const fs = require("fs")

function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

const config = {
  zdaye: "https://www.zdaye.com/free/",
}

async function getzdaye(page) {
  let loop = true
  let zdayeTableData = []
  let pageSum = 1
  while (loop) {
    await sleep(5000)
    await page.goto(config.zdaye + pageSum, {
      timeout: 40 * 1000,
      waitUntil: 'networkidle0'
    });
    const pageTab = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tr'));
      return rows.map(row => {
        const cells = Array.from(row.querySelectorAll('th, td'));
        return cells.map(cell => cell.textContent.trim() || Array.from(cell.classList));
      });
    })
    // console.log("pageTab", pageTab, pageTab.slice(1))
    // 获取表格数据
    zdayeTableData = zdayeTableData.concat(pageTab.slice(1))
    // console.log("zdayeTableData", zdayeTableData)
    if (pageTab.length === 0) {
      loop = false
      zdayeTableData = zdayeTableData.map(item => {
        return {
          proxy: item[0],
          https: item[5],
          type: item[2],
          region: "中国" + item[4],
          source: "zdayeTableData"
        }
      })
    }
    pageSum++;
  }
  return zdayeTableData
}

async function getCode() {
  const browser = await puppeteer.launch({
    // headless: true,
    headless: false,
    args: [
    //   '--proxy-server=https://111.180.188.215:11200',
      // '--disable-gpu', // GPU硬件加速
      // '--disable-dev-shm-usage', // 创建临时文件共享内存
      '--disable-setuid-sandbox', // uid沙盒
      // '--no-first-run', // 没有设置首页。在启动的时候，就会打开一个空白页面。
      '--no-sandbox', // 沙盒模式
      // '--no-zygote',
      // '--single-process', // 单进程运行
    ]
  })
  const page = await browser.newPage()
  //   const url = "http://httpbin.org"
    const url = "https://www.qq.com/"
//   const url = "https://www.zdaye.com/free/"
  await page.goto(url, {
    timeout: 40 * 1000,
    waitUntil: 'networkidle0'
  });

  //   let TableData = []
  //   const zdayeTableData = await getzdaye(page)


  //   TableData = TableData.concat(zdayeTableData)
  //   try {
  //     let file = path.join(__dirname, "proxy.json");
  //     fs.writeFileSync(file, JSON.stringify(TableData, null, 4), 'utf8');
  //     console.log('文件写入成功');
  //   } catch (err) {
  //     console.error('写入文件时出错:', err);
  //   }

  // 关闭 Puppeteer
  //   await browser.close();
}

getCode()
