<template>
  <div class="model-right">
    <div class="table-header">
      <msui-form :options="form" ref="form">
        <template #save>
        </template>
      </msui-form>
    </div>
    <msui-datagrid class="msui-datagrid" ref="msuiDatagrid" :options="model"></msui-datagrid>
    <msui-pagination class="table-page" ref="msuiPagination" @change="pageChange" :attrs="pageAttrs"/>
  </div>
</template>

<script>
export default {
  name:'easyTable2',
  data() {
    return {
      model: {},
      paramsKeyword: {},
      form: this.initForm({
        name: "应用名称",
        sex: "所属专业",
        birthday: "所属中心",
        age: "所属类别"
      }),
      pageAttrs: {
        currentPage: 1
      },
    }
  },
  created() {
    this.initModel({
      name: "分类名称",
      code: "分类代码",
      pcode: "上级分类编码",
      ctime: "创建时间",
      userName: '创建人'
    })
  },
  methods: {
    changeData({ data }, datagridOptions, pageOptions) {
      datagridOptions.data = data.records;
      pageOptions.total = data.total;
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
    initForm(formModel) {
      formModel = new this.MsuiFormModel(formModel);

      formModel.sex.type(
        {},
        "msui-selectBox"
      );
      formModel.birthday.type(
        {},
        "msui-selectBox"
      );
      formModel.age.type(
        {},
        "msui-selectBox"
      );
      return {
        labelWidth: "75px",
        labelPosition: "right",
        size: "small",
        disabled: false,
        formModel: formModel,
        inline: true,
        save: (data) => {
          console.log(data)
          this.paramsKeyword = data
        },
        span: 8
      };
    },
    initModel(dataModel) {
      const model = new this.MsuiDataGridModel({
        dataModel,
        align: "center",
      });
      this.model = {
        datagridModel: model,
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
            title: '上架',
            type: 'primary',
            size: 'mini',
            icon: 'el-icon-circle-plus-outline',
            clickHandler: () => {
              console.log('ss')
            }
          },
          {
            title: '下架',
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
