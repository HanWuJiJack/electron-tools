<template>
    <div class="main">
        <el-form :model="form" label-width="auto" ref="ruleFormRef" :rules="Data.rules" style="max-width: 600px">
            <el-form-item>
                <input type="file" name="file" ref="fileId" @change="submitForm" class="el-upload__input" />
                <el-button size="mini" :loading="Data.loading" @click="inputClick">选取文件</el-button>
            </el-form-item>
            <el-form-item label="md5" prop="urlProxy">
                <el-input v-model="Data.md5" autosize type="textarea" />
            </el-form-item>
            <el-form-item label="日志">
                <el-input v-model="Data.log" autosize type="textarea" />
            </el-form-item>
        </el-form>
    </div>
</template>
<script  setup>
import { reactive, toRaw, ref, getCurrentInstance } from "vue"
import SparkMD5 from "spark-md5"


const { appContext } = getCurrentInstance()
const { $message } = appContext.app.config.globalProperties
const fileId = ref()
const inputClick = () => {
    fileId.value.click();
}
const Data = reactive({
    md5: "",
    loading: false,
    log: "",
})
const calculateMD5 = async (file) => {
    const startTiem = Date.now()
    const chunkSize = 1024 * 1024; // 1MB 每块大小
    const totalChunks = Math.ceil(file.size / chunkSize);
    const spark = new SparkMD5.ArrayBuffer();
    Data.log += `开始计算，文件名: (${file.name})\n`

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const blob = file.slice(start, end);
        const arrayBuffer = await readAsArrayBuffer(blob);
        Data.log += `加载数据：第${chunkIndex + 1}部分，总${totalChunks}部分\n`
        spark.append(arrayBuffer);
    }
    Data.md5 = spark.end();
    resetForm()
    const endTiem = Date.now()
    Data.log += `计算耗时:${endTiem - startTiem}ms\n`
}
const readAsArrayBuffer = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsArrayBuffer(blob);
    });
}
const submitForm = async () => {
    Data.loading = true
    if (fileId.value.files.length) {
        await calculateMD5(fileId.value.files[0])
    } else {
        this.$message.error("请选择文件");
    }
    Data.loading = false
}
const resetForm = () => {
    fileId.value.value = null
}
</script>
<style lang="less" scoped>
.page {
    // height: 120vh;
}
</style>