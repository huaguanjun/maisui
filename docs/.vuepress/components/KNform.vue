<template>
  <div style="margin-top: 30px;">
    <msui-form ref="form1" :options="form1"/>
    <msui-form ref="form2" :options="form2">
      <template #img="{ item }">
        <div class="special-form-box">
          <div class="title">
            <div class="main-title">应用预览图</div>
            <span style="color:black"><span style="color: red">*</span>限两张</span>
          </div>
          <div style="padding-left: 10px">
            应用预览图(不超过1MB),包含应用及模块组件配置信息
          </div>
          <div style="padding-left: 10px">
            <component
              v-model="item.value"
              :is="item.render()"
              :attrs="item.getAttrs()"
            />
          </div>
        </div>
      </template>
      <template #jingxiang="{ item }">
        <div class="special-form-box">
          <div class="title">
            <div class="main-title">镜像列表</div>
          </div>
          <div style="margin: 0 10px">
            <component
              v-model="item.value"
              :is="item.render()"
              :options="item.getAttrs()"
            />
          </div>
        </div>
      </template>
      <template #actor="{ item }">
        <div class="special-form-box jingxiang">
          <div class="title">
            <div class="main-title">角色授权</div>
          </div>
          <div style="padding-left: 10px; margin: 0 auto">
            <el-transfer v-model="item.value" :data="transferData"></el-transfer>
          </div>
        </div>
      </template>
      <template #save>
        <el-col :span="24" style="text-align: center">
          <el-form-item>
            <el-button @click="resetForm">重置</el-button>
            <el-button @click="submitForm" type="primary" :loading="loading"
              >保存</el-button
            >
          </el-form-item>
        </el-col>
      </template>
    </msui-form>
  </div>
</template>

<script>
export default {
  name: "myForm",
  data() {
    const generateData = _ => {
        const data = [];
        const cities = ['上海', '北京', '广州', '深圳', '南京', '西安', '成都'];
        const pinyin = ['shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu'];
        cities.forEach((city, index) => {
          data.push({
            label: city,
            key: index,
            pinyin: pinyin[index]
          });
        });
        return data;
      };
    return {
      transferData: generateData(),
      loading: false,
      form1: this.initForm1({manufacturer: "开发厂商",version: "当前版本",group: "所属集群",deploymentName: "部署名称",appName: "应用名称",appCode: "应用编码",kind: "所属专业",type: "所属类别",url: "URL",desc: "应用描述",}),
      form2: this.initForm2({img: "",jingxiang: "",actor: ""}),
      result: {},
    };
  },
  methods: {
    resetForm() {
      const refs = ["form1", "form2"];
      refs.forEach((item) => {
        this.$refs[item].resetForm();
      });
      this.result = {};
    },
    submitForm() {
      const refs = ["form1", "form2"];
      refs.forEach((item) => {
        this.$refs[item].submitForm();
      });
      const currentData = Object.assign(
        {},
        this.form1.formModel,
        this.form2.formModel
      );

      if (Object.keys(currentData).length === Object.keys(this.result).length) {
        this.loading = true;
        const result = this.MsuiUtils.cloneDeep(this.result);
        alert(result)
      }
    },
    initForm1(formModel) {
      formModel = new this.MsuiFormModel(formModel);
      formModel.addRules([{ required: true, message: "必填字段不能为空", trigger: "blur" }]);
      formModel.desc.type({type: "textarea",span: 24, rows: 8});
      formModel.type.type({
          options: [
            {label: "基础管理", value: "基础管理"},
            {label: "分析决策", value: "分析决策"},
            {label: "作业管理", value: "作业管理"}
          ]
        },"Msui-SelectBox");
      formModel.kind.type(
        {
          options: [
            {label: "输电专业",value: "ts"},
            {label: "变电专业",value: "t"},
            {label: "直流专业",value: "dc"}
          ],
        },"Msui-SelectBox");
      return {
        labelWidth: "100px",
        labelPosition: "right",
        size: "small",
        disabled: false,
        formModel: formModel,
        inline: false,
        save: (res) => {
          this.result = Object.assign({}, this.result, res);
        },
        showButton: false,
        span: 8,
      };
    },
    initForm2(formModel) {
      formModel = new this.MsuiFormModel(formModel);
      formModel.img.type(
        {
          limit: 2,
          beforeUpload: (file) => {
            if (file.size / 1024 > 400 || file.raw.type.indexOf("image") < 0) {
              this.$message({
                type: "error",
                message: "上传的预览图大小要小于400KB",
              });
              return false;
            }
            return true;
          },
        },
        "msui-upload"
      );
      formModel.jingxiang.type(
        {
          data: [],
          index: true,
          datagridModel: this.initFormDataGrid({
            name: "名称",
            jingxing: "镜像",
            version: "版本号",
          }),
          globalButton: [
            {
              type: "text",
              title: "新增",
              icon: "el-icon-folder-add",
              clickHandler: () => {
                console.log("cc");
              },
            },
          ],
          attrs: {},
        },
        "msui-datagrid"
      );
      formModel.actor.type({limit: 2, span: 24});
      return {
        labelWidth: "0",
        labelPosition: "right",
        size: "small",
        disabled: false,
        formModel: formModel,
        inline: false,
        save: (res) => {
          this.result = Object.assign({}, this.result, res);
        },
        showButton: false,
        span: 12,
      };
    },
    initFormDataGrid(dataModel) {
      return new this.MsuiDataGridModel({
        dataModel,
        align: "left",
      });
    },
  },
};
</script>
<style scoped>
.special-form-box {
  height: 240px;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}
.special-form-box.jingxiang {
  height: 350px;
}
.special-form-box .title {
  font-size: 18px;
  flex: 0 0 40px;
  display: flex;
  line-height: 40px;
  text-align: center;
  color: white;
}
.main-title {
  background: #409EFF;
  text-align: center;
  flex: 0 0 150px;
  padding: 0 10px;
  margin-right: 10px;
}
.main-title span {
  color: black;
  font-size: 14px;
}
</style>
