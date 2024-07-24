var Jimp = require("jimp");
// const { createCanvas, loadImage } = require("canvas")
const path = require('path');
const fs = require('fs');
const potrace = require('potrace');
const util = require('util');
const pngToIco = require('png-to-ico');
const SnowflakeID = require('snowflake-id').default;
const potraceTraceAsync = util.promisify(potrace.trace);
const webp = require('webp-converter');

const snowflakeID = new SnowflakeID({
    mid: 42, // 机器ID (0~1023)
    offset: (2021 - 1970) * 31536000 * 1000 // 可选，设置偏移时间戳
});
function ensureOutputDir(outputDir) {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
}

export async function convertImage({ inputPath, format }) {
    try {
        const outputPath = path.join(__dirname, 'output');
        const filename = await snowflakeID.generate();
        const outputImgPath = path.join(outputPath, `${filename}.${format}`);
        ensureOutputDir(outputPath)
        // if (format === "ico") {
        //     const image = await loadImage(inputPath)
        //     // 绘制图像到 Canvas 上
        //     const imgWidth = image.width;
        //     const imgHeight = image.height;
        //     const canvas = createCanvas(imgWidth, imgHeight);
        //     const ctx = canvas.getContext('2d');
        //     ctx.drawImage(image, 0, 0, imgWidth, imgHeight);
        //     const buffer = canvas.toBuffer('image/png');
        //     const icoBuffer = await pngToIco(buffer)
        //     fs.writeFileSync(outputImgPath, icoBuffer);
        // } else if (format === "svg") {
        //     const image = await loadImage(inputPath)
        //     // 绘制图像到 Canvas 上
        //     const imgWidth = image.width;
        //     const imgHeight = image.height;
        //     const canvas = createCanvas(imgWidth, imgHeight);
        //     const ctx = canvas.getContext('2d');
        //     ctx.drawImage(image, 0, 0, imgWidth, imgHeight);
        //     const buffer = canvas.toBuffer('image/png');
        //     const color = '#000000'; // 你想要的颜色
        //     const svgBuffer = await potraceTraceAsync(buffer, { color: color })
        //     fs.writeFileSync(outputImgPath, svgBuffer);
        // } else if (format === "webp") {
        //     const image = await loadImage(inputPath)
        //     // 绘制图像到 Canvas 上
        //     const imgWidth = image.width;
        //     const imgHeight = image.height;
        //     const canvas = createCanvas(imgWidth, imgHeight);
        //     const ctx = canvas.getContext('2d');
        //     ctx.drawImage(image, 0, 0, imgWidth, imgHeight);
        //     const buffer = canvas.toBuffer('image/png');
        //     let result = webp.buffer2webpbuffer(buffer, "png", "-q 80");
        //     await result.then(function (result) {
        //         console.log(result)
        //     });
        // } else {
        //     const image = await loadImage(inputPath)
        //     // 绘制图像到 Canvas 上
        //     const imgWidth = image.width;
        //     const imgHeight = image.height;
        //     const canvas = createCanvas(imgWidth, imgHeight);
        //     const ctx = canvas.getContext('2d');
        //     ctx.drawImage(image, 0, 0, imgWidth, imgHeight);
        //     const buffer = canvas.toBuffer('image/png');
        //     // console.log(3)
        //     await Jimp.read(buffer)
        //         .then((image) => {
        //             return image.write(outputImgPath)
        //         })
        // }
        return { outputImgPath, outputPath };
    } catch (error) {
        throw new Error('Image conversion failed: ' + error.message);
    }
}