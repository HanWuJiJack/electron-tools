<template>
    <div class="main">
        <el-collapse v-model="collapseActiveNames" @change="handleChange">
            <el-collapse-item title='第一步:获取代理地址' name="1">
                <el-form :model="form" ref="ruleFormRef" :rules="Data.rules" label-width="auto" style="max-width: 600px">
                    <el-form-item label="获取代理api" prop="path">
                        <el-input v-model="form.path" />
                    </el-form-item>
                    <!-- <el-form-item label="http/https" prop="type">
                        <el-select v-model="form.type">
                            <el-option label="http" value="http" />
                            <el-option label="https" value="https" />
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="url集合">
                        <!-- <el-input v-model="form.urlList" /> -->
                        <el-input v-model="form.urlList" autosize type="textarea" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit" :loading="Data.loadingProxy">确认</el-button>
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
    urlProxyList: ""
})

const Data = reactive({
    loadingProxy: false,
    loadingCheckProxy: false,
    loadingProxySend: false,
    list: [],
    collapseActiveNames: ["1"],
    rules: {
        path: [
            { required: true, message: "代理地址", trigger: "blur" },
        ],
        urlProxy: [
            { required: true, message: "api返回url字段", trigger: "blur" },
        ],
        // httpsProxy: [
        //     { required: true, message: "api返回是否是https字段", trigger: "blur" },
        // ],
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
                const list = await window.api.getProxyList(toRaw(form))
                // const Urllist = list.filter((item) => {
                //     return item.region.indexOf("中国") > -1
                // }).map(item => (`${form.type}://${item[form.urlProxy]}`))
                const Urllist = list.filter((item) => {
                    return item.region.indexOf("中国") > -1
                })
                form.urlList = JSON.stringify(Urllist, null, 4)
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
        await window.api.checkProxyList({ urlList: form.urlList, type: form.type })
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