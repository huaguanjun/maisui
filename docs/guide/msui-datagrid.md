# 表格

用于展示多条结构类似的数据， 可对数据进行排序、筛选、对比或其他自定义操作。

## 基础表格

基础的表格展示用法。

<easyTable/>

### 代码

``` html
<template>
    <msui-datagrid :options="datagridOptions"/>
</template>
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

模板接收一个名为`options`的props，和一些表格抛出的事件

在代码中我们可以看到我们对传入`<msui-datagrid/>`标签的`:options`进行了初始化的设置，在初始化时我们需要执行`new MsuiDatagridModel()`,
`MsuiDatagridModel`是表格的模型层，下面我们来讲讲它

::: tip 提示
* `MsuiDatagridModel`参数支持`Object`类型的参数：可以配置以下参数
    
    1. MsuiDatagridModel
        * `dataModel`: `Object`表格模型
        * `align`: `string`表格的对齐方式
:::
通过执行`new MsuiDatagridModel()`我们会生成一个 表格模型的对象，生成对象中的属性和表格列一一对应，我们可以对属性进行一些特殊处理，下面我们对上面的表格进行一些功能上的扩展，我们看到`性别列`里对应的值是0和1,这样就不太友好，我们来对他进行一些处理。

### 表格字段formatter

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
        data:  [], // 表格数据
        index: true, // 表格索引，默认false
        selection: true, // 表格是否展示多选款，默认false
        expand: true, // 表格展开功能，默认false
        datagridModel: datagridModel, // 表格默认
        globalButton: [], // 表格的全局按钮
        inlineButton: [], // 表格的行内按钮
        attrs: {
            loading: false // 表格loding
            height: 500, // 表格高度
            maxHeight: null, // 表格的最大高度，默认值为null
            stripe:true, // 表格的斑马线展示，默认斑马线展示
            border: true, // 表格的边框，默认展示边框
            fit: true, //表格的宽度是否撑满页面，默认撑满
            showHeader:true, // 是否展示表头，默认展示
            highlightCurrentRow:false, // 是否高亮展示当前行，默认为false
            rowClassName: 无默认值，// 当前行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。	Function({row, rowIndex})/String
            rowSyle: 无默认值，//行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。	Function({row, rowIndex})/Object
            cellClassName: 无默认值，//单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className。	Function({row, column, rowIndex, columnIndex})/String
            cellStyle: 无默认值，//单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有单元格设置一样的 Style。Function({row, column, rowIndex, columnIndex})/Object
            headerRowClassName: 无默认值，//表头行的 className 的回调方法，也可以使用字符串为所有表头行设置一个固定的 className。	Function({row, rowIndex})/String
            headerCellStyle: 无默认值,//表头单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有表头单元格设置一样的 Style。	Function({row, column, rowIndex, columnIndex})/Object
            headerCellClassName: 无默认值//表头单元格的 className 的回调方法，也可以使用字符串为所有表头单元格设置一个固定的 className。	Function({row, column, rowIndex, columnIndex})/String
            rowKey: 无默认值//行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能与显示树形数据时，该属性是必填的。类型为 String 时，支持多层访问：user.info.id，但不支持 user.info[0].id，此种情况请使用 Function。	Function(row)/String
            expandRowKeys: [], // 可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。	Array
            defaultExpandAll: false, // 是否展开所有行，默认false
            emptyText: '暂无数据', //表格无数据时展示文案 默认 '暂无数据'"
            size: small, // 表格大小默认small
            tooltipEffect: 'dark', // 表格悬浮时展示文案的背景色，默认值为 'dark'
            sumText: '合计' // 合计行第一列的文本默认值为合计
            showSummary: false, //是否在表尾显示合计行
            summaryMethod: 无默认值, //自定义的合计计算方法 Function({ columns, data })
            selectOnIndeterminate: true, //在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为。若为 true，则选中所有行；若为 false，则取消选择所有行
            indent: 16 // 展示树形数据时，树节点的缩进
            spanMethod: 无默认值, //合并行或列的计算方法	Function({ row, column, rowIndex, columnIndex })
        },
        datagridFunction:  {
            //当用户手动勾选数据行的 Checkbox 时触发的事件	selection, row
            select: (selection, row) => {

            },
            // 当用户手动勾选全选 Checkbox 时触发的事件	selection
            selectAll (selection) => {

            },
            // 当选择项发生变化时会触发该事件	selection
            selectionChange (selection) => {

            },
            //当单元格 hover 进入时会触发该事件	row, column, cell, event
            cellMouseEnter (row, column, cell, event) => {

            },
            // 当单元格 hover 退出时会触发该事件	row, column, cell, event
            cellMouseLeave (row, column, cell, event) => {

            },
            // 当某个单元格被点击时会触发该事件	row, column, cell, event
            cellClick (row, column, cell, event) => {

            },
            // 当某个单元格被双击击时会触发该事件	row, column, cell, event
            cellDblclick (row, column, cell, event) => {

            },
            // 当某一行被点击时会触发该事件	row, column, event
            rowClick (row, column, event) => {

            },
            //当某一行被鼠标右键点击时会触发该事件	row, column, event
            rowContextmenu (row, column, event) => {

            },
            //当某一行被双击时会触发该事件	row, column, event
            rowDblclick (row, column, event) => {

            },
            //当某一列的表头被点击时会触发该事件	column, event
            headerClick (column, event) => {

            },
            // 当某一列的表头被鼠标右键点击时触发该事件	column, event
            headerContextmenu (column, event) => {

            },
            // 当表格的排序条件发生变化的时候会触发该事件	{ column, prop, order }
            sortChange ({ column, prop, order }) => {

            },
            // 当表格的筛选条件发生变化的时候会触发该事件，参数的值是一个对象，对象的 key 是 column 的 columnKey，对应的 value 为用户选择的筛选条件的数组。	filters
            filterChange ({}) => {

            },
            //当表格的当前行发生变化的时候会触发该事件，如果要高亮当前行，请打开表格的 highlight-current-row 属性	currentRow, oldCurrentRow
            currentChange (currentRow, oldCurrentRow) => {

            },
            //当拖动表头改变了列的宽度的时候会触发该事件	newWidth, oldWidth, column, event
            headerDragend (newWidth, oldWidth, column, event) => {

            },
            //当用户对某一行展开或者关闭的时候会触发该事件（展开行时，回调的第二个参数为 expandedRows；树形表格时第二参数为 expanded）	row, (expandedRows | expanded)
            expandChange (row,expaned) => {

            },
        },
      };
```
::: warning 警告
* 为了避免`this`的指向的混乱，`datagridFunction`中的函数尽量使用箭头函数去操作
:::

