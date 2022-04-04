<template>
  <div class="table-content">
    <msui-datagrid class="msui-datagrid" ref="msuiDatagrid" :options="datagridOptions"></msui-datagrid>
    <msui-pagination class="table-page" ref="msuiPagination" @change="pageChange" :attrs="pageAttrs"/>
  </div>
</template>
<script>
export default {
  name:'modelListCore',
  data() {
    return {
      pageAttrs: {
        currentPage: 1
      },
      datagridOptions: {}
    };
  },
  props: {
    url: {
      type: Object,
      default: () => {
        return {
          get: "",
          post: "",
        };
      },
    },
    model: {
      type: Object,
      default: () => {
        return {};
      },
    },
    params: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  mounted() {
      this.init();
      this.initDatagrid();
  },
  watch: {
    params: {
      handler: function() {
        this.load({
          currentPage: 1,
          pageSize: 10,
        });
        this.$refs.msuiPagination.currentPage = 1
      },
      deep: true
    },
    'model.data': {
      handler: function() {
        this.datagridOptions.data.unshift(this.model.data)
      },
    }
  },
  methods: {
    init() {
      this.initAxios();
    },
    getHeight(dom) {
      return dom.$el.clientHeight;
    },
    initDatagrid() {
      this.datagridOptions = {
        data:  this.model.data,
        index: this.model.index || true,
        selection: this.model.selection || true,
        expand: this.model.expand || false,
        datagridModel: this.model.datagridModel,
        globalButton: this.model.globalButton || [],
        inlineButton: this.model.inlineButton || [],
        attrs: {
           height: this.model.globalButton ? this.getHeight(this.$refs.msuiDatagrid) - 70 : this.getHeight(this.$refs.msuiDatagrid) -22,
           loading: false
        },
        datagridFunction: Object.assign(this.model.datagridFunction || {}, {
            cellDblclick: (data, b, dom) => {
                const prop = b.property;
                const id = "table-edit";
                const model = this.model.datagridModel[prop];
                const type = model.type;
                const edit = model.edit;
                const para = document.createElement("div");
                if(edit) {
                    if (type === "text" || type === "select" || type === "timePicker") {
                    dom.firstChild.style.display = "none";
                    para.id = id;
                    para.value = data[prop];
                    dom.appendChild(para);
                    }

                    if (type === "text") {
                    this.isInput(dom, data, prop, id);
                    } else if (type === "select") {
                    this.isSelect(dom, data, prop, id, model);
                    } else if (type === "timePicker") {
                    this.isTimePicker(dom, data, prop, id);
                    }
                }
            },
        }),
      };
    },
    initAxios() {
      //表格数据接口
      this.getList = (params) => {
        return this.$http.get(`${this.$api.PRE}${this.url.get}`, { params });
      };
      // 修改接口
      this.postList = (data) => {
        return this.$http.post(`${this.$api.PRE}${this.url.post}`, data)
      };
    },
    load(params) {
      if (params) {
        params = Object.assign(params, this.params);
      }
      this.datagridOptions.attrs.loading = true;
      this.getList(params).then(({data}) => {
        this.$emit('changeData', data, this.datagridOptions, this.$refs.msuiPagination)
        this.datagridOptions.attrs.loading = false;
      });
    },
    pageChange(currentPage = 1, pageSize) {
      this.load({ pageSize, currentPage });
    },
    isInput(dom, data, prop, id) {
      const myInput = new this.MsuiElement();
      myInput.template = `<msui-input
            style="width:75%;height: 24.9975px;"
            ref="input"
            :attrs="attrs"
            v-if="showInput"
            @blur="blur"/>`;
      let value;
      if(data[prop] == '请输入名称') {
        value = ''
      } else {
        value = data[prop]
      }
      myInput.data = {
        showInput: true,
        attrs: {
          value,
          placeholder: '请输入名称',
          size: "mini",
        },
      };
      myInput.mounted = () => {
        setTimeout(() => {
          inputIns.$refs.input.focus();
        }, 10);
      };
      myInput.methods = {
        blur: () => {
          myInput.MSUIVUEINS.showInput = false;
          dom.firstChild.style.display = "block";
          if(data.objId) {
              let oldValue = data[prop];
              data[prop] = myInput.MSUIVUEINS.attrs.value;
              this.MsuiMessage({
                  text: "是否确定修改数据",
                  errorMessage: '取消修改',
                  successCallBack: () => {
                    this.postList(data).then(({data}) => {
                      this.$message({
                        message: data.data,
                        type: 'success'
                      });
                      this.$bus.$emit('changeTreeData', data)
                    }).catch(err => {
                      this.$message({
                        message: '修改失败',
                        type: 'error'
                      });
                      data[prop] = oldValue;
                    })
                  },
                  errorCallBack: () => {
                    data[prop] = oldValue;
                  }
               })
             } else {
            this.$emit('setNewData', data, prop, data[prop], this.datagridOptions.attrs)
            data[prop] = myInput.MSUIVUEINS.attrs.value;
          }
        },
      };
      myInput.render(`#${id}`);
      const inputIns = myInput.MSUIVUEINS.$refs.input;
    },
    isSelect(dom, data, prop, id, model) {
      const mySelect = new this.MsuiElement();
      mySelect.template = `<msui-select-box
            style="width:75%;height: 24px;"
            ref="select"
            :attrs="attrs"
            v-model="attrs.value"
            @change="change"
            v-if="show"/>`;
      let value;
      if(data[prop] == '请输入名称') {
        value = ''
      } else {
        value = data[prop]
      }
      mySelect.data = {
        show: true,
        attrs: {
          value,
          placeholder: '请输入名称',
          size: "mini",
          options: []
        },
      };
      if (model.data instanceof Promise) {
        model.data.then((res) => {
          mySelect.data.attrs.options = res;
        });
      } else {
          mySelect.data.attrs.options = model.data;
      }
      mySelect.mounted = () => {
        setTimeout(() => {
          selectIns.$refs.select.focus();
        }, 10);
      };
      mySelect.methods = {
        change: (value) => {
          data[prop] = value;
          mySelect.MSUIVUEINS.show = false;
          dom.firstChild.style.display = "block";
        },
      };
      mySelect.render(`#${id}`);

      // 子组件对象
      const selectIns = mySelect.MSUIVUEINS.$refs.select;
    },
    isTimePicker(dom, data, prop, id) {
      const myTimePicker = new this.MsuiElement();
      myTimePicker.template = `<msui-time-picker
            style="width:75%;height: 24.9975px;"
            ref="time"
            :attrs="attrs"
            v-if="show"
            @blur="blur"/>`;
      myTimePicker.data = {
        value: data[prop],
        show: true,
        attrs: {
          blur() {
            myTimePicker.MSUIVUEINS.$refs.time.$emit(
              "blur",
              myTimePicker.MSUIVUEINS.$refs.time.value1
            );
          },
          size: "mini",
        },
      };
      myTimePicker.mounted = () => {
        setTimeout(() => {
          myTimePicker.MSUIVUEINS.$refs.time.$refs.time.focus();
        }, 10);
      };
      myTimePicker.methods = {
        blur: (value) => {
          let timeValue = value === "" ? new Date() : value;
          let time = this.MsuiUtils.timestampToTime(timeValue);
          console.log(time);
          myTimePicker.MSUIVUEINS.show = false;
          dom.firstChild.style.display = "block";
        },
      };
      myTimePicker.render(`#${id}`);
    },
  },
};
</script>
<style lang="less" scoped>
.table-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: auto;
  justify-content: center;
  .msui-datagrid {
    flex: 1;
    overflow: auto;
  }
  .table-page {
    flex: 0 0 30px;
    box-sizing: border-box;
  }
}
</style>
