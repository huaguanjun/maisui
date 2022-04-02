/**
 * msui-util msui-ui工具类
 * Created by liangwenzheng on 2020-02-14
 */


'use strict';

import MsuiConstructor from './../../msui-constructor'

class MsuiUtil extends MsuiConstructor{

    static _pluginName = '$MsuiUtil';

    constructor() { super(); }

    /**
     * 实现Vue加载插件规则
     *
     * */
    static install(Vue, options) {
        super.install(Vue, this, this._pluginName);
    }

    /**
     * 注册派生组件
     * @param Plugin { MsuiElement } MsuiElement 的派生类
     * @param options { Object =} 配置参数
     * */
    static add(Plugin, options) {
        super.add(this,Plugin,options);
    }
}

export default MsuiUtil;
