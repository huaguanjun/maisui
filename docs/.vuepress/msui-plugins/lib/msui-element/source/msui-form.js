import MsuiElement from "./msui-element";
import MsuiFormModel from "./../../msui-fragment/msui-form-model";
import {MSUI_FORM_CONSTANT} from "../../msui-common/source/msui-constant";
import {_addAxios, _addAxiosReturnIns, _eachObj, _error} from "../../msui-common/source/_self-util";
import _ from 'lodash';
import MsuiButton from "./../../msui-fragment/msui-base-components/msui-button";
import MsuiNotify from "../../msui-util/source/msui-notify";
import MsuiRouteManager from '../../msui-util/source/msui-route-manager'
import MsuiMicroAdapter from "../../msui-util/source/msui-microAdapter";

const FORM_SAVE_BTN_NAME = 'formSaveBtnName';

const _defaultParamKey = {
    resType: 'resourceType',
    guid: 'guid'
};

const _addFormModel = function(formModel){
    if(_.isObject(formModel)){

        const mKeys = Object.keys(formModel),
            mVals = Object.values(formModel);

        if(mKeys.length === 1 && mKeys.length === mVals.length){
            if(mVals[0] instanceof MsuiFormModel){
                this.addFragment(mKeys[0],mVals[0]);
                this.modelName = mKeys[0];
                return true;
            }
        }
    }

    return false;
};

const setTabsComponent = function(data){

    data.forEach( tab => {
        // 添加页签组件
        tab.component = MsuiRouteManager.getComponent(tab.url || '');

        let parentData = this.getData(),
            customData = this.$self.customData.customData;

        // 添加合并页签需要的参数
        const tabData = MsuiRouteManager.getParamsByUrl(tab.url);

        if(tabData){
            customData = _.merge({}, customData, tabData);
        }

        tab.data = {
            parentData,
            customData
        }
    });

    this.$self.formTabs = data;
};

const renderFormButtons = function(axiosIns, saveBtnIns,  customBtns){
    return `
        <div style="padding: 3px 12px;text-align: center;position: absolute; bottom: 7px;left: 0;right: 0;">
            ${axiosIns ? `${saveBtnIns.render()}` : ''}
            ${customBtns.length > 0 ? ` ${customBtns.map( cur => cur.render() ).join('')} ` : ''}  
        </div>
    `;
};

class MsuiForm extends MsuiElement{

    static _pluginName = 'MsuiForm';

