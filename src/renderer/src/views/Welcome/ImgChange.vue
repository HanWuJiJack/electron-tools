<template>
    <div class="main">
        <el-form :model="Data" label-width="auto" ref="ruleFormRef" :rules="Data.rules" style="max-width: 600px">
            <el-form-item label="文件" prop="inputPath">
                <input type="file" name="file" accept="image/jpg,image/png,image/jpeg" ref="fileId" @change="submitForm"
                    class="el-upload__input" />
                <el-button size="mini" :loading="Data.loading" @click="inputClick">选取文件</el-button>
            </el-form-item>
            <el-form-item>
                <img v-if="Data.imageUrl" ref="imgRef" :src="Data.imageUrl" class="avatar">
            </el-form-item>
            <el-form-item label="目标格式" prop="format">
                <el-select v-model="Data.format">
                    <el-option label="jpeg" value="jpeg" />
                    <el-option label="jpg" value="jpg" />
                    <el-option label="png" value="png" />
                    <!-- <el-option label="webp" value="webp" /> -->
                    <el-option label="ico" value="ico" />
                    <el-option label="svg" value="svg" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" :loading="Data.loadingProxy">确认</el-button>
            </el-form-item>
        </el-form>
        <ul class="box">
            <li v-for="value, index in Data.list" :key="value.outputImgPath" class="li">
                <span class="text">{{ value.outputImgPath }}</span>
                <span> <el-button type="primary" @click="openImgDir(value.outputPath)">打开目录</el-button>
                    <el-button type="primary" @click="openImgDir(value.outputImgPath)">打开文件</el-button></span>
            </li>
        </ul>
    </div>
</template>
<script  setup>
import { reactive, toRaw, ref, getCurrentInstance } from "vue"
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
                // const canvas = document.createElement("canvas")
                // const ctx = canvas.getContext("2d");
                // ctx.drawImage(imgRef.value, 0, 0, imgWidth, imgHeight);
                // imgRef.value
                // return
                const convertedPath = await window.api.convertImage(Data.inputPath, Data.format);
                Data.list.push(convertedPath)
                console.log("convertedPath", convertedPath)
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
const openImgDir = async (convertedPath) => {
    await window.api.openFolder(convertedPath);
}

</script>
<style lang="less" scoped>
.avatar{
    width: 100px;
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
</style>