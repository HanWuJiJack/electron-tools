import { _ as _export_sfc, g as getCurrentInstance, r as ref, a as reactive, b as resolveComponent, o as openBlock, c as createElementBlock, d as createVNode, w as withCtx, e as createTextVNode } from "./index-BwtP4ELS.js";
const _hoisted_1 = { class: "main" };
const _sfc_main = {
  __name: "ToSend",
  setup(__props) {
    const { appContext } = getCurrentInstance();
    const { $message } = appContext.app.config.globalProperties;
    const ruleFormRef = ref();
    const form = reactive({
      path: "http://127.0.0.1:5010/all?type=http",
      urlProxy: "proxy",
      urlList: "",
      type: "http",
      endurl: "http://management.shshpl.com:23810/from/me",
      sum: 10,
      urlProxyList: "",
      urlListend: ""
    });
    const Data = reactive({
      loadingProxy: false,
      loadingCheckProxy: false,
      loadingProxySend: false,
      list: [],
      collapseActiveNames: ["1"],
      rules: {
        urlList: [
          { required: true, message: "url集合", trigger: "blur" }
        ],
        urlProxy: [
          { required: true, message: "api返回url字段", trigger: "blur" }
        ],
        type: [
          { required: true, message: "http/https", trigger: "blur" }
        ]
      }
    });
    const onSubmit = () => {
      Data.loadingProxy = true;
      ruleFormRef.value.validate(async (valid) => {
        if (valid) {
          try {
            const list = JSON.parse(form.urlList);
            const Urllist = list.map((item) => `${form.type}://${item[form.urlProxy]}`);
            form.urlListend = JSON.stringify(Urllist, null, 4);
          } catch (error) {
            $message.error(error.message);
          } finally {
            Data.loadingProxy = false;
          }
        } else {
          console.log("error submit!");
          Data.loadingProxy = false;
        }
      });
    };
    const onSubmit2 = async () => {
      Data.loadingCheckProxy = true;
      try {
        await window.api.checkProxyList({ urlList: form.urlListend, type: form.type });
        const data = await window.api.checkProxyListBack();
        const filterProxyList = data.map((item, index) => {
          if (item.status === "fulfilled") {
            return Data.list[index];
          }
          return null;
        }).filter((item, index) => {
          return item;
        });
        form.urlProxyList = JSON.stringify(filterProxyList);
      } catch (error) {
        $message.error(error.message);
      } finally {
        Data.loadingCheckProxy = false;
      }
    };
    const onSubmit3 = async () => {
      Data.loadingProxySend = true;
      try {
        await window.api.toproxyreq({ url: form.endurl, sum: form.sum, urlList: form.urlProxyList });
        const data = await window.api.toproxyreqBack();
        form.res = JSON.stringify(data, null, 4);
        form.success = data.filter((item) => item.status === "fulfilled").length;
        console.log("=>", data);
      } catch (error) {
        $message.error(error.message);
      } finally {
        Data.loadingProxySend = false;
      }
    };
    const onSubmit4 = async () => {
      form.urlProxyList = form.urlList;
    };
    return (_ctx, _cache) => {
      const _component_el_input = resolveComponent("el-input");
      const _component_el_form_item = resolveComponent("el-form-item");
      const _component_el_option = resolveComponent("el-option");
      const _component_el_select = resolveComponent("el-select");
      const _component_el_button = resolveComponent("el-button");
      const _component_el_form = resolveComponent("el-form");
      const _component_el_collapse_item = resolveComponent("el-collapse-item");
      const _component_el_collapse = resolveComponent("el-collapse");
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(_component_el_collapse, {
          modelValue: _ctx.collapseActiveNames,
          "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => _ctx.collapseActiveNames = $event),
          onChange: _ctx.handleChange
        }, {
          default: withCtx(() => [
            createVNode(_component_el_collapse_item, {
              title: "第一步:解析代理地址",
              name: "1"
            }, {
              default: withCtx(() => [
                createVNode(_component_el_form, {
                  model: form,
                  "label-width": "auto",
                  ref_key: "ruleFormRef",
                  ref: ruleFormRef,
                  rules: Data.rules,
                  style: { "max-width": "600px" }
                }, {
                  default: withCtx(() => [
                    createVNode(_component_el_form_item, {
                      label: "url集合",
                      prop: "urlList"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_el_input, {
                          modelValue: form.urlList,
                          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.urlList = $event),
                          autosize: "",
                          type: "textarea"
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_el_form_item, {
                      label: "api返回url字段",
                      prop: "urlProxy"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_el_input, {
                          modelValue: form.urlProxy,
                          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.urlProxy = $event)
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_el_form_item, {
                      label: "http/https",
                      prop: "type"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_el_select, {
                          modelValue: form.type,
                          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.type = $event)
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_el_option, {
                              label: "http",
                              value: "http"
                            }),
                            createVNode(_component_el_option, {
                              label: "https",
                              value: "https"
                            })
                          ]),
                          _: 1
                        }, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_el_form_item, null, {
                      default: withCtx(() => [
                        createVNode(_component_el_button, {
                          type: "primary",
                          onClick: onSubmit,
                          loading: Data.loadingProxy
                        }, {
                          default: withCtx(() => [
                            createTextVNode("确认")
                          ]),
                          _: 1
                        }, 8, ["loading"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_el_form_item, { label: "解析结果" }, {
                      default: withCtx(() => [
                        createVNode(_component_el_input, {
                          modelValue: form.urlListend,
                          "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.urlListend = $event),
                          autosize: "",
                          type: "textarea"
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["model", "rules"])
              ]),
              _: 1
            }),
            createVNode(_component_el_collapse_item, {
              title: "第二步:验证代理地址",
              name: "2"
            }, {
              default: withCtx(() => [
                createVNode(_component_el_form, {
                  model: form,
                  "label-width": "auto",
                  style: { "max-width": "600px" }
                }, {
                  default: withCtx(() => [
                    createVNode(_component_el_form_item, { label: "过滤后url集合" }, {
                      default: withCtx(() => [
                        createVNode(_component_el_input, {
                          modelValue: form.urlProxyList,
                          "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.urlProxyList = $event)
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_el_form_item, null, {
                      default: withCtx(() => [
                        createVNode(_component_el_button, {
                          type: "primary",
                          onClick: onSubmit2,
                          loading: Data.loadingCheckProxy
                        }, {
                          default: withCtx(() => [
                            createTextVNode("验证代理地址")
                          ]),
                          _: 1
                        }, 8, ["loading"]),
                        createVNode(_component_el_button, {
                          type: "primary",
                          onClick: onSubmit4
                        }, {
                          default: withCtx(() => [
                            createTextVNode("拉取")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["model"])
              ]),
              _: 1
            }),
            createVNode(_component_el_collapse_item, {
              title: "第三步:发起请求",
              name: "3"
            }, {
              default: withCtx(() => [
                createVNode(_component_el_form, {
                  model: form,
                  "label-width": "auto",
                  style: { "max-width": "600px" }
                }, {
                  default: withCtx(() => [
                    createVNode(_component_el_form_item, { label: "请求地址" }, {
                      default: withCtx(() => [
                        createVNode(_component_el_input, {
                          modelValue: form.endurl,
                          "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => form.endurl = $event)
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_el_form_item, { label: "请求次数" }, {
                      default: withCtx(() => [
                        createVNode(_component_el_input, {
                          modelValue: form.sum,
                          "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => form.sum = $event)
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_el_form_item, { label: "累计成功" }, {
                      default: withCtx(() => [
                        createVNode(_component_el_input, {
                          modelValue: form.success,
                          "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => form.success = $event)
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_el_form_item, null, {
                      default: withCtx(() => [
                        createVNode(_component_el_button, {
                          type: "primary",
                          onClick: onSubmit3,
                          loading: Data.loadingProxySend
                        }, {
                          default: withCtx(() => [
                            createTextVNode("确认")
                          ]),
                          _: 1
                        }, 8, ["loading"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_el_form_item, { label: "返回结果" }, {
                      default: withCtx(() => [
                        createVNode(_component_el_input, {
                          modelValue: form.res,
                          "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => form.res = $event),
                          autosize: "",
                          type: "textarea"
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }, 8, ["model"])
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue", "onChange"])
      ]);
    };
  }
};
const ToSend = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-232d0faf"]]);
export {
  ToSend as default
};
