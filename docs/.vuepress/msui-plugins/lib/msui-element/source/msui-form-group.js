import MsuiElement from "./msui-element";
import {MSUI_FORM_CONSTANT, MSUI_FORM_GROUP_CONSTANT} from "../../msui-common/source/msui-constant";
import {_addAxios, _addAxiosReturnIns, _eachObj, _error, _msuiButtonCreator} from "../../msui-common/source/_self-util";
import _ from 'lodash';
import MsuiButton from "../../msui-fragment/msui-base-components/msui-button";
import MsuiNotify from "../../msui-util/source/msui-notify";
import MsuiRouteManager from "../../msui-util/source/msui-route-manager";

import MsuiMicroAdapter from '../../msui-util/source/msui-microAdapter'

const FORM_SAVE_BTN_NAME = 'formSaveBtnName';
const _defaultParamKey = {
    resType: 'resourceType',
    guid: 'guid'
};
const renderFormButtons = function(saveBtnIns, customBtns){
    return `
        <div style="padding: 3px 12px;text-align: center;position: absolute; bottom: 7px;left: 0;right: 0;">
            ${saveBtnIns.render()}
            ${customBtns.length > 0 ? ` ${customBtns.map( cur => cur.render() ).join('')} ` : ''}  
        </div>
    `;
};
const setTabsComponent = function(data){

    data.forEach( tab => {

        // 添加页签组件
        tab.component = MsuiRouteManager.getComponent(tab.url || '');

        let parentData = this.$self.formData,
            customData = this.$self.customData.customData;

        // 添加合并页签需要的参数
        const tabData = MsuiRouteManager.getParamsByUrl(tab.url);

        if(tabData){
            customData = _.merge({}, customData, tabData);
        }

        tab.show = true;

        tab.data = {
            parentData,
            customData
        }
    });

    this.$self.formTabs = this.msui_plugin_config.formTabsCache = data;
    return data;
};

export default class MsuiFormGroup extends MsuiElement{

    static _pluginName = 'MsuiFormGroup';

    constructor({
                    el,
                    save = '',
                    saveBtnText = '保存',
                    saveBtnIcon = 'el-icon-document-add',
                    forms = [],
                    formTabs,
                    formLabel = '',
                    labelWidth = '130px',
                    notClearFormBeforeSave = false,
                    dynamicClickHandler = null,
                    formButtons = []
                } = {}){
        super();

        if(_.isArray(forms) && forms.length === 0 && !forms.every( cur => cur instanceof Array ) )
            return _error(MSUI_FORM_GROUP_CONSTANT.MODEL_NAME,
                MSUI_FORM_GROUP_CONSTANT.NO_SUCH_FORMS_ERROR);

        let vueConfig = this.msui_element_config,
            pluginConfig = this.msui_plugin_config;

        pluginConfig.el = el;
        pluginConfig.forms = forms;
        pluginConfig.formTabsCache = [];
        pluginConfig.formLabel = formLabel;
        pluginConfig.labelWidth = labelWidth;

        if(dynamicClickHandler instanceof Function){
            pluginConfig.dynamicClickHandler = dynamicClickHandler;
        }

        vueConfig.data = {
            formTabs: [],
            formData: {},
            customData: {},
            optBtns: [],
            tabsValue: ''
        };

        vueConfig.methods = {
            redirectBtnClick(btnInfo){

                const {id, appName, linkUrl, linkTitle} = btnInfo;

                const component = MsuiRouteManager.getComponent(linkUrl),
                      urlParams = MsuiRouteManager.getParamsByUrl(linkUrl);

                const componentParams = {
                    appName,
                    url: linkUrl,
                    component,
                    elementArgs: urlParams
                };

                // 通过适配器打开Portal
                MsuiMicroAdapter.openPortal(linkTitle, componentParams);

                if(pluginConfig.dynamicClickHandler instanceof Function){
                    pluginConfig.dynamicClickHandler(btnInfo);
                }
            }
        };

        // 保存表单数据的Axios
        if(save){
            if(_.isString(save)) save = {url: save};
            save.method = save.method || 'post';
            _addAxios.call(this, save, data => {
                let filterResData = save.filterResData;
                if(!_.isFunction(filterResData))
                    filterResData = () => true;
                const filterResult = filterResData(data);
                if(Boolean(filterResult)){
                    MsuiNotify.success(saveBtnText +'成功');
                    // TODO: 临时增加的解决方案，当配置了这个参数且为true，则新增成功后，不需要清除表单信息
                    if(!notClearFormBeforeSave)
                        this.resetFields();
                }
                return data;
            }, () => {
                MsuiNotify.error(MSUI_FORM_CONSTANT.REQUEST_DATA_ERROR,'提示');
                _error(MSUI_FORM_GROUP_CONSTANT.MODEL_NAME,
                    MSUI_FORM_CONSTANT.REQUEST_DATA_ERROR);
            });
            pluginConfig.saveBefore = save.before;
        }

        // 注册保存按钮
        super.addFragment(FORM_SAVE_BTN_NAME, new MsuiButton({
            text: saveBtnText,
            icon: saveBtnIcon,
            type: 'primary',
            clickHandler: () => {
               
                this.validateForm().then((isSuccess) => {
                    if(isSuccess){

                        // 如果配置时，实现了before方法，则将表单数据根据before方法返回的过滤。
                        let formDatas = _.isFunction(pluginConfig.saveBefore) ?
                            pluginConfig.saveBefore(this.getDataByArr()) : this.getData();

                        this.saveData(formDatas);
                    }
                });
            }
        }));

        // 表单页签
        if(_.isObject(formTabs)){
            const tabsAxios = _addAxiosReturnIns(formTabs.loader);
            if(tabsAxios){
                this.tabsAxiosIns = tabsAxios;
                pluginConfig.paramKeys = formTabs.paramKeys || _defaultParamKey;
                if(_.isFunction(formTabs.clickHandler)){
                    vueConfig.methods['tabsClickHandler'] = formTabs.clickHandler;
                }

                this.setCustomData(formTabs.customData);
            }
        }

        // 按钮构造器
        const btnCreator = _msuiButtonCreator(this, super.addFragment);
        // 自定义按钮
        pluginConfig.formButtons = btnCreator(formButtons);
    }

