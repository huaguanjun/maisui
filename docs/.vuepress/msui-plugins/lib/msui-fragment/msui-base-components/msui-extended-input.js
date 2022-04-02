import _ from 'lodash';
import MsuiFragment from "./../msui-fragment-new";
import MsuiInput from "./msui-input";
import MsuiOpenComponentsUtil from "../../msui-util/source/msui-opencomponent-util";
import MsuiDialog from "../../msui-element/source/msui-dialog";

const ITEM_KEY = "resourceTreeInput";

const DEFAULT_DIALOG_OPTIONS = {
    width: '70%',
    component: null
};

export default class MsuiExtendedInput extends MsuiFragment{

    constructor({
                    target = null,
                    props = {
                        text: 'text',
                        value: 'value'
                    },
                    setValueHandler = null,
                    clickHandler,
                    inputHandler,
                    clearHandler = null,
                    placeholder = '请选择数据'
                } = {}){

        super();

        let {
            scopeIns: {
                methods: curMethod = {}
            }
        } = this._fragScope;

        this.resVal = '';
        this.resText = '';

        this.resData = null;
        this.props = props;
        this.setValueHandler = setValueHandler;

        let resTreeInput;
        //选择树清除事件
        const inputClearHandler = () => {

            this.clear();

            if(clearHandler) {
                clearHandler();
            }
        };

        // 点击输入框触发的回调
        const inputClickHandler = () => {

            resTreeInput.blur();

            if(clickHandler instanceof Function){
                clickHandler(this.resVal, this.resText);
            }
        };

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

    disable(disabled = true){
        this[ITEM_KEY].disable(disabled);
        return this;
    }

    getValue(){
        return this.resVal;
    }

    getData(){
        return this.resData;
    }

    setValue(val = ''){

        if(val === ''){
            this.clear();
            return this;
        }

        if(val instanceof Object){
            this._setValue(val);
        }
        else if(this.setValueHandler instanceof Function){
            const promise = this.setValueHandler(val);
            promise
                .then( resData => {
                    this._setValue(resData);
                });
        }

        return this;
    }

    _setValue(data){
        if(data instanceof Object){
            const {text: propsKey, value: propsValue} = this.props;

            if(data[propsKey] !== void 0 && data[propsValue] !== void 0){

                this[ITEM_KEY].setValue(data[propsKey]);

                this.resData = data;
                this.resVal = data[propsValue];
                this.resText = data[propsKey];

            }
        }
    }

    clear(){
        this.resVal = '';
        this.resText = '';
        this.resData = null;
    }

    setPlaceHolder(value) {
        this[ITEM_KEY].placeholder = value
    }

    getValueRealPath(){
        return ITEM_KEY;
    }

    render(){
        return super.render(`${this[ITEM_KEY].render()}`);
    }

}