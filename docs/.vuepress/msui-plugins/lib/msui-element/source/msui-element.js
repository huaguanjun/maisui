'use strict'

import MsuiConstructor from './../../msui-constructor'
import MsuiVueTemplate from '../../msui-common/source/msui-vue-template'
import MsuiFragment from "./../../msui-fragment/msui-fragment-new";
import { _eachObj, _errorFactory } from "../../msui-common/source/_self-util";
import {MSUI_ELEMENT_CONSTANT} from "../../msui-common/source/msui-constant";

const REF_FLAG = '$msuiEleRef';
const REF_REG = /msuiRef/;
const CUSTOM_REG = /msuiCustom/;
let REF_FLAG_INDEX = 0;

const lifeCycleArrays = ['destroyed','beforeMount','mounted'];
const combineLifeCycle = function(vueConfig){
    lifeCycleArrays.forEach( curCycle => {
        if(this[curCycle]){
            vueConfig[curCycle] = this[curCycle];
        }
    });
};

const _error = _errorFactory(MSUI_ELEMENT_CONSTANT);

/**
 *
 * MsuiElement
 * @author sq
 *
 * @abstract
 *
 * */
const _isRendered = Symbol('_isRendered');

class MsuiElement extends MsuiConstructor {

    static _pluginName = '$MsuiElement';

    /**
     *
     * @this this.content { Object } Vue.Components 模型
     *       this.content.methods { Object } Vue methods 模型
     *       this.content.template { String } element-ui 渲染标签
     *
     * @this this.options { Object } 配置项
     *
     * */
    constructor(){

        super();

        if(new.target === MsuiElement) throw new Error('抽象类不能被直接调用');

        // vue构造参数
        this.msui_element_config = new MsuiVueTemplate;

        // vueComponent实例
        this.msui_element_instance = null;

        // 插件的配置
        this.msui_plugin_config = {
            el: null,
            custom: {},
            msuiPlugins: {},
            fragments: {},
            loading:false
        };

        this[_isRendered] = false;

    }

    setEl(el){
        this.msui_plugin_config.el = el;
        return this;
    }

    _renderCombinatorialPlugins(plgCfg){

        const plugins = plgCfg.msuiPlugins;

        if(void 0 === plugins) return;

        _eachObj(plugins, (k, v) => {
            this[k] = v.render();
        });
    }

    _renderCombinatorialFragments(eleCfg, plgCfg){

        const fragments = plgCfg.fragments;

        if(void 0 === fragments) return;

        _eachObj(fragments, (k, v) => {
            // this[k] = v.mergeScope(eleCfg.data,eleCfg);
            // element原型中的碎片目前由 addFragment 方法添加
            v.mergeScope(eleCfg.data,eleCfg);
        });
    }

    _mergeCustomOptions(eleCfg, plgCfg){

        let customConfig = plgCfg.custom;

        if(void 0 === customConfig || Object.keys(customConfig).length === 0 )
            return;

        let customData = customConfig.data,
            customMethods = customConfig.methods,
            customTemplate = ``;

        if(Object.keys(customData).length > 0){
            let dataKeys = Object.keys(customData), i = dataKeys.length;
            while(i--)
                customTemplate += ` :${_.kebabCase(dataKeys[i])}='${dataKeys[i]}' `;
        }

        if(Object.keys(customMethods).length > 0){
            let methodKeys = Object.keys(customMethods), i = methodKeys.length;
            while(i--)
                customTemplate += ` @${_.kebabCase(methodKeys[i])}='${methodKeys[i]}' `;
        }

        _.merge(eleCfg, customConfig);

        return customTemplate;
    }

