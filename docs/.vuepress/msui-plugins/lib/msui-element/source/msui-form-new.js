import _ from 'lodash';
import MsuiElement from "./msui-element";
import MsuiFormModel from "./../../msui-fragment/msui-form-model";
import {MSUI_FORM_CONSTANT} from "./../../msui-common/source/msui-constant";
import {
    _addAxios,
    _addAxiosReturnIns,
    _eachObj,
    _errorFactory,
    _msuiButtonCreator
} from "./../../msui-common/source/_self-util";
import MsuiButton from "./../../msui-fragment/msui-base-components/msui-button";
import MsuiNotify from "../../msui-util/source/msui-notify";
import MsuiRouteManager from '../../msui-util/source/msui-route-manager'

const _error = _errorFactory(MSUI_FORM_CONSTANT);

const FORM_SAVE_BTN_NAME = 'formSaveBtnName';
const FORM_MODEL_NAME = 'formModel';

const _addFormModel = function(formModel){

    let origin;

    if(_.isArray(formModel) && formModel.length > 0){
        origin = MsuiFormModel.mergeFormModels(formModel[0], formModel.slice(1));
    }else if(formModel instanceof MsuiFormModel){
        origin = formModel;
    }

    if(origin){
        this.addFragment(FORM_MODEL_NAME, origin);
        return true;
    }
};

