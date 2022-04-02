# 属地化模拟改造

修改资源的`数据维护单位`成功后，模拟提示属地化完成

## 示例
下面以 `neDetail.vue` 为例：

### 1. 添加`MsuiNotify依赖`

``` js
import {MsuiNotify} from 'msui-plugins'
```

### 2. 添加控制变量 
在 `data` 中定义 `cacheMaintenanceDept: null` 与 `localized: false` 变量，用于判断是否更改了`数据维护单位`
``` js{3-4}
data(){
    return {
        localized: false
        cacheMaintenanceDept: null
        ... 省略
    }
}
```

### 3. 进入表单页面时缓存`数据维护单位`的值
在每次进入表单页面时，编辑和查看都会进入`queryFormData`方法

::: warning 注意
**在缓存数据前，一定要仔细核对`数据维护单位`的字段名称**
:::

``` js{2,6-11}
queryFormData(parentId) {
    const self = this;
    return new MsuiAxios({
        url: baseUrl
    }).sender({guid: parentId}).then(function (data) {
        const resultData = data.obj;
        // 缓存数据维护单位
        if(resultData.hasOwnProperty('maintenanceDept')){
            self.cacheMaintenanceDept = resultData.maintenanceDept;
        }
        return resultData;
    });
}
```

### 4. 验证是否更改了`数据维护单位`
如果更改了，将`localized`的值更改为true
``` js{3,5-12}
before: (data) => {

    const maintenanceDept = data[0].maintenanceDept || data[1].maintenanceDept;
    
    // 判断属地化是否完成(没有数据维护单位数据时)
    if(this.cacheMaintenanceDept === null){
        maintenanceDept !== void 0 && (this.localized = true)
    }
    // 有数据维护单位时   
    else{
        this.cacheMaintenanceDept !== maintenanceDept && (this.localized = true)
    }

    return {
        ...data[0],
        ...data[1],
        resourceType: this.staticResType,
        extParam: JSON.stringify(data[1])
    }
}
```

### 5. 发送`属地化完成`通知
``` js
success: () => {
    if(this.localized){
        setTimeout(() => {
            MsuiNotify.success('属地化完成！');
        }, 3000);
    }
}
```

## 需要改动的页面

### 1. 设备表单 `neDetailView.vue`
