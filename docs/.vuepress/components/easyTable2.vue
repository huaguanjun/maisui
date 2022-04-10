<template>
  <div class="model-right">
    <div class="table-header">
      <msui-form :options="form" ref="form"/>
    </div>
    <msui-datagrid class="msui-datagrid" ref="msuiDatagrid" :options="model">
      <template #name="{ row, column, $index, name, curentModel }">
        <div><el-button size="mini" type="primary">{{row.name}}</el-button></div>
      </template>
      <template #expandView="{ row, options }">
        <component
            :is="expand"
            :row="row"
            :options="options"
        />
      </template>
    </msui-datagrid>
    <msui-pagination class="table-page" ref="msuiPagination" @change="pageChange" :attrs="pageAttrs"/>
  </div>
</template>

<script>
import expand from './expanView'
export default {
  name:'easyTable2',
  data() {
    return {
      model: {},
      paramsKeyword: {},
      form: this.initForm({
        sex: "性别",
        birthday: "爱好",
        age: "年龄",
        name: "姓名"
      }),
      expand: expand,
      pageAttrs: {
        currentPage: 1,
        total: 30
      },
    }
  },
  created() {
    this.initModel({
      name: "姓名",
      code: "爱好",
      pcode: "年龄",
      ctime: "家乡",
      userName: '职业'
    })
  },
  methods: {
    pageChange(currentPage = 1, pageSize = 20) {
      debugger
      let data = []
      for (let k = 0; k < pageSize; k++) {
         data.push({
          name: "小花",
          code: "唱歌，骑行，跑步",
          pcode: "18",
          ctime: "徐州",
          userName: '码农'
        })
      }
      this.model.data = data
    },
    initForm(formModel) {
      formModel = new this.MsuiFormModel(formModel);

      formModel.sex.type({
        options: [{value: 0, label: '女'},{value: 1, label: '男'}]
      },"msui-selectBox");
      formModel.birthday.type({
        options: [{value: '骑行', label: '骑行'},{value: '唱歌', label: '唱歌'},{value: '音乐节', label: '音乐节'}]
      },"msui-selectBox");
      return {
        labelWidth: "45px",
        labelPosition: "right",
        size: "small",
        disabled: false,
        formModel: formModel,
        inline: false,
        showButton: false,
        save: (data) => {
          this.paramsKeyword = data
        },
        span: 6
      };
    },
    initModel(dataModel) {
      const model = new this.MsuiDataGridModel({
        dataModel,
        align: "center",
      });
      this.model = {
        datagridModel: model,
        index: true,
        expand: true,
        selection: true,
        size:'mini',
        data: [],
        attrs: {
            height: 600
        },
        globalButton: [
          {
            title: '查询',
            type: 'primary',
            size: 'mini',
            align:'right',
            icon: 'el-icon-search',
            clickHandler: () => {
              this.$refs.form.submitForm()
            }
          },
          {
            title: '重置',
            size: 'mini',
            align: 'right',
            type: 'danger',
            icon: 'el-icon-refresh',
            clickHandler: () => {
              this.$refs.form.resetForm()
            }
          },
          {
            title: '新增',
            type: 'primary',
            size: 'mini',
            icon: 'el-icon-circle-plus-outline',
            clickHandler: () => {
              console.log('ss')
            }
          },
          {
            title: '删除',
            size: 'mini',
            icon: 'el-icon-remove-outline',
            clickHandler: () => {
              console.log('ss')
            }
          }
        ],
        inlineButton: [
          {
            title: "删除",
            icon: "el-icon-delete",
            clickHandler: ({ row, $index }, rows) => {
            }
          }
        ],
        datagridFunction: {}
      };
      this.pageChange()
    }
  }
}
</script>
<style scoped>
.model-right {
  flex: 1;
  height: 100%;
  margin-left: 20px;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  margin-top:30px;
  border: 1px solid #ccc;
  padding: 30px;
}
.model-right .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 0 0 54px;
    position: relative;
  }
</style>