const setTabsComponent = function(data){

    data.forEach( tab => {
        // 添加页签组件
        tab.component = MsuiRouteManager.getComponent(tab.url || '');

        let parentData = this.getData(),
            customData = this.$self.customData;

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

class MsuiFormNew extends MsuiElement{

    static _pluginName = 'MsuiFormNew';

    constructor({
                    el,
                    url = '',
                    save = '',
                    loader = '',
                    inline = false,
                    formModel = null,
                    disabled = false,
                    formTabs = null,
                    formLabel = '',
                    labelWidth = '130px',
                    labelPosition = 'right',
                    detailFormCallBack = null,
                    viewFormCallBack = null,
                    addFormCallBack = null,
                    size = 'medium',
                    isGroup = false,
                    formButtons = []
                } = {}){

        super();

        let vueConfig = this.msui_element_config,
            pluginConfig = this.msui_plugin_config;

        vueConfig.data = {
            formTabs: [],
            customData: {},
            tabsValue: '',
            disabled
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


        // 添加表单模型
        if(!(formModel && _addFormModel.call(this,formModel)))
            _error('UNKNOWN_FORM_MODEL_ERROR');

        // 添加表单保存数据的MsuiAxios
        if(save){
            if(_.isString(save)) save = {url: save};
            save.method = save.method || 'post';
            _addAxios.call(this, save, data => {
                /*
                * 保存成功后的逻辑
                * 如果配置了after，则经过after处理，如果after返回真，则走成功逻辑，否则走失败逻辑
                * 若没有配置after，则按照正常的处理逻辑走
                * */
                if((_.isFunction(save.filterResData) && save.filterResData(data)) || save.filterResData === void 0){
                    MsuiNotify.success('表单数据保存成功');
                    this.resetFields();
                }else{
                    MsuiNotify.error('表单数据保存失败');
                }
                return data;
            }, () => {
                MsuiNotify.error(MSUI_FORM_CONSTANT.REQUEST_DATA_ERROR,'提示');
                _error('REQUEST_DATA_ERROR');
            });
        }

        /*
         * 添加保存按钮
         * 当表单不是聚合表单
         * 当使用者配置了save时
         * */
        if(!isGroup && this.axiosIns){
            super.addFragment(FORM_SAVE_BTN_NAME, new MsuiButton({
                text: '保存',
                icon: 'el-icon-document-add',
                type: 'primary',
                clickHandler: () => {
                    // 验证表单数据，验证成功后保存数据
                    this.validateForm().then( isSuccess => {
                        if(isSuccess){
                            const formGetData = this.getData();
                            const formData = _.isFunction(save.filterReqParam) ?
                                save.filterReqParam(formGetData) || formGetData : formGetData;
                            this.saveData(formData);
                        }
                    });
                }
            }));
        }

        // 添加表单数据加载器
        if(loader){
            const queryAxios = _addAxiosReturnIns(loader, null, () => {
                _error('REQUEST_DATA_ERROR');
            });
            if(queryAxios){
                this.queryAxios = queryAxios;
            }
        }

        // 按钮构造器 & 自定义按钮
        const btnCreator = _msuiButtonCreator(this, super.addFragment);
        pluginConfig.formButtons = btnCreator(formButtons);

        // 表单页签
        if(_.isObject(formTabs)){
            const tabsAxios = _addAxiosReturnIns(formTabs.loader);
            if(tabsAxios){
                this.tabsAxiosIns = tabsAxios;

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
    validateField(array) {
        this.$eleRef.validateField(array)
    }
    /**
     * 重置表单字段
     *
     * **/
    resetFields(){
        console.log(this);
        this.$eleRef.resetFields();
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
        this[FORM_SAVE_BTN_NAME].toggleVisible(true);

        // if (_.isFunction(this.msui_plugin_config.addFormCallBack))
        //     this.msui_plugin_config.addFormCallBack.call(this, this[FORM_MODEL_NAME]);

        if (_.isFunction(callback))
            callback(this, this[FORM_MODEL_NAME]);
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
    isViewForm({
                    params,
                    callback
               } = {}){

        this.disabled();
        this[FORM_SAVE_BTN_NAME].toggleVisible(false);
        this.renderTabs(params);

        this.setData({
            params,
            callback
        }).then( () => {
            if(callback)
                callback.call(this,this[FORM_MODEL_NAME],params);
        });
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
    isDetailForm({
                     params,
                     callback
                 } = {}){

        this.disabled(false);
        this[FORM_SAVE_BTN_NAME].toggleVisible(true);

        this.setData({
            params,
            callback
        }).then( () => {
            if(callback)
                callback.call(this,this[FORM_MODEL_NAME],params);
        });
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
    async setData({
                params,
                callback
            } = {}){

        const formModel = this[FORM_MODEL_NAME];

        /*
        * 如果配置了loader，则将params作为参数来查询表单数据
        * 并将查询出来的表单数据给表单赋值
        * */
        if(this.queryAxios){
            params = await this.loadData(params);
        }

        // 表单赋值
        if(!_.isEmpty(params))
            formModel.setValue(params);

        return formModel;
    }

    /**
     * 保存表单数据
     * **/
    saveData(formData = this.getData()){
        return this.axiosIns
            && this.axiosIns.sender(formData);
    }

    /**
     * 查询表单数据
     * **/
    loadData(params){
        const queryParams = {};
        // 如果是表格委托的话，通过表单的模型将主键数据过滤出来带入请求中查询
        if(params){

        }

        return this.queryAxios.sender(params);
    }

    /**
     *
     * 获取表单每个字段数据
     *
     * **/
    getData(){
        return this[FORM_MODEL_NAME].getValue();
    }

    /**
     *
     * 表单禁用
     *
     * @param disabled { Boolean } 是否禁用
     *
     * **/
    disabled(disabled = true){
        if(this.$self){
            this.$self.disabled = disabled;
        }else
            this.msui_element_config.data.disabled = disabled;
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

        // 表单渲染模板
        const formRenderTemplate = `
            <div class="msui-form-container">
                <el-form
                    msuiRef
                    status-icon
                    ${pluginConfig.inline ? `:inline="true"` : ''}
                    labelPosition="${pluginConfig.labelPosition}"
                    :model="${FORM_MODEL_NAME}"
                    label-width="${pluginConfig.labelWidth}"
                    size="${pluginConfig.size}"
                    :disabled="disabled">
                    ${super.getFragment(FORM_MODEL_NAME).render()}
                </el-form>
                ${!pluginConfig.isGroup ? renderFormButtons(this.axiosIns, super.getFragment(FORM_SAVE_BTN_NAME), pluginConfig.formButtons) : ''}
            </div>
        `;

        // 表单分页渲染模板
        vueConfig.template = `
            <div ${!pluginConfig.isGroup ? `style="height:99%;display:flex;flex-direction: column;border-bottom: 2px dashed #ccc;"`: 'style="border-bottom: 2px dashed #ccc;"'}>
                ${this.tabsAxiosIns && !pluginConfig.isGroup ? `
                    <el-tabs v-model="tabsValue" ${vueConfig.methods.tabsClickHandler ? `@tab-click="tabsClickHandler"` : ''}>
                        <el-tab-pane 
                            label="${pluginConfig.formLabel ? pluginConfig.formLabel : '基础表单'}">
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

export default MsuiFormNew;
