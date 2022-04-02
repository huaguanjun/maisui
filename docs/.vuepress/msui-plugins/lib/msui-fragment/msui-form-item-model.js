import MsuiFragment from "./msui-fragment-new";
import MsuiResourceTreeInput from "./msui-base-components/msui-resourcetree-input";
import MsuiUpload from "./msui-base-components/msui-upload";
import MsuiSelectBox from "./msui-base-components/msui-selectbox";
import MsuiInput from "./msui-base-components/msui-input";
import MsuiDateTimePicker from "./msui-base-components/msui-datetime-picker";
import MsuiSwitch from "./msui-base-components/msui-switch";
import MsuiRadio from "./msui-base-components/msui-radio";
import MsuiExtendedInput from "./msui-base-components/msui-extended-input";
import mspResourceTree from './../msui-useage-vue-template/mspResourceTree'
import _ from "lodash";
import {checkText , checkTextArea} from "../msui-util/source/msui-commonCheckRules";
const ITEM_KEY = '_item';

/* 获取表单元素值的真实路径
*  考虑到 MsuiFragment组件的可集成性，value路径必须通过层层返回来确定
*  */
const getValueRealPath = function(prop, item, getValueRealPath){
    return `${prop}.${ITEM_KEY}${getValueRealPath ? `.${getValueRealPath.call(item)}` : ''}.value`;
};

export default class MsuiFormItemModel extends MsuiFragment{

    constructor({
                    label = '',
                    prop = ''
                } = {}){

        super();

        this.label = label;
        this.prop = prop;
        this.rules = [];
        this.maxLineFlag = false;
        this.show = true;
    }

    /**
     * 主键（唯一值字段）
     * **/
    isPrimaryKey(){
        return this.isHidden();
    }

    /**
     * 隐藏框
     * **/
    isHidden(){
        this.show = false;
        return this.isInput({type: 'hidden'});
    }

    /**
     * 资源选择树
     * **/
    isResourceTree(options = {}){

        // 获取资源选择树组件
        const resTreeComponent = mspResourceTree;
        if(!resTreeComponent){
            return this.isInput(options);
        }

        // 生成资源选择树控件s
        options.resTreeComponent = resTreeComponent;
        this[ITEM_KEY] = new MsuiResourceTreeInput(options);
        super.addFragment(ITEM_KEY, this[ITEM_KEY]);

        return this;
    }

    /**
     * 扩展input
     * **/
    isExtendedInput(options){
        this[ITEM_KEY] = new MsuiExtendedInput(options);
        super.addFragment(ITEM_KEY, this[ITEM_KEY]);

        return this;
    }

    /**
     * 上传组件
     * **/
    isUpload(options = {}){

        // 如果文件上传没有配置名称，则使用当前模型配置的名称
        !options.name && ( options.name = this.prop );

        this[ITEM_KEY] = new MsuiUpload(options);
        super.addFragment(ITEM_KEY, this[ITEM_KEY] );
        return this;
    }

    /**
     * 下拉框组件
     * **/
    isSelectBox(options = {}){
        options.fullLine = true;
        this[ITEM_KEY] = new MsuiSelectBox(options);
        super.addFragment(ITEM_KEY, this[ITEM_KEY] );
        return this;
    }

    /**
     * 输入框组件
     * **/
    isInput(options = {}){
        this[ITEM_KEY] = new MsuiInput(options);
        super.addFragment(ITEM_KEY, this[ITEM_KEY] );
        if (options.type && options.type == 'textarea') {
           this.addRules({validator: checkTextArea, trigger: 'blur' })
        }else {
            this.addRules({validator: checkText, trigger: 'blur' })
        }
        return this;
    }

    /**
     * 日期选择框组件
     * **/
    isDateTimePicker(options = {}) {
        options.fullLine = true;
        this[ITEM_KEY] = new MsuiDateTimePicker(options);
        super.addFragment(ITEM_KEY, this[ITEM_KEY]);
        return this;
    }

    /**
     * 开关组件
     * **/
    isSwitch(options = {}){
        this[ITEM_KEY] = new MsuiSwitch(options);
        super.addFragment(ITEM_KEY, this[ITEM_KEY]);
        return this;
    }

    /**
     * 单选组件
     * @deprecated
     * **/
    isRadio(options = {}){
        this[ITEM_KEY] = new MsuiRadio(options);
        super.addFragment(ITEM_KEY, this[ITEM_KEY]);
        return this;
    }

    addRules(rules){
        if(rules){
            rules = _.clone(rules);
            if(_.isArray(rules))
                this.rules = _.clone(rules);
            else if(_.isObject(rules))
                this.rules.push(rules);
        }
        return this;
    }

    maxLine(flag = true){
        this.maxLineFlag = !!flag;
        return this;
    }

    item(){
        return this[ITEM_KEY];
    }

    /**
     *
     * 获取行为代理
     *
     * 考虑到每个表单元素 取赋值 逻辑的不同，该操作将：
     * 由具体的表单元素来实现 getValue 的规则，如果没有，则直接返回表单元素的原始值
     * **/
    getValue(){
        const item = this[ITEM_KEY];
        if(item){
            return item.getValue ? item.getValue() : item.value;
        }else return '';
    }
    /**
     * 赋值行为代理
     * **/
    setValue(val = {}){
        if(this[ITEM_KEY]){
            const item = this[ITEM_KEY];
            item.setValue ? item.setValue(val) : item.value = val;
        }
    }

    getValRealPath(){
        return getValueRealPath(this.prop, this[ITEM_KEY], this[ITEM_KEY].getValueRealPath);
    }

    render(){

        const dataPath = super.getDataPath(),
            item = this[ITEM_KEY];

        return `
            <el-col :span="${this.maxLineFlag ? '24' : '12'}" style="padding: 3px 12px;" v-show="${dataPath}.show">
                <el-form-item 
                    style="padding: 3px 0;"
                    label="${this.label}" 
                    prop="${getValueRealPath(this.prop, item, item.getValueRealPath)}"
                    ${this.rules ? `:rules="${dataPath}.rules"` : ''}>
                    
                    ${this[ITEM_KEY].render()}
                    
                </el-form-item>
            </el-col>
        `;
    }

    /**
     * 渲染前 钩子
     * **/
    beforeMount(){
        if(!this[ITEM_KEY]){
            this.isInput();
        }
    }

}
