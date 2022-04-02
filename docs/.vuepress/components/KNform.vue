<template>
  <div style="height: 100%; overflow: auto">
    <el-col :span="1">
      <msui-form ref="form1" :options="form1">
        <template #save> </template>
      </msui-form>
    </el-col>
    <el-col :span="23" style="margin-bottom: 30px">
      <msui-form ref="form2" :options="form2">
        <template #save> </template>
      </msui-form>
    </el-col>
    <msui-form ref="form3" :options="form3">
      <template #manifest="{ item }">
        <div class="special-form-box">
          <div class="title">
            <div class="main-title">manifest文件</div>
            <span><span style="color: red">*</span>限两张</span>
          </div>
          <div style="padding-left: 10px">
            应用配置文件(不超过1MB),包含应用及模块组件配置信息
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
      <template #img="{ item }">
        <div class="special-form-box">
          <div class="title">
            <div class="main-title">应用预览图</div>
            <span><span style="color: red">*</span>限两张</span>
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
        <div class="special-form-box jingxiang">
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
    return {
      loading: false,
      form1: this.initForm2({
        imgUrl: "应用图标",
      }),
      form2: this.initForm1({
        manufacturer: "开发厂商",
        version: "当前版本",
        group: "所属集群",
        deploymentName: "部署名称",
        appName: "应用名称",
        appCode: "应用编码",
        kind: "所属专业",
        type: "所属类别",
        url: "URL",
        desc: "应用描述",
      }),
      form3: this.initForm3({
        img: "", // 应用预览图
        manifest: "", // "manifest文件"
        jingxiang: "", // 镜像列表
        actor: "", //角色授权
      }),
      result: {},
    };
  },
  mounted() {
    this.postForm = (data) => {
      return this.$http.post(`${this.$api.PRE}/appRegister/addApp`, data);
    };
    this.imgUrlPost = (data) => {
      return this.$http.post(`${this.$api.PRE}/appRegister/addAppImgUrl`, data);
    };
  },
  methods: {
    resetForm() {
      const refs = ["form1", "form3", "form2"];
      refs.forEach((item) => {
        this.$refs[item].resetForm();
      });
      this.result = {};
    },
    submitForm() {
      const refs = ["form1", "form3", "form2"];
      refs.forEach((item) => {
        this.$refs[item].submitForm();
      });
      const currentData = Object.assign(
        {},
        this.form1.formModel,
        this.form2.formModel,
        this.form3.formModel
      );

      if (Object.keys(currentData).length === Object.keys(this.result).length - 2) {
        this.loading = true;
        const result = this.MsuiUtils.cloneDeep(this.result);
        result.imgUrl = result.imgUrl.map((item) => item.url)[0];
        result.img = result.img.map((item) => {
          return {
            img: item.url,
            tenantCode: result.appCode,
          };
        });
        this.postForm(result)
          .then(() => {
            return this.imgUrlPost([...result.img]);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    initForm1(formModel) {
      formModel = new this.MsuiFormModel(formModel);
      formModel.addRules([
        { required: true, message: "必填字段不能为空", trigger: "blur" },
      ]);
      formModel.desc.type({
        type: "textarea",
        span: 24,
        rows: 8,
      });
      formModel.type.type(
        {
          options: [
            {
              label: "基础管理",
              value: "基础管理",
            },
            {
              label: "分析决策",
              value: "分析决策",
            },
            {
              label: "作业管理",
              value: "作业管理",
            },
            {
              label: "设备管理",
              value: "设备管理",
            },
          ],
        },
        "Msui-SelectBox"
      );
      formModel.kind.type(
        {
          options: [
            {
              label: "输电专业",
              value: "ts",
            },
            {
              label: "变电专业",
              value: "t",
            },
            {
              label: "直流专业",
              value: "dc",
            },
            {
              label: "配电专业",
              value: "ds",
            },
            {
              label: "技术专业",
              value: "tc",
            },
            {
              label: "计划专业",
              value: "pl",
            },
            {
              label: "综合专业",
              value: "im",
            },
          ],
        },
        "Msui-SelectBox"
      );
      return {
        labelWidth: "200px",
        labelPosition: "right",
        size: "small",
        disabled: false,
        formModel: formModel,
        inline: false,
        save: (res) => {
          res.userId = this.$store.getters["userId"];
          res.userName = this.$store.getters["username"];
          this.result = Object.assign({}, this.result, res);
        },
        span: 8,
      };
    },
    initForm2(formModel) {
      formModel = new this.MsuiFormModel(formModel);
      formModel.addRules([
        { required: true, message: "必填字段不能为空", trigger: "blur" },
      ]);
      formModel.imgUrl.type(
        {
          limit: 1,
          beforeUpload: (file) => {
            if (file.size / 1024 > 50 || file.raw.type.indexOf("image") < 0) {
              this.$message({
                type: "error",
                message: "上传的图标大小要小于50KB",
              });
              return false;
            }
            return true;
          },
        },
        "msui-upload"
      );
      return {
        labelWidth: "1",
        labelPosition: "right",
        size: "small",
        disabled: false,
        formModel: formModel,
        inline: true,
        save: (res) => {
          this.result = Object.assign({}, this.result, res);
        },
        span: 24,
      };
    },
    initForm3(formModel) {
      formModel = new this.MsuiFormModel(formModel);
      formModel.manifest.type(
        {
          limit: 2,
        },
        "msui-upload"
      );
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
      formModel.actor.type(
        {
          limit: 2,
        },
        "msui-upload"
      );
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
  margin: 10px;
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
  background: rgb(13, 134, 127);
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
