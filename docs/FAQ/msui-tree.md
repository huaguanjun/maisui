# 如何创建树

## 1. 全量数据树

### 1.1 导入依赖
在使用`MsuiTree`之前，需要现在页面中导入

```js
import {MsuiTree} from 'msui-plguins'
```

### 1.2 创建容器
在`template`标签中添加容器与渲染节点
```html{2-4}
<template>
    <div class="tree-container">
        <div id="all-tree"></div>
    </div>
</template>
```

### 1.3 添加样式
在`style`标签中，添加如下样式
:::tip 提示
宽度和高度可以根据自己的需求来设置，但`overflow`最好设置一下
:::
```css{2-6}
<style scoped>
    .tree-container{
        width: 300px;
        height: 700px;
        overflow-y: auto;
    }
</style>
```

### 1.4 初始化与渲染
在`mounted`方法中，添加初始化代码

:::tip 提示
* `url: string`查询接口
* `queryParams: Record<string, any>`查询参数
:::

```js
const tree = new MsuiTree({
    // 查询接口
    url: 'resource/baseRes/resTypeExtensionSvc/listNew?showFlag=true',
    // queryParams 下面是查询参数
    queryParams: {
        includeResTypes: '',
        reservedNode: '',
        endNode: '',
        exclusionNode: ''
    }
});

tree.render('#all-tree');
```

## 2. 增量树

## 3. FAQ

### 3.1 后端的数据格式是怎样的？

后端需返回包含`rows`与`total`属性的数据集，同时应当保证在每一条数据中，至少包含`id`与`name`属性

```json
{
    "total": 1,
    "rows":
      [
        {
          "id":1,
          "name":"网络资源",
          "children":[]
        },
        {
          "id":2,
          "name":"设备资源",
          "children":[]
        },
      ]
}
```