    /**
     * 验证表单
     *
     * **/
    async validateForm() {

        const validResult = await Promise.all(this.eachForm( form => {
            
            return form.validateForm();
        }, 'map' ));

        // 表单验证全局成功
        return validResult.every( cur => cur );
    }

    validateField(Array) {
         this.eachForm(form => {
             
            form.validateField(Array);
        }, 'forEach' )

    }

    saveData(data){
        return this.axiosIns
            && this.axiosIns.sender(data);
    }

    resetFields(){
        this.eachForm( form => form.resetFields() );
    }

    getData(){
        return _.merge({}, ...this.getDataByArr())
    }

    getDataByArr(){
        return this.eachForm( form => form.getData(), 'map');
    }

    setData(data = {}, callback){
        const formModels = this.eachForm( form => form.setData(data), 'map' );
        if(_.isFunction(callback))
            callback.call(this, formModels);
    }

    disabled(disabled = true){

        const saveBtnIns = super.getFragment(FORM_SAVE_BTN_NAME);
        if(saveBtnIns){
            saveBtnIns.visible = !disabled;
        }

        this.eachForm((form) => form.disabled(disabled));
    }

    isAddForm(){
        // this.renderTabs({
        //     formType: 'isAddForm'
        // });
        this.eachForm((form) => form.isAddForm());
    }

    isDetailForm(params, callback){

        const paramKeys = this.msui_plugin_config.paramKeys || {},
            queryParams = {};

	    // 过滤查询参数
        _eachObj(paramKeys, (name, value) => {
            queryParams[name] = params[value] ?? '';
        });

        // 检测动态按钮
        if(params.optBtns){
            this.$self.optBtns = params.optBtns;
        }

        // 渲染页签
        this.renderTabs({
            queryParams,
            formType: 'isDetailForm'
        });

        // 表单赋值
        this.eachForm((form) => form.isDetailForm(params));
        // 触发回调
        if(_.isFunction(callback))
            callback.call(this, this.getForms(),params);
    }

    isViewForm(params, callback){

        const paramKeys = this.msui_plugin_config.paramKeys || {},
            queryParams = {};

        // 过滤查询参数
        _eachObj(paramKeys, (name, value) => {
            queryParams[name] = params[value] ?? '';
        });

        // 检测动态按钮
        if(params.optBtns){
            this.$self.optBtns = params.optBtns;
        }

        // 渲染页签
        this.renderTabs({
            queryParams: queryParams,
            formType: 'isViewForm'
        });

        // 隐藏保存按钮
        this[FORM_SAVE_BTN_NAME] && this[FORM_SAVE_BTN_NAME].toggleVisible(false);

        // 表单赋值
        this.eachForm((form) => form.isViewForm(params));
        if(_.isFunction(callback))
            callback.call(this, this.getForms(),params);
    }

