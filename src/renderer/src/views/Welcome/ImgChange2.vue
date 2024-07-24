<template>
    <div class="main">
        <div>
            <img v-if="Data.imageUrl" ref="imgRef" :src="Data.imageUrl" class="avatar2">
        </div>
        <el-form :model="Data" label-width="auto" ref="ruleFormRef" :rules="Data.rules" style="max-width: 600px">
            <el-form-item label="文件" prop="inputPath">
                <input type="file" name="file" accept="image/*" ref="fileId" @change="submitForm"
                    class="el-upload__input" />
                <el-button size="mini" :loading="Data.loading" @click="inputClick">选取文件</el-button>
            </el-form-item>
            <el-form-item>
                <img v-if="Data.imageUrl" :src="Data.imageUrl" class="avatar">
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" :loading="Data.loadingProxy">确认</el-button>
            </el-form-item>
        </el-form>
        <ul class="box">
            <li v-for="value, index in Data.list" :key="value" class="li">
                <span class="text">{{ value }}</span>
                <span> <el-button type="primary" @click="downloadImg(value)">下载</el-button>
                </span>
            </li>
        </ul>
    </div>
</template>
<script  setup>
import { reactive, toRaw, ref, getCurrentInstance } from "vue"
import html2canvas from 'html2canvas';

const { appContext } = getCurrentInstance()
const { $message } = appContext.app.config.globalProperties
const fileId = ref()
const ruleFormRef = ref()
const imgRef = ref()
const inputClick = () => {
    fileId.value.click();
}
const Data = reactive({
    inputPath: "",
    loading: false,
    loadingProxy: false,
    list: [],
    rules: {
        format: [
            { required: true, message: "目标格式", trigger: "blur" },
        ],
        inputPath: [
            { required: true, message: "文件", trigger: "blur" },
        ],

    }
})
const submitForm = async () => {
    Data.loading = true
    if (fileId.value.files.length) {
        Data.inputPath = fileId.value.files[0].path;
        console.log(fileId.value.files[0])
        Data.imageUrl = URL.createObjectURL(fileId.value.files[0]);
    } else {
        $message.error("请选择文件");
    }
    Data.loading = false
}
const onSubmit = () => {
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            Data.loadingProxy = true
            try {
                const canvas = await html2canvas(imgRef.value, {
                    scale: 2,//缩放比例,默认为1
                    allowTaint: false,//是否允许跨域图像污染画布
                    useCORS: true,//是否尝试使用CORS从服务器加载图像
                    // backgroundColor: '#000000',//画布的背景色，默认为透明
                    backgroundColor: null
                    // backgroundColor: "transparent"
                })
                var imgUri = canvas.toDataURL("image/png", 1);
                Data.list.push(imgUri)
                // html2canvas(document.getElementById('capture'),{
                //     backgroundColor: null
                // }).then(function (canvas) {
                //     // 创建一个新的窗口来显示图像
                //     var img = canvas.toDataURL("image/png");
                //     fileDownload(img)
                // });
            } catch (error) {
                $message.error(error.message)
            } finally {
                Data.loadingProxy = false
            }

        } else {
            console.log("error submit!")
        }
    })
}
const fileDownload = (downloadUrl) => {
    let aLink = document.createElement("a");
    aLink.style.display = "none";
    aLink.href = downloadUrl;
    aLink.download = Date.now() + ".png";
    // 触发点击-然后移除
    document.body.appendChild(aLink);
    aLink.click();
    document.body.removeChild(aLink);
}

const downloadImg = async (convertedPath) => {
    fileDownload(convertedPath)
}

</script>
<style lang="less" scoped>
.avatar {
    width: 100px;
}

.avatar2 {
    position: fixed;
    top: -400%;
    left: -400%;
    // width: 100px;
    border-radius: 20%;
    background: transparent !important;
    overflow: hidden; /* 确保内容不会超出圆角 */
}

.box {
    display: block;

    // border: 1px solid red;
    .li {
        border-bottom: 1px solid #ccc;
        display: flex;
        justify-content: space-between;
        line-height: 50px;

        .text {
            display: inline-block;
            max-width: 50%;
            text-overflow: ellipsis;
            line-height: 50px;
            white-space: nowrap;
            overflow: hidden;
            // border: 1px solid red;
        }
    }
}

.capture {
    width: 200px;
    height: 200px;
    background-color: rgba(255, 0, 0, 0.5);
    /* 半透明红色背景 */
    border-radius: 20px;
    /* 圆角 */
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 24px;
}</style>