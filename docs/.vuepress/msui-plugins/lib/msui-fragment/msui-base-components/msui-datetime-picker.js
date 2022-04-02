/**
 * Created by liangwenzheng on 2020-03-18
 */


import MsuiFragment from "../msui-fragment-new";
import {MSUI_DATETIME_CONSTANT} from "../../msui-common/source/msui-constant";
import {_error, _warning} from "../../msui-common/source/_self-util";

const _typeEnum = new Set(['year', 'month', 'date', 'week', 'datetime', 'datetimerange', 'daterange']);
export default class MSuiDateTimePicker extends MsuiFragment {
    constructor({
                    size = '',
                    value = '',
                    type = 'datetime',
                    fullLine = false,
                    disabled = false,
                    editable = false,
                    clearable = true,
                    placeholder = "请选择时间",
                    startPlaceholder = "请选择开始时间",
                    endPlaceholder = "请选择结束时间",
                    valueFormat = 'yyyy-MM-dd HH:mm:ss',
                    prefixIcon = 'el-icon-date',
                    changeHandler = null
                } = {}) {
        super();
        if (!_typeEnum.has(type))
            return _error(MSUI_DATETIME_CONSTANT.MODEL_NAME,
                MSUI_DATETIME_CONSTANT.UNKNOWN_DATETIME_TYPE_ERROR);

        this.value = value;

        let {
            scopeIns: {
                methods: curMethod = {}
            }
        } = this._fragScope;

        this.type = type;
        this.disabled = disabled;
        this.editable = editable;
        this.clearable = clearable;
        this.fullLine = fullLine;
        this.size = size;
        this.placeholder = placeholder;
        this.startPlaceholder = startPlaceholder;
        this.endPlaceholder = endPlaceholder;
        this.valueFormat = valueFormat;
        this.prefixIcon = prefixIcon;
        if (changeHandler instanceof Function) {
            curMethod.changeHandler = changeHandler;
        }
    }


    /**
     *
     * 时间日期范围选择器 的 formatter 逻辑：
     *
     * 根据使用者配置的valueFormat来转换数据
     *
     * **/
    formatter(val){
        if(val){
            if(typeof(Date.prototype.formatter) === 'undefined'){
                Date.prototype.formatter = function(fmt){
                    var o = {
                        "M+": this.getMonth() + 1,                 //月份
                        "d+": this.getDate(),                    //日
                        "H+": this.getHours(),                   //小时
                        "m+": this.getMinutes(),                 //分
                        "s+": this.getSeconds(),                 //秒
                        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                        "S": this.getMilliseconds()             //毫秒
                    };
                    if (/(y+)/.test(fmt))
                        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                    for (var k in o)
                        if (new RegExp("(" + k + ")").test(fmt))
                            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    return fmt;
                }
            }

            return new Date(val).formatter(this.valueFormat);
        }

        else return '';
    }

    setValue(val){
        if(val !== void 0){
            this.value = val;
        }
    }

    getValue(){
        return this.value;
    }

    getFormatterVal(){
        return this.formatter(this.value);
    }

    isDisable(flag) {
        this.disabled = flag;
    }
    setPlaceHolder(value) {
        this.placeholder = value
    }
    render() {

        let {
            scopeIns: {
                methods: curMethod = {}
            }
        } = this._fragScope;

        const dataPath = super.getDataPath(),
            methodPath = super.getMethodPath();


        let template = `
            <el-date-picker 
            style="${this.fullLine ? `width: 100%;` : ''}"
            v-model="${dataPath}.value"
            type="${this.type}"
            :disabled="${dataPath}.disabled"
            ${this.editable ? `editable` : ``}
            ${this.clearable ? `clearable` : ``}
            size="${this.size}"
            :placeholder="${dataPath}.placeholder"
            start-placeholder="${this.startPlaceholder}"
            end-placeholder="${this.endPlaceholder}"
            format="${this.valueFormat}"
            value-format="timestamp"
            prefix-icon="${this.prefixIcon}"
            ${curMethod.changeHandler ? `@change="${methodPath}_changeHandler"` : ''}
            >
            </el-date-picker>
        `;
        return super.render(template);
    }
}
