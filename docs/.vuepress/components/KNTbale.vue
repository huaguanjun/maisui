<template>
  <div class="model-right">
    <div class="table-header">
      <msui-form :options="form" ref="form">
        <template #save>
          <el-form-item class="special-save">
            <el-button @click="$refs.form.submitForm()" type="primary"
              >查询</el-button
            >
            <el-button @click="$refs.form.resetForm()">重置</el-button>
          </el-form-item>
        </template>
      </msui-form>
    </div>
    <model-list-core
      :model="model"
      :url="url"
      :params="mergeParams"
      @changeData="changeData"
    />
  </div>
</template>

<script>
import modelListCore from './modelListCore';
export default {
  name:'KNTable',
  components: {
    modelListCore
  },
  props: {
    params: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    mergeParams() {
      return {
        ...this.params,
        ...this.paramsKeyword
      }
    }
  },
  data() {
    return {
      model: {},
      keyword: '',
      paramsKeyword: {},
      url: {
        get: '/api-tenant/v1/tenantselect',
        post: '/api-tenant/v1/tenantupdata'
      },
      form: this.initForm({
        name: "应用名称",
        sex: "所属专业",
        birthday: "所属中心",
        age: "所属类别",
        hobby: "应用状态"
      }),
    }
  },
  created() {
    this.initModel({
      tenantGroupName: "分类名称",
      tenantGroupCode: "分类代码",
      tenantGroupPcode: "上级分类编码",
      tenantGroupCtime: "创建时间",
      tenantGroupUserName: '创建人'
    }),
      this.initAxios()
  },
  methods: {
    initAxios() {
      // 新增
      this.addList = (data) => {
        return this.$http.post(`${this.$api.PRE}/api-tenant/v1/tenantinster`, data);
      };
      // 删除
      this.deleteData = (data) => {
        return this.$http.post(`${this.$api.PRE}/api-tenant/v1/tenantdelete`, data);
      };
    },
    changeData({ data }, datagridOptions, pageOptions) {
      datagridOptions.data = data.records;
      pageOptions.total = data.total;
    },
    initForm(formModel) {
      formModel = new this.MsuiFormModel(formModel);
      formModel.name
        .type({
          placeholder: "请输入名称",
          options: new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve([{
                label: 'ss',
                value: 'ss'
              }])
            }, 3000)

          })
        },
          'MsuiSelectBox');

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
      formModel.hobby.type(
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
        }
      };
    },
    initModel(dataModel) {
      const model = new this.MsuiDataGridModel({
        dataModel,
        align: "left",
      });
      model.tenantGroupCtime.formatter((row) => {
        return (new Date(row).format("yyyy-MM-dd hh:mm:ss"));
      })
      model.tenantGroupName.setEdit(true)
      this.model = {
        datagridModel: model,
        data: [],
        globalButton: [
          {
            title: '上架',
            type: 'text',
            icon: 'el-icon-circle-plus-outline',
            clickHandler: () => {
              console.log('ss')
            }
          },
          {
            title: '下架',
            type: 'text',
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
              this.MsuiMessage({
                text: "确定要删除此条数据吗？",
                errorMessage: '取消删除',
                successCallBack: () => {
                  this.deleteData(row).then(({ data }) => {
                    this.$message({
                      message: data.desc,
                      type: data.success ? 'success' : 'error'
                    });
                    if (data.success) {
                      rows.splice($index, 1);
                      this.$bus.$emit('removeTreeChild', row)
                    }
                  }).catch(err => {
                    this.$message({
                      message: '删除失败',
                      type: 'error'
                    });
                  })
                }
              })
            }
          }
        ],
        datagridFunction: {}
      };
    }
  }
}
</script>
<style lang="less" scoped>
.model-right {
  flex: 1;
  height: 100%;
  margin-left: 20px;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 0 0 54px;
    position: relative;
    .special-save {
      position: absolute;
      right: 0px;
      margin-right: 0;
    }
  }
}
</style>
