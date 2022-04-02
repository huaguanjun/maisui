# 资源入口点改造

## 1. 添加依赖
```js{1,3-5}
import {exportComponents} from 'msui-platform'
export default {
    components: {
        ResourceEntry: exportComponents.ResourceEntry
    }
}
```

## 2. 使用组件
在`template`标签中使用`ResourceEntry`组件
```html{2-5}
<div class="right">
    <ResourceEntry
        ref="resEntry"
    >
    </ResourceEntry>
</div>
```

## 3. 添加左侧树数据集
配置左侧菜单渲染的页面
```js{4,8,12,16}
modelList: [
    {
        name: '通信电源缺陷',
        component: () => import('./defectPowerNeRuleList')
    },
    {
        name: '光缆故障缺陷',
        component: () => import('./defectFiberRuleList')
    },
    {
        name: '传输设备缺陷',
        component: () => import('./defectSdhNeRuleList')
    },
    {
        name: '机房环境缺陷',
        component: () => import('./defectRoomRuleList')
    }
]
```

## 4. 添加点击事件
```js{2-18}
methods: {
    openModelPage(index){
        const curModel = this.modelList[index],
              modelComponent = curModel.component,
              resEntryRef = this.$refs.resEntry;

        if(!modelComponent)
            return console.error('[modelManage.vue]: 无法获取型号页面：%o', curModel.name);

        resEntryRef.entry({
            page: modelComponent,
            breadcrumb: {
                name: '缺陷规则管理'
            }
        });

        this.activeIndex = index;
    }
}
```
