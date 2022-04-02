import _ from 'lodash';
import MsuiFragment from "./../msui-fragment-new";
import MsuiInput from "./msui-input";
import MsuiOpenComponentsUtil from "../../msui-util/source/msui-opencomponent-util";
import MsuiAxios from "../../msui-util/source/msui-axios";

const ITEM_KEY = "resourceTreeInput";
const BAD_RES_NAME = "resourceName";

export default class MsuiResourceTreeInput extends MsuiFragment{

    constructor({
                    target = null,
                    props = {
                        text: 'text',
                        value: 'value'
                    },
                    beforeOpen = null,
                    tableOptions = null,
                    clickHandler,
                    inputHandler,
                    clearHandler = null,
                    multiple = false,
                    splitReg = ',',
                    queryParams = {},
                    url = null,
                    resTreeComponent,
                    placeholder = '请选择数据'
                } = {}){

        super();

        let {
            scopeIns: {
                methods: curMethod = {}
            }
        } = this._fragScope;

        this.multiple = multiple;
        this.resVal = [];
        this.resData = [];
        this.props = props;
        this.splitReg = splitReg;
        this.needRender = true;
        this.inputHandler = inputHandler;

        Object.defineProperty(this, 'queryNodeAxios', {
            value: new MsuiAxios({
                url: url || 'resource/baseRes/baseResourceSvc/getByGuid'
            }),
            enumerable: false
        });

        const parentData = {
            queryParams,
            tableOptions,
            multiple
        };

        let resTreeInput;
        // 资源树点击确认后的回调
        const confirmFun = (result = []) => {
            // 赋值
            this.setDataAndVal(result);
            dialogIns.close();
            // 触发回调
            if(_.isFunction(clickHandler)){
                clickHandler(result);
            }
        };

        //选择树清除事件
        const inputClearHandler = () => {
            this.resVal = [];

            this.setValue('');
            if(clearHandler) {
                clearHandler();
            }
        };

        // 点击输入框触发的回调
        const inputClickHandler = () => {

            resTreeInput.blur();
            const selectData = this.getDataAndVal();
            if(selectData !== ''){
                parentData.selectData = selectData;
            }

            if(beforeOpen instanceof Function){
                const resultParam = beforeOpen(queryParams);
                if(resultParam instanceof Object){
                    parentData.queryParams = resultParam;
                }
            }

            dialogIns.setConfirmFun(confirmFun);
            dialogIns.open({
                parentData
            });
        };

        // 资源选择树 —— 弹框
        const dialogIns = MsuiOpenComponentsUtil.openComponentDialog({
            width: '30%',
            visible: false,
            parentData,
            content: resTreeComponent
        });

        if(target instanceof Element){
            resTreeInput = target;
            target.addEventListener('click', () => {
                inputClickHandler();
            });
            this.needRender = false;
        }else{
            resTreeInput = this[ITEM_KEY] = new MsuiInput({
                clickHandler: inputClickHandler,
                inputHandler,
                clearHandler: inputClearHandler,
                placeholder
            });
            super.addFragment(ITEM_KEY, resTreeInput);
        }
    }
    getValue(){
        return this.resVal.join(this.splitReg);
    }

    setValue(val = ''){
        if(val === ''){
            this.setDataAndVal([]);
            return this;
        }

        // 表单赋值时，根据guids查询节点数据
        this
            .queryNodeAxios
            .sender({
                guid: val
            })
            .then( (data) => {
                if (this.inputHandler instanceof Function) {
                    this.inputHandler([data]);
                }
                this.setDataAndVal([data]);
            });

        return this;
    }

    disable(disabled = true){
        this[ITEM_KEY].disable(disabled);
        return this;
    }

    getDataAndVal(){
        return this.resData;
    }
    setPlaceHolder(value) {
        this[ITEM_KEY].placeholder = value
    }
    setDataAndVal(data){
        if(data instanceof Array){
            this.resData = data;
            this.resVal = this.mapData( (data) => {
                return data[this.props.value];
            });

            let text = this.mapData((data) => {
                // TODO: 这么做是因为后台接口无法将返回的结果字段名称统一起来
                // TODO: 在这里，查询资源树与资源Grid，显示的字段名称为name
                // TODO: 但资源树回显使用的字段名称却是resourceName
                if(data[this.props.text] !== void 0){
                    return data[this.props.text];
                }else if(data[BAD_RES_NAME] !== void 0){
                    data[this.props.text] = data[BAD_RES_NAME];
                    return data[BAD_RES_NAME];
                }else
                    return '';
            }).join(this.splitReg);

            if(this.needRender)
                this[ITEM_KEY].setValue(text);
        }
        return this;
    }

    setData(data = []){
        if(data instanceof Array)
            this.resData = data;
        return this;
    }

    getData(){
        return _.clone(this.resData);
    }

    filterData(cb){
        if(_.isFunction(cb)){
            return this.resData.filter(cb);
        }else return [];
    }

    mapData(cb){
        if(_.isFunction(cb)){
            return this.resData.map(cb);
        }else return [];
    }

    getValueRealPath(){
        return ITEM_KEY;
    }

    render(){
        return super.render(`${this[ITEM_KEY].render()}`);
    }

}
