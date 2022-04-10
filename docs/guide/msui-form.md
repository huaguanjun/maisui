# 表单
## 基础表单

基础的表格展示用法。

<easyForm/>

### 代码

``` html
<template>
    <msui-form :options="form"></msui-form>
</template>

<script>
export default {
  name: "easyForm",
  data() {
    return {
      form: this.initForm({
        name: "姓名",
        sex: "性别",
        birthday: "生日",
        age: "年龄",
        hobby: "爱好",
        gongzuo: "工作",
      })
    };
  },
  methods: {
    initForm(formModel) {
      formModel = new this.MsuiFormModel(formModel);
      return {
        labelWidth: "80px",
        labelPosition: "right",
        size: "small",
        disabled: false,
        formModel: formModel,
        inline: true,
        span: 4,
      };
    },
  },
};
</script>

```

`msui-form`接收一个名为`options`的props

在代码中我们可以看到我们对传入`<msui-form/>`标签的`:options`进行了初始化的设置，在初始化时我们需要执行`new MsuiFormModel()`,
`MsuiFormModel`是表单的模型层，下面我们来讲讲它

通过执行`new MsuiFormModel()`我们会生成一个表单模型的对象，生成对象中的属性和表单列一一对应

::: tip
* `MsuiFormModel`提供的方法
    
    1. MsuiDatagridModel
        * `setData(Object)`: `Object` 给表单赋值
        * `addRules(Object| Array)`: `Object | Array` 给表单加统一的校验规则
:::

### msui-form
基础配置
::: tip
* `msui-form`提供的方法

    * `labelWidth: "80px"` —— `String` 表单的title宽度
    * `labelPosition: "right"` —— `String` 表单title的position
    * `size: "small"` 表格的元素大小配置，具体值配置参照element-ui
    * `disabled: false` 表格是否可编辑 `Boolean`
    * `formModel: formModel` Object 通过`MsuiDatagridModel`生成的表格模型 `必填项`
    * `inline: true` 是否为inline属性的表单
    * `span: 4` 表单一个属性所占的宽度,最大值为24 number
    * `showButton: false` 是否展示保存和重置按钮,默认值true
    * `save: (result) => {}` 在执行保存逻辑时会执行到这里
    * `reset: () => {}` 在执行表单重置逻辑时会执行到这里

:::

如果表单不进行任何配置那么生成的元素都是input框，这是不能满足用户需求的，`msui-form`现提供以下组件的封装
```html
<msui-input/>
<msui-select-box/>
<msui-time-picker/>
```
若需要使用其他组件，我们可以在表单里面配置插槽

下面我们来介绍如何在`msui-form`使用它们

#### 在form中使用msui-input
```js
    formModel = new this.MsuiFormModel(formModel);
    formModel.name
    .type({
        placeholder: "请输入名称",
        showWordLimit: true,
        minLength: 10,
        maxLength: 200,
        clearable: true,
        showWordLimit: true,
        tabindex: "123",
        validateEvent: false,
        change: () => {
           formModel.age.value = 18;
        },
        input: () => {
           formModel.birthday.value = "1996/10/17";
        },
    }, 'msui-input');
```
#### 在from中使用msui-selectBox
```js
    formModel.sex.type(
    {   // options支持promise
        options: [{
            label: "男",
            value: 1,
        },
        {
            label: "女",
            value: 0,
        }],
        change: (value) => {
            console.log(value)
        }
    },
    "msui-selectBox"
    );
```
::: tip
`type`方法接收两个参数，第一个参数是一个对象，对使用的组件进行一些配置，第二个参数时一个String，是注册的全局组件的`name`值
:::

当然表单的每一项的配置不止有这一个方法，下面我们来具体介绍一下表单项提供的方法

### form-item-methods
```js
// 给表单添加验证规则
addRules(rules)
// 给表单的塞值
setValue(value)
// 对表单的某一项设置可以链式调用

formModel.name.type({}).addRules([]).setvalue(1)
```
### from-methods
```js
// 这两个方法是<msui-form/>提供的使用时需要和refs配合使用
this.$refs.form.resetForm() // 重置表单
this.$refs.form.submitForm() // 提交表单
```
## 复杂表单

<KNform/>

贴上实现代码

```html
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
        console.log(result)
        alert('提交结果在控制台输出')
        this.loading = false;
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
            {label: "输电专业", value: "ts"},
            {label: "变电专业", value: "t" },
            {label: "直流专业", value: "dc"}
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
      formModel.actor.setValue([]);
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
```
::: tip
  我们可以看到，在`穿梭框`的使用上,我们使用了插槽，为什么会使用插槽呢，因为麦穗并没有对`穿梭框`进行封装，但我们在使用表单时肯定会遇到一些奇怪的表单组件这个时候就需要我们使用插槽来解决特殊元素的处理。在下面我们会把这部分代码单独拆出来介绍。
:::

### 表单插槽使用

```html
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
<script>
export default {
  method: {
    initForm(formModel) {
        formModel = new this.MsuiFormModel(formModel);
        formModel.actor.setValue([]);
    }
  }
}
</script>
```
::: tip
   在进行表单初始化时我们会对表单绑定的值进行初始化，因为对特殊组件绑定值类型的不确定，所以我们一定要给特殊元素绑定的值设置一个初始值
   `formModel.actor.setValue([]);`
:::

### 复杂表单保存逻辑
```html
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
<script>
export default {
  method: {
    //重置表单
    resetForm() {
      const refs = ["form1", "form2"];
      refs.forEach((item) => {
        this.$refs[item].resetForm();
      });
      this.result = {};
    },

    // 保存表单
    submitForm() {
      const refs = ["form1", "form2"];
      refs.forEach((item) => {
        this.$refs[item].submitForm();
      });

      //表单实际的对象长度
      const currentData = Object.assign(
        {},
        this.form1.formModel,
        this.form2.formModel
      );

      // 表单的实际长度和this.result的长度做对比
      if (Object.keys(currentData).length === Object.keys(this.result).length) {
        this.loading = true;
        const result = this.MsuiUtils.cloneDeep(this.result);
        console.log(result)
        alert('提交结果在控制台输出')
        this.loading = false;
      }
    },
    initForm1() {
      return {
        save: (result) => {
          this.result = Object.assign(this.result, result)
        }
      }
    },
    initForm2() {
      return {
        save: (result) => {
          this.result = Object.assign(this.result, result)
        },
        reset: () => {
          // 当表单进行重置时的回调函数
        }
      }
    }
  }
}
</script>
```
::: tip
  有时候表单的样式很复杂这个时候一个msui-form可能解决不了表单样式的问题，如上面的复杂例子所示，这个时候可能会需要使用到多个msui-form
  在这个时候保存表单的逻辑会变得复杂一点，我们把上面的保存逻辑单独拿出来看一下,如上面的代码所示，当我们在执行这个复杂表单的保存逻辑时，我们进行了循环
  执行了每个个form的保存逻辑，当验证通过时，他会执行我们在配置表单时配置的回调函数`save`,当获取的result长度和form的实际长度相等时我们进行保存逻辑的执行。
:::