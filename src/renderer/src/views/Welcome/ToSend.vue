<template>
    <div class="main">
        <el-collapse v-model="collapseActiveNames" @change="handleChange">
            <el-collapse-item title='第一步:解析代理地址' name="1">
                <el-form :model="form" label-width="auto" ref="ruleFormRef" :rules="Data.rules" style="max-width: 600px">
                    <el-form-item label="url集合" prop="urlList">
                        <el-input v-model="form.urlList" autosize type="textarea" />
                    </el-form-item>
                    <el-form-item label="api返回url字段" prop="urlProxy">
                        <el-input v-model="form.urlProxy" />
                    </el-form-item>
                    <el-form-item label="http/https" prop="type">
                        <el-select v-model="form.type">
                            <el-option label="http" value="http" />
                            <el-option label="https" value="https" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit" :loading="Data.loadingProxy">确认</el-button>
                    </el-form-item>
                    <el-form-item label="解析结果">
                        <el-input v-model="form.urlListend" autosize type="textarea" />
                    </el-form-item>
                </el-form>
            </el-collapse-item>
            <el-collapse-item title="第二步:验证代理地址" name="2">
                <el-form :model="form" label-width="auto" style="max-width: 600px">
                    <el-form-item label="过滤后url集合">
                        <el-input v-model="form.urlProxyList" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit2" :loading="Data.loadingCheckProxy">验证代理地址</el-button>
                        <el-button type="primary" @click="onSubmit4">拉取</el-button>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
            <el-collapse-item title="第三步:发起请求" name="3">
                <el-form :model="form" label-width="auto" style="max-width: 600px">
                    <el-form-item label="请求地址">
                        <el-input v-model="form.endurl" />
                    </el-form-item>
                    <el-form-item label="请求次数">
                        <el-input v-model="form.sum" />
                    </el-form-item>

                    <el-form-item label="累计成功">
                        <el-input v-model="form.success" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit3" :loading="Data.loadingProxySend">确认</el-button>
                    </el-form-item>
                    <el-form-item label="返回结果">
                        <el-input v-model="form.res" autosize type="textarea" />
                    </el-form-item>
                </el-form>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script  setup>
import { reactive, toRaw, ref, getCurrentInstance } from "vue"
const { appContext } = getCurrentInstance()
const { $message } = appContext.app.config.globalProperties
const ruleFormRef = ref()
const form = reactive({
    path: "http://127.0.0.1:5010/all?type=http",
    urlProxy: "proxy",
    urlList: "",
    type: "http",
    endurl: "http://management.shshpl.com:23810/from/me",
    sum: 10,
    urlProxyList: "",
    urlListend: "",
})

const Data = reactive({
    loadingProxy: false,
    loadingCheckProxy: false,
    loadingProxySend: false,
    list: [],
    collapseActiveNames: ["1"],
    rules: {
        urlList: [
            { required: true, message: "url集合", trigger: "blur" },
        ],
        urlProxy: [
            { required: true, message: "api返回url字段", trigger: "blur" },
        ],
        type: [
            { required: true, message: "http/https", trigger: "blur" },
        ],
    }
})

const onSubmit = () => {
    Data.loadingProxy = true
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            // console.log("ruleFormRef2")
            try {
                const list = JSON.parse(form.urlList)
                const Urllist = list.map(item => (`${form.type}://${item[form.urlProxy]}`))
                form.urlListend = JSON.stringify(Urllist, null, 4)
            } catch (error) {
                $message.error(error.message)
            } finally {
                Data.loadingProxy = false
            }
        } else {
            console.log("error submit!")
            Data.loadingProxy = false
        }
    })
}
const onSubmit2 = async () => {
    Data.loadingCheckProxy = true
    try {
        // const Urllist = form.urlList.map(item => (`${form.type}://${item[form.urlProxy]}`))
        await window.api.checkProxyList({ urlList: form.urlListend, type: form.type })
        const data = await window.api.checkProxyListBack()
        const filterProxyList = data.map((item, index) => {
            if (item.status === "fulfilled") {
                return Data.list[index]
            }
            return null
        }).filter((item, index) => {
            return item
        })
        form.urlProxyList = JSON.stringify(filterProxyList)
        // console.log("=>", filterProxyList)
    } catch (error) {
        $message.error(error.message)
    } finally {
        Data.loadingCheckProxy = false
    }

}

const onSubmit3 = async () => {
    Data.loadingProxySend = true
    try {
        await window.api.toproxyreq({ url: form.endurl, sum: form.sum, urlList: form.urlProxyList })
        const data = await window.api.toproxyreqBack()
        form.res = JSON.stringify(data, null, 4)
        form.success = data.filter(item => item.status === "fulfilled").length
        console.log("=>", data)
    } catch (error) {
        $message.error(error.message)
    } finally {
        Data.loadingProxySend = false
    }

}
const onSubmit4 = async () => {
    form.urlProxyList = form.urlList
}

</script>
<style lang="less" scoped>
.page {
    // height: 120vh;
}
</style>