    /**
     *
     * render
     *
     * 在该方法中，使用模板字符串将构造函数中接收的各项参数，按照需求和逻辑渲染成element-ui标签。
     *
     * 渲染完成后，返回this.content，作为Vue组件的实例
     *
     * */
    render(el) {

        try{

            // 判断Vue运行环境
            const checkResult = MsuiElement.checkVueRuntime();

            if(!checkResult){
                return _error('NO_SUCH_RUNTIME');
            }

            // 判断该组件是否已经渲染
            if(this.checkRendered()){
                return _error('RENDERED_ERROR');
            }

            let plgCfg = this.msui_plugin_config,
                pluginEl = plgCfg.el,
                curEl;

            // 是否有节点可以渲染
            if(_.isString(pluginEl) || (pluginEl instanceof Element))
                curEl = pluginEl;
            else if(_.isString(el) || (el instanceof Element)){
                curEl = el;
            }else
                return _error('NO_SUCH_ELEMENT');

            // 获取元素DOM
            let selector = MsuiElement.getCurrentDOM().querySelector(curEl);

            // 节点是否有效
            if(!selector)
                return _error('NO_SUCH_ELEMENT');


            let eleCfg = this.msui_element_config,
                curRefKey = '';

            // 渲染模板内容为空
            if(eleCfg.template === '')
                return _error('EMPTY_TEMPLATE_ERROR');

            // 为添加了msuiRef关键字的模板构造 映射关键字
            if(REF_REG.test(eleCfg.template)){
                curRefKey = REF_FLAG + REF_FLAG_INDEX++;
                eleCfg.template = eleCfg.template.replace(REF_REG, ` ref='${curRefKey}'`);
            }

            // 处理组件 与 组件碎片 之间的组合、聚合关系
            this._renderCombinatorialFragments(eleCfg, plgCfg);

            // 合并使用者自定义的参数并构造单例data TODO：（这里之后elementConfig.data将变为function对象，如果需要处理data，在这之前处理）
            let customTemplate = this._mergeCustomOptions(eleCfg, plgCfg);
            if(customTemplate !== ''){
                eleCfg.template = eleCfg.template.replace(CUSTOM_REG, customTemplate);
                let newData = eleCfg.data;
                eleCfg.data = () => { return newData };
            }

            // 合并组件的生命周期
            combineLifeCycle.call(this, this.msui_element_config);

            // 渲染vue组件
            let vueConstructor = MsuiElement.getVueRuntime().extend(this.msui_element_config);
            let msuiInstance = this.$self = this.msui_element_instance = new vueConstructor;
            msuiInstance.$msuiParent = this;
            msuiInstance.$mount(selector);

            // 为当前组件添加ElementUI映射
            if(curRefKey !== ''){
                this.$eleRef = msuiInstance.$eleRef = msuiInstance.$refs[curRefKey];
                this.refKey = curRefKey;
            }

            // 为当前组件所组合或聚合的 Fragment组件 添加ElementUI映射
            setTimeout(() => {
                console.log('msuiInstance.$refs: %o', msuiInstance.$refs);
                if(plgCfg.fragments !== void 0){
                    _eachObj(plgCfg.fragments, (k, v) => {
                        if(v.set$EleRef)
                            v.set$EleRef(msuiInstance.$refs);
                    });
                }
                console.log('添加完毕');
            }, 1000);


            // 渲染组合或聚合的子组件
            this._renderCombinatorialPlugins(plgCfg);

            // 设置渲染状态‘已完成’
            this[_isRendered] = true;

            // 触发渲染完成钩子
            // this.triggerHook('mounted');

            return this;
        }
        catch(e){
            throw new Error(e);
            return _error('ELEMENT_PLUGIN_RENDER_ERROR');
        }
    }

    /**
     * 触发生命周期
     * **/
    triggerHook(hookName){
        if(typeof hookName === 'string'
            && lifeCycleArrays.includes(hookName) && (this[hookName] instanceof Function)){
            this[hookName]();
        }
    }

    /**
     * 检测组件是否渲染完成
     * @returns {boolean}　是否渲染完成 ？ 已渲染 ：未渲染
     */
    checkRendered() {
        return this[_isRendered]
    }

    /**
     * 组合Msui组件
     * @param pluginObject {{
     *     pluginName: plugin
     * }} 插件键值对
     * */
    combineMsuiPlugins(pluginObject){
        if(_.isObject(pluginObject) && Object.keys(pluginObject).length > 0){

            _eachObj(pluginObject, (k, v) => {
                this.combineMsuiPlugin(k, v);
            });
        }
    }
    /**
     * 组合Msui组件
     * @param pluginName { String } 组件名称
     * @param plugin { MsuiElement } 组件实例
     * */
    combineMsuiPlugin(pluginName, plugin){
        this.msui_plugin_config.msuiPlugins[pluginName] = plugin;
    }

    /**
     * 添加组件碎片
     *
     * *由于组件碎片不能单独使用，请务必通过调用ME中的addFragment设置组件碎片
     * *组件碎片在第一次添加时，组件碎片会递归处理作用路径
     *
     * @param fragName { String } 组件碎片名称
     * @param fragment { MsuiFragment } 组件碎片实例
     * **/
    addFragment(fragName, fragment){
        if(fragName && (fragment instanceof MsuiFragment)){
            this.msui_plugin_config.fragments[fragName] = this[fragName] = fragment;
            fragment.setScopePath(fragName);
        }
    }

    getFragment(fragName){
        return fragName ? this.msui_plugin_config.fragments[fragName] || null : null;
    }

    static getMsuiUtil(name){
        if(this.MsuiUtil && this.MsuiUtil[name]){
            return this.MsuiUtil[name];
        }else
            return null;
    }

    $destroy(){
        this.$self.$destroy();
    }

    /**
     * 获取已渲染完成的element-ui组件实例映射
     * @param refKey { String } 映射名称
     * @return { Vue.Component } 映射
     * **/
    _getRef(refKey){
        return this.checkRendered() ? this.msui_element_instance.$refs[refKey] : null;
    }

    /**
     * 乾坤沙箱模式适配
     * **/
    static getCurrentDOM(){
        // return window.__INJECTED_SHADOW_ROOT__ ? window.__INJECTED_SHADOW_ROOT__ : document;
        return document;
    }

    static checkVueRuntime(){
        return this.getVueRuntime() != null && this.getVueRuntime() !== void 0;
    }

    static getVueRuntime(){
        return this.Vue;
    }

    /**
     * 实现Vue加载插件规则
     *
     * */
    static install(Vue, options){
        this.Vue = Vue;
        super.install(Vue, this, this._pluginName);
    }

    /**
     * 注册派生组件
     * @param Plugin { MsuiElement } MsuiElement 的派生类
     * @param options { Object =} 配置参数
     * */
    static add(Plugin, options){
        super.add(this,Plugin,options);
    }
}

export default MsuiElement;
