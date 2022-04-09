<template>
  <div class="model-right">
    <div class="table-header">
      <msui-form :options="form" ref="form">
        <template #save>
        </template>
      </msui-form>
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
        name: "应用名称",
        sex: "所属专业",
        birthday: "所属中心",
        age: "所属类别"
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
      name: "分类名称",
      code: "分类代码",
      pcode: "上级分类编",
      ctime: "创建时间",
      userName: '创建人'
    })
  },
  methods: {
    pageChange(currentPage = 1, pageSize) {
      let data = []
      for (let k = 0; k < pageSize; k++) {
         data.push({
          name: "ceshi",
          code: "ceshi",
          pcode: "ceshi",
          ctime: "ceshi",
          userName: 'ceshi'
        })
      }
      this.model.data = data
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
        index: true,
        expand: true,
        selection: true,
        size:'mini',
        data: [{
          name: "ceshi",
          code: "ceshi",
          pcode: "ceshi",
          ctime: "ceshi",
          userName: 'ceshi'
        }],
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
