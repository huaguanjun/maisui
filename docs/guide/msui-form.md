# 表单
用于提交数据

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

:::

如果表单不进行任何配置那么生成的元素都是input框，这是不能满足用户需求的，`msui-form`现提供以下组件的封装
```html
<msui-input/>
<msui-select-box/>
<msui-time-picker/>
<msui-upload/>
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