## 复杂表格

复杂表格一般包括表头的筛选功能，分页功能，全局按钮，和行内操作按钮，同时也有可能会使用到插槽
<easyTable2/>

### 代码

```html
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
```
::: tip
代码中配合使用了`<msui-form/>`,想了解的同学可以点击查看[msui-form](./msui-form.md)的使用文档
:::
### 使用插槽
```html
<msui-datagrid class="msui-datagrid" ref="msuiDatagrid" :options="model">
    <template #name="{ row, column, $index, name, curentModel }">
        <div>
            <el-button size="mini" type="primary">{{row.name}}</el-button>
        </div>
    </template>
    <!-- globalButton -->
    <template #globalButton="{selection}">
        <div>
            <el-button size="mini" type="primary">{{row.name}}</el-button>
        </div>
    </template>
    <!-- inLinebutton -->
    <template #inlineButton>
      <el-table-column align="center" fixed="right" label="操作" :width="inlineButton.length * 50">
        <template slot-scope="scope">
          <template v-for="(item, index) in inlineButton">
            <el-button
              :key="index"
              :title="item.title"
              :icon="item.icon"
              v-if="inlineButtonViable(item, scope.row)"
              :size="item.size || 'mini'"
              :type="item.type || 'text'"
              @click="item.clickHandler(scope, data, attrs)"
            />
          </template>
        </template>
      </el-table-column>
    </template>
</msui-datagrid>
```
就像上面代码所示，当分类名称需要显示特殊样式时，我们可以使用插槽，来解决表格的样式问题，插槽会带给你的参数如上面代码所示。
插槽名就是当前列的key值。

