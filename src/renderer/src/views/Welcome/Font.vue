<template>
    <div class="main text-on-image">
        <p class="p1">screen——Hsueh</p>
        <p class="p2">transparent——Hsueh</p>
        <div class="gradient-text">
            Gradient Text
        </div>
        <div class="container">
            <p class="gradient-text">
                Gradient Text
            </p>
            <p class="eraser gradient-text">
                <span class="text">
                    Gradient Text
                </span>
            </p>
        </div>
    </div>
</template>
<script  setup>
import { reactive, toRaw, ref, getCurrentInstance } from "vue"
const { appContext } = getCurrentInstance()
const { $message } = appContext.app.config.globalProperties
console.log(import.meta.env.VITE_KEY) // "123"
const Data = reactive({
})

</script>
<style lang="less" scoped>
.text-on-image {
    position: relative;
    // color: #ffffff;
    width: 100%;
    height: 100%;
    background: url('./../../assets/images/bg-f.jpg') center center no-repeat;
    background-size: cover;
}

.p1 {
    letter-spacing: 5px;
    font: normal bold 4vw 'Poppins';
    mix-blend-mode: color-dodge;
}

// normal：默认值，不应用任何混合，保持正常渲染。
// multiply：将元素颜色与背景颜色进行乘法混合，使得结果颜色变暗。黑色与任何颜色混合结果都是黑色，白色与任何颜色混合结果都是原色。
// screen：将元素颜色与背景颜色进行屏幕混合，使得结果颜色变亮。白色与任何颜色混合结果都是白色，黑色与任何颜色混合结果都是原色。
// overlay：结合了 multiply 和 screen，根据背景颜色的亮度来调整前景色。如果背景颜色比中性灰更暗，则结果将变暗，反之亦然。
// darken：比较元素颜色和背景颜色的每个通道，并选择较暗的颜色作为结果颜色。
// lighten：比较元素颜色和背景颜色的每个通道，并选择较亮的颜色作为结果颜色。
// color-dodge：前景色与背景色的亮部进行颜色减淡，产生高对比度的结果。

.p2 {
    font: normal bold 5vw 'Poppins';
    // background-image: url("./../../assets/images/bg.jpg");
    background: url('./../../assets/images/bg.jpg') center center no-repeat;
    background-size: cover;
    /* 将图片按文本范围进行裁剪 */
    -webkit-background-clip: text;
    /* 将文字内容设置为透明，从而显示裁切后的图片底色 */
    color: transparent;
    -webkit-text-fill-color: transparent;
}

.gradient-text {
    font-size: 30pxs;
    font-weight: bold;
    background: linear-gradient(90deg,
            #ff0000,
            /* 粉红色 */
            #0000ff,
            /* 青色 */
            #00ff00,
            // /* 蓝色 */
            // #00ff00,
            /* 紫色 */
            #ff0000,
            #0000ff,
            #00ff00,
            #ff0000,
        );
    /* 青色 */
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradientAnimation 5s infinite linear;

}

@keyframes gradientAnimation {
    0% {
        background-position: 0% 50%;
    }

    100% {
        background-position: 100% 50%;
    }
}

.container {
    position: relative;
    width: 100%;
    text-indent: 20px;
    line-height: 2;
    font-size: 18px;
    margin: 30px auto;
    background-color: #000;
    color: #fff;
}

.eraser {
    position: absolute;
    /* 这里等同于top:0 right:0 bottom:0 left:0 */
    inset: 0;
    /*
        这里解释一下inset属性，inset属性用作定位元素的top、right、bottom 、left这些属性的简写
        依照的也是上右下左的顺序。
        例如：inset:1px 2px 等同于 top:1px right:2px bottom:1px left:2px
    */
}
// 渐变方向 (to right)：指定了从左到右的渐变效果。
// 起始颜色 (#0000 var(--p))：从完全透明的黑色开始，起始位置由 --p 控制。
// 结束颜色 (#000 calc(var(--p) + 30px))：以黑色结束，结束位置比起始位置 --p 多30像素。
.text {
    --p: 0%;
    background: linear-gradient(to right, transparent var(--p), #000000 calc(var(--p) + 30px));
    color: transparent;
    animation: erase 2s linear forwards;
}

@property --p {
    syntax: '<percentage>';
    initial-value: 0%;
    inherits: false;
}

@keyframes erase {
    to {
        --p: 100%;
    }
}
</style>