    constructor({
                    el,
                    url = '',
                    save = '',
                    saveBtnText = '保存',
                    saveBtnIcon = 'el-icon-document-add',
                    inline = false,
                    formModel = null,
                    disabled = false,
                    formTabs = null,
                    isModular = false,
                    formLabel = '',
                    labelWidth = '130px',
                    labelPosition = 'right',
                    detailFormCallBack = null,
                    viewFormCallBack = null,
                    addFormCallBack = null,
                    size = 'medium',
                    notClearFormBeforeSave = false,
                    isGroup = false,
                    formButtons = []
                } = {}){

        super();

        let vueConfig = this.msui_element_config,
            pluginConfig = this.msui_plugin_config;

        // 将formModel添加至组件碎片
        if(!(formModel && _addFormModel.call(this,formModel)))
            return _error(MSUI_FORM_CONSTANT.MODEL_NAME,
                MSUI_FORM_CONSTANT.UNKNOWN_FORM_MODEL_ERROR);


        if(save){
            if(_.isString(save)) save = {url: save};
            save.method = save.method || 'post';
            _addAxios.call(this, save, data => {
                this[FORM_SAVE_BTN_NAME].setDisabled(false);
                let filterResData = save.filterResData;
                if(!_.isFunction(filterResData))
                    filterResData = () => true;
                const filterResult = filterResData(data);
                if(Boolean(filterResult)){
                    MsuiNotify.success(saveBtnText + '成功');
                    // TODO: 临时增加的解决方案，当配置了这个参数且为true，则新增成功后，不需要清除表单信息
                    if(!notClearFormBeforeSave)
                        this.resetFields();
                }
                return data;
            }, () => {
                this[FORM_SAVE_BTN_NAME].setDisabled(false);
                if (!save.error) {
                    MsuiNotify.error(MSUI_FORM_CONSTANT.REQUEST_DATA_ERROR,'提示');
                }
                _error(MSUI_FORM_CONSTANT.MODEL_NAME,
                    MSUI_FORM_CONSTANT.REQUEST_DATA_ERROR);
            });
        }

        this.isModular = isModular;

        vueConfig.data = {
            formTabs: [],
            customData: {},
            tabsValue: '',
            optBtns: [],
            disabled
        };

        vueConfig.methods = {

            redirectBtnClick(btnInfo){

                const {id, appName, linkUrl, linkTitle} = btnInfo;

                const component = MsuiRouteManager.getComponent(linkUrl),
                      urlParams = MsuiRouteManager.getParamsByUrl(linkUrl);

                const componentParams = {
                    // appName,
                    // url: linkUrl,
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

        pluginConfig.el = el;
        pluginConfig.url = url;
        pluginConfig.size = size;
        pluginConfig.inline = inline;
        pluginConfig.isGroup = isGroup;
        pluginConfig.formLabel = formLabel;
        pluginConfig.labelWidth = labelWidth;
        pluginConfig.labelPosition = labelPosition;

        // 表单状态回调
        pluginConfig.addFormCallBack = addFormCallBack;
        pluginConfig.detailFormCallBack = detailFormCallBack;
        pluginConfig.viewFormCallBack = viewFormCallBack;

        pluginConfig.customBtns = [];

        // 不是group代理且配置了save
        if(!isGroup && this.axiosIns){
            super.addFragment(FORM_SAVE_BTN_NAME, new MsuiButton({
                text: saveBtnText,
                icon: saveBtnIcon,
                type: 'primary',
                clickHandler: () => {
                    this.validateForm(this.saveData);
                }
            }));
        }

        // 自定义按钮
        if(_.isObject(formButtons)){
            _eachObj(formButtons, (btnName, btn) => {
                let curMsuiButton = btn instanceof MsuiButton ? btn : new MsuiButton(btn);
                super.addFragment(btnName, curMsuiButton);
                pluginConfig.customBtns.push(curMsuiButton);
            });
        }

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
    }

    setFormGroup(group = false){
        this.msui_plugin_config.isGroup = !!group;
        return this;
    }

    /**
     * 验证表单
     *
     * **/
    validateForm(successCb, errCb) {
        return this.$eleRef.validate().then((isSuccess) => {
            if(_.isFunction(successCb)){
                successCb.call(this);
            }
            return isSuccess;
        }).catch(() => {
            if(_.isFunction(errCb)){
                errCb.call(this);
            }
            MsuiNotify.error('请填写必填项','提示');
            return false;
        });
    }
    /**
     * 验证表单部分内容
     *
     * **/
    validateField(array) {
        console.log(this)
        debugger
        this.$eleRef.validateField(array)
    }
    /**
     * 重置表单字段
     *
     * **/
     resetFields(){
        const formModelName = this.modelName;

        for(let key in this[formModelName]) {
            this[formModelName][key].setValue('')
        }

        this.$eleRef.resetFields();
    }

    /**
     * 保存表单数据
     *
     * **/
    saveData(){
        this[FORM_SAVE_BTN_NAME].setDisabled(true);
        return this.axiosIns
            && this.axiosIns.sender(this.getData());
    }


    /**
     * 新增表单
     *
     * ** 重置字段数据与验证 **
     * ** 去除表单禁用 **
     *
     * **/
    isAddForm(callback) {
        this.resetFields();
        this.disabled(false);

        if (_.isFunction(this.msui_plugin_config.addFormCallBack))
            this.msui_plugin_config.addFormCallBack.call(this, this[this.modelName]);

        if (_.isFunction(callback))
            callback.call(this, this[this.modelName]);
    }

    /**
     * 查看表单
     *
     * ** 字段赋值 **
     * ** 表单禁用 **
     *
     * @param params { Object } 表单赋值数据
     * @param callback { function(formModel: MsuiFormModel):void }= 赋值完成后的回调
     *
     * **/
    isViewForm(params = {}, callback){
        this.disabled();
        // if(this.isModular){

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
        this.renderTabs(queryParams);

        // 隐藏保存按钮
        this[FORM_SAVE_BTN_NAME] && this[FORM_SAVE_BTN_NAME].toggleVisible(false);
        // }

        this.setData(params, this.msui_plugin_config.viewFormCallBack || callback);
    }

    /**
     * 查看表单
     *
     * ** 字段赋值 **
     * ** 去除表单禁用 **
     *
     * @param params { Object } 表单赋值数据
     * @param callback { function(formModel: MsuiFormModel):void }= 赋值完成后的回调
     *
     * **/
    isDetailForm(params = {}, callback){
        this.disabled(false);
        // if(this.isModular){
        //     this.renderTabs(params);
        // }

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
        this.renderTabs(queryParams);

        this.setData(params, this.msui_plugin_config.detailFormCallBack || callback);
    }

    /**
     * 表单赋值
     *
     * formModel -> formModelItem -> SelectBox/Input/TimeRange ...
     *
     * @param params { Object } 表单赋值数据
     * @param callback { function(formModel: MsuiFormModel):void }= 赋值完成后的回调
     *
     * **/
    setData(params, callback){
        const formModel = this[this.modelName];

        if(_.isObject(params) && !_.isEmpty(params))
            formModel.setValue(params);

        if(callback)
            callback.call(this,formModel,params);

        return formModel;
    }

    /**
     *
     * 获取表单每个字段数据
     *
     * **/
    getData(){
        return this[this.modelName].getValue();
    }

    /**
     *
     * 表单禁用
     *
     * @param disabled { Boolean } 是否禁用
     *
     * **/
    disabled(disabled = true){
        const saveBtnIns = super.getFragment(FORM_SAVE_BTN_NAME);
        if(this.$self){
            this.$self.disabled = disabled;
        }else
            this.msui_element_config.data.disabled = disabled;
        if(saveBtnIns){
            saveBtnIns.disabled = disabled;
            saveBtnIns.visible = !disabled;
        }
    }

    cleanData(){
        this[this.modelName].cleanValue();
    }

    /**
     * 渲染表单页签
     *
     * @param params { Object } 表单赋值数据
     * @param customData { Object } 自定义带入参数
     *
     * 不能是被聚合的表单
     *
     * **/
    renderTabs(params = {}, customData){
        if(this.tabsAxiosIns && !this.msui_plugin_config.isGroup){

            // 保存自定义参数
            this.setCustomData(customData);

            this
                .tabsAxiosIns
                .sender(params)
                .then(data => {
                    if(data && _.isArray(data)){
                        setTabsComponent.call(this, data);
                    }
                })
                .catch(() => {
                    MsuiNotify.error(MSUI_FORM_CONSTANT.REQUEST_TABS_DATA_ERROR);
                    _error(MSUI_FORM_CONSTANT.MODEL_NAME,
                        MSUI_FORM_CONSTANT.REQUEST_TABS_DATA_ERROR);
                });
        }
        return this;
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

        // 是否渲染动态按钮
        const needOptBtnsStr = pluginConfig.isGroup ? '' : `
            <div style="padding: 3px 15px;">
                    <div style="float: right;">
                        <el-button 
                            type="mini"
                            v-for="btn in optBtns" 
                            :key="btn.id" @click="(ev) => {redirectBtnClick(btn, ev)}">{{ btn.name }}</el-button>
                    </div>
                    <div style="clear: both;"></div>
            </div>
        `;

        // 表单渲染模板
        const formRenderTemplate = needOptBtnsStr + `
            <div class="msui-form-container">
                <el-form
                    msuiRef
                    status-icon
                    ${pluginConfig.inline ? `:inline="true"` : ''}
                    labelPosition="${pluginConfig.labelPosition}"
                    :model="${this.modelName}"
                    label-width="${pluginConfig.labelWidth}"
                    size="${pluginConfig.size}"
                    :disabled="disabled">
                    ${super.getFragment(this.modelName).render()}
                </el-form>
                ${!pluginConfig.isGroup ? renderFormButtons(this.axiosIns, super.getFragment(FORM_SAVE_BTN_NAME), pluginConfig.customBtns) : ''}
            </div>
        `;

        // 表单分页渲染模板
        vueConfig.template = `
            <div ${!pluginConfig.isGroup ? `style="height:99%;display:flex;flex-direction: column;border-bottom: 2px dashed #ccc;"`: ''}>
                ${this.tabsAxiosIns && !pluginConfig.isGroup ? `
                    <el-tabs v-model="tabsValue" ${vueConfig.methods.tabsClickHandler ? `@tab-click="tabsClickHandler"` : ''}>
                        <el-tab-pane 
                            label="${pluginConfig.formLabel ? pluginConfig.formLabel : '基础信息'}">
                            ${formRenderTemplate}
                        </el-tab-pane>
                         
                        <el-tab-pane
                            :key="item.name"
                            v-show="item.show"
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

    addFragment(fragName, fragment) {
        super.addFragment(fragName, fragment);
    }

    static install(MsuiElement) {
        MsuiElement[this._pluginName] = this;
    }
}

export default MsuiForm;