### globalButton

```js
globalButton: [
    {
        title: '查询',
        type: 'primary',
        size: 'mini',
        align:'right',
        icon: 'el-icon-search',
        clickHandler: (selection) => {
            this.$refs.form.submitForm()
        }
    },
    {
        title: '重置',
        size: 'mini',
        type: 'danger',
        icon: 'el-icon-refresh',
        clickHandler: (selection) => {
            this.$refs.form.resetForm()
        }
    }
]
```
globalButton接收一个数组，数组里面是对象，对象里面包括按钮的基本配置，和点击时执行的函数，点击时的回调参数`selection`时当前选中的数据

### inlineButton
```js
inlineButton: [
    {
        title: "删除",
        icon: "el-icon-delete",
        type: 'text',
        size: 'mini',
        clickHandler: (scope, data, attrs) => {
            console.log(row)
        },
        visable: (row) => {
            return row.name != "小明";
        },
    }
]
```
inlineButton接收一个数组，数组里面是对象，对象里面包括按钮的基本配置，和点击时执行的函数，点击时的回调参数是`scope, data, attrs`,
`visable` 是控制当前按钮显示是否显示

::: tip 提示
* `globalButton`和`inlineButton`都可以使用`插槽`去配置，当函数式的配置无法满足你的需求时你可以使用`插槽`方式进行配置,它们的插槽名就是`globalButton`和`inlineButton`,具体配置方式参考插槽使用demo
:::

### expand
```js
{
    expand: true
}
```
当expan配置为ture的时候,在msui-datagrid中必须配置一个名为`expandview`的插槽
```html
<msui-datagrid>
    <!-- expandView -->
    <template #expandView="{ row, options }">
        <component
            :is="expanView"
            :row="row"
            :options="options"
        />
    </template>
</msui-datagrid>
```
### index

```js
{
    index: {
        label: '序号',
        width: 100,
        align: 'center',
        indexMethod: (index) => {
            return index + 1
        }
    }
}

```
列表的序号可以简单的配置成一个Boolean值，但当简单的布尔值满足不了你的需求时，你可以把index配置成一个对象，对index进行一些处理

### selection
```js
{
    selection: {
        width: 100,
        align: ' center'
    }
}
```
列表的多选框可以简单的配置成一个Boolean值，但当简单的布尔值满足不了你的需求时，你可以把selection配置成一个对象，对selection进行一些处理

### 表格方法
```html
<template>
  <div>
    <msui-datagrid @rowClick="rowClick" :options="datagridOptions"/>
  </div>
</template>
<script>
export default {
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
    rowClick(a, bc, d, c) {
      console.log(a, bc, d, c);
    },
    initDatagridModel(model) {
      const datagridModel = new this.MsuiDataGridModel({
        dataModel: model,
        align: "center"
      });
      return {
        datagridModel,
        data: [{sex: 1, name: "小明", hobbies: "唱歌", job: "程序员"}],
        datagridFunction: {
          rowClick: (a, b, c, d) => {
            console.log(a, b, c, d);
          },
        },
      };
    },
  },
};
</script>
```
::: tip
就像上面写的`rowClick`方法，你可以把它配置在`datagridFunction`中也可以把它绑定到`template`结构上，然后在`methods`中定义此方法，使用方式任选一种，建议使用`datagridFunction`去配置
:::