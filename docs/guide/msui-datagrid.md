# 创建表格

用于展示多条结构类似的数据， 可对数据进行排序、筛选、对比或其他自定义操作。

## 基础表格

基础的表格展示用法。

<easyTable/>

### step1. template模块

``` html
<template>
    <msui-datagrid :options="datagridOptions"/>
</template>
```

模板接收一个名为`options`的props，和一些表格抛出的事件

### step2.js模块

``` js
<script>
    export default {
    name: 'easyTable',
    data() {
        return {
        datagridOptions: this.initDatagridModel({
            name: "姓名",
            sex: "性别",
            hobbies: "爱好",
            job: "工作",
        }),
        };
    },
    methods: {
        initDatagridModel(model) {
        const datagridModel = new this.MsuiDataGridModel({
            dataModel: model,
            align: "center",
        });
        return {
            datagridModel,
            data: [
                { sex: 1, name: "小明", hobbies: "唱歌", job: "程序" },
                { sex: 0, name: "小红", hobbies: "跳舞", job: "文员" },
                { sex: 1, name: "小明", hobbies: "唱歌", job: "程序" },
                { sex: 0, name: "小红", hobbies: "跳舞", job: "文员" }
            ]
        };
        },
    },
    };
</script>
```
在代码中我们可以看到我们对传入`<msui-datagrid/>`标签的`:options`进行了初始化的设置，在初始化时我们需要执行`new MsuiDatagridModel()`,
`MsuiDatagridModel`是表格的模型层，下面我们来讲讲它

::: tip 提示
* `MsuiDatagridModel`参数支持`Object`类型的参数：可以配置以下参数
    
    1. MsuiDatagridModel
        * `dataModel`: `Object`表格模型
        * `align`: `string`表格的对齐方式
:::
通过执行`new MsuiDatagridModel()`我们会生成一个 表格模型的对象，生成对象中的属性和表格列一一对应，我们可以对属性进行一些特殊处理，下面我们对上面的表格进行一些功能上的扩展，我们看到`性别列`里对应的值是0和1,这样就不太友好，我们来对他进行一些处理。

### step3.配置表格模型

``` js
    const datagridModel = new this.MsuiDataGridModel({
        dataModel: model,
        align: "center",
    });

    datagridModel.sex
    .formatterData({
        // data: [
        //   {
        //     label: "男",
        //     value: 1,
        //   },
        //   {
        //     label: "女",
        //     value: 0,
        //   },
        // ],
        data: new Promise((reslove) => {
        setTimeout(() => {
            reslove([
            {
                label: "男",
                value: 1,
            },
            {
                label: "女",
                value: 0,
            },
            ]);
        }, 1000);
        }),
    })
    .formatter((value) => {
        return datagridModel.sex.data.find((item) => item.value === value)?.label;
    });
```
格式化后的表格
<easyTable1/>

我们通过调用了表格列的`formatterData`和`formatter`方法对表格列进行了格式化，当然表格列具备的功能当然不止这些，下面让我来介绍表格列的详细功能：

::: tip 提示
* `MsuiDataGridItemModel`提供的方法
    
    1. MsuiDatagridModel
        * `setWidth(Number)`: `Number` 当前列的宽度
        * `setAlign('left')`: `String` 当前列的对齐方式,可选参数参照`element-ui`
        * `setType(String)` : `String`  对表格当前列进行特殊标记
        * `setEdit(Boolean)`: `Boolean` 对表格当前列进行特殊标记
        * `formatter(callBack)`: `Function(value)` 对当前列的数据进行格式化，回调函数接收当前列的真实值作为参数
        * `formatterData({data:[]})` : `Object` 当格式化的规则来自服务端或其他数据，这时你可以配置一个`data`, `data`支持`Promsie`配置
:::

### step4.配置表格

`options`是配置表格的一个对象，我们在上面已经使用过了，下面我来介绍一下它具备的详细功能
```js
      this.datagridOptions = {
        data:  [],
        index: true,
        selection: true,
        expand: true,
        datagridModel: datagridModel,
        globalButton: [],
        inlineButton: [],
        attrs: {
           height: 500,
           loading: false
        },
        datagridFunction:  {
            cellDblclick: (data, b, dom) => {
                console.log(data)
            },
        },
      };
```

::: tip 提示
* `loader`参数支持`string`或`Object`类型的参数：

    1. 当参数为`string`类型时，将作为查询后台的接口
    
    2. 当参数为`Object`类型时，将自定义查询配置
        * `url`: `string`请求路径
        * `method`: `string`请求方法类型
        * `data`: `Object`请求参数
        * `success`: `Function`请求成功回调
        * `error`: `Function`请求失败回调
        
    3. 当参数为`MsuiAxios`类型时，表格使用该实例作为请求实例

当然,`modularProxy`的配置不止这些，[查看modularProxy更多配置]()
:::

通过这两个配置能够绘制一个最基础的表格

``` js
const grid = new MsuiDataGrid({
    dataModel: gridModel,
    modularProxy: {
        loader: {
            url: '/dataApi/grid.json'
        }
    }
});
```

### step5.渲染与查询

调用render方法并且传入`string`或`Element`类型的参数。
::: tip 提示
如果参数类型为`string`，表格会将该类型的参数作为查询DOM的名称调用`querySelector`方法来获取DOM。\
如果参数类型为`Element`，表格将会直接使用该类型的参数作为渲染节点。
:::

``` js
grid
    .render('#myFirstGrid')
    .load();
```

## 注意事项

::: tip 提示

这是一个自定义的组件

:::



::: warning 注意
这是ElementUI的组件
<el-button>ClickMe</el-button>
:::