    getForms(){
        return this.msui_plugin_config.forms || [];
    }

    eachForm(cb, type = 'forEach'){
        return this.getForms()[type]( (form, idx) => cb(form, idx) );
    }

    /**
     * 渲染表单页签
     *
     * **/
    async renderTabs({
                    queryParams = {},
                    customData,
                    formType
               } = {}){

        const pc = this.msui_plugin_config;

        if(this.tabsAxiosIns){

            // 保存自定义参数
            if(customData)
                this.setCustomData(customData);

            try {

                if(pc.formTabsCache.length === 0){
                    // 查询页签信息
                    const tabsData = await this.tabsAxiosIns.sender(queryParams);

                    // 渲染页签
                    if(_.isArray(tabsData))
                        setTabsComponent.call(this, tabsData);
                }

                // 根据表单类型 隐藏/显示 表单
                this.toggleTabs(formType, queryParams);

            }catch(e){
                MsuiNotify.error(MSUI_FORM_CONSTANT.REQUEST_TABS_DATA_ERROR);
                _error(MSUI_FORM_GROUP_CONSTANT.MODEL_NAME,
                    MSUI_FORM_CONSTANT.REQUEST_TABS_DATA_ERROR);
            }
        }

        return this;
    }

    /**
     *
     * 显示、隐藏表单页签、表单页签赋值
     *
     * 只有在除新增以外的表单，表单页签才会被赋值
     *
     * **/
    toggleTabs(formType, formData){
        const vueConfig = this.$self;
        switch(formType){
            case 'isAddForm':
                vueConfig.formTabs = [];
                break;
            default:
                this.msui_plugin_config.formTabsCache.forEach( tab => {
                    tab.data.parentData = formData;
                });
                vueConfig.formTabs = this.msui_plugin_config.formTabsCache;
        }
    }

    setCustomData(customData){
        if(customData){
            let vueConfig = this.$self ?
                this.$self : this.msui_element_config.data;

            vueConfig.customData = _.clone(customData);
        }
    }

    render(el){

        const vueConfig = this.msui_element_config,
            pluginConfig = this.msui_plugin_config;

        // icon: "icon-location"
        // id: "sys.operate.log"
        // linkOpenType: "self"
        // linkTitle: "操作轨迹"
        // linkUrl: "topo/toTopoBindView?guid=TMS=1,SYS=227&resType=10000"
        // name: "查看操作轨迹"
        // pos: 0
        // rwFlag: "1"

        // 表单渲染模板
        const formRenderTemplate = `
            <div style="padding: 3px 15px;">
                    <div style="float: right;">
                        <el-button 
                            type="mini"
                            v-for="btn in optBtns" 
                            :key="btn.id" @click="(ev) => {redirectBtnClick(btn, ev)}">{{ btn.name }}</el-button>
                    </div>
                    <div style="clear: both;"></div>
            </div>
            <div class="msui-form-group-container" style="height: 95%; overflow: auto;">
                ${pluginConfig.forms.map( (cur, idx) => {
                    const curKey = `form${idx}`;

                    // 将表单设为聚合表单
                    cur
                        .setEl(`#${curKey}`)
                        .setFormGroup(true);

                    pluginConfig.msuiPlugins[curKey] = cur;
                    return `<div id="${curKey}"></div>`
                }).join('\n')}

                ${!pluginConfig.isGroup ? renderFormButtons( super.getFragment(FORM_SAVE_BTN_NAME), pluginConfig.formButtons) : ''}
            </div>
        `;

        // 表单分页渲染模板
        vueConfig.template = `
            <div style="height: 99%;display:flex;flex-direction: column;border-bottom: 2px dashed #ccc;">
                ${this.tabsAxiosIns ? `
                    <el-tabs v-model="tabsValue" ${vueConfig.methods.tabsClickHandler ? `@tab-click="tabsClickHandler"` : ''}>
                        <el-tab-pane 
                            label="${pluginConfig.formLabel ? pluginConfig.formLabel : '基础信息'}">
                            ${formRenderTemplate}
                        </el-tab-pane>
                        
                        <el-tab-pane
                            :key="item.name"
                            v-for="(item,index) in formTabs"
                            :label="item.name"
                            :name="item.name"
                          >
                            <component :is="item.component" :parentData="item.data"></component>
                        </el-tab-pane>
                        
                    </el-tabs>
                ` : `${formRenderTemplate}`}
            </div>
        `;

        return super.render(el);

    }

}
