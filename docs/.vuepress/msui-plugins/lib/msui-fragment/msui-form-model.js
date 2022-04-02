import MsuiFragment from "./msui-fragment-new";
import {_eachObj, _errorFactory, _warningFactory} from "./../msui-common/source/_self-util";
import {MSUI_FORM_MODEL_CONSTANT} from "../msui-common/source/msui-constant";
import MsuiFormItemModel from "./msui-form-item-model";

const _error = _errorFactory(MSUI_FORM_MODEL_CONSTANT);
const _warn = _warningFactory(MSUI_FORM_MODEL_CONSTANT);

export default class MsuiFormModel extends MsuiFragment{

    constructor(msuiModelTemplate){

        super();

        if(msuiModelTemplate && this){
            let model = msuiModelTemplate._options;
            _eachObj(model, (prop, label) => {
                if(!this.addItemModel(prop, new MsuiFormItemModel({prop, label}))){
                    return _warn(['ALREADY_EXISTS_ITEM_NAME', prop]);
                }
            });
        }
    }

    addItemModel(itemName, item){
        if(itemName && (item instanceof MsuiFormItemModel)){
            if(this[itemName]){
                return false;
            }

            this[itemName] = item;
            super.addFragment(itemName, item);
        }
        return true;
    }

    /**
     * 合并表单模型
     *
     * @param originModel { MsuiFormModel } 需要合并的表单模型
     * @param extendModels { Array<MsuiFormModel> } 被合并的表单模型
     *
     * **/
    static mergeFormModels(originModel, extendModels = []){
        if(!originModel instanceof MsuiFormModel)
            return _error('UNKNOWN_ORIGIN_MODEL_ERROR');

        extendModels.forEach( model => {
            if(model instanceof MsuiFormModel){
                _eachObj(model, (itemName, item) => {
                    if(!originModel.addItemModel(itemName, item)){
                        return _warn(['ALREADY_EXISTS_ITEM_NAME', itemName]);
                    }
                });
            }
        });

        return originModel;
    }

    getValue(){
        let values = {};
        _eachObj(this,(itemName, item) => {
            values[itemName] = item.getValue();
        });
        return values;
    }

    setValue(params){
        _eachObj(this, (itemName, item) => {
            if(void 0 !== params[itemName] && null != params[itemName]){
                item.setValue(params[itemName]);
            }
        });
    }

    cleanValue(){
        _eachObj(this, (itemName, item) => {
            item.setValue("");
        });
    }

    disable(disabled = true){
        _eachObj(this, (itemName, item) => {
            item.item().disable(disabled);
        });
    }

    maxLine(maxLineFlag = true){
        _eachObj(this, (itemName, item) => {
            item.maxLine(maxLineFlag);
        });
    }

    get(){
        return this.getValue();
    }

    set(params){
        return this.setValue(params);
    }

    /**
     * 表单模型代理
     * **/
    getProxy(){
        const formModel = this, proxy = {};

        _eachObj(this,(itemName, item) => {
            proxy[itemName] = item.label;
        });

        return new Proxy(proxy,{
            get(target, p) {
                if(formModel.hasOwnProperty(p)){
                    return formModel[p].item();
                }
            },

            set(target, p, value) {
                if(!formModel.hasOwnProperty(p)) return false;
                formModel[p].setValue(value);
                return true;
            }

        });
    }

    /**
     * 管道模式代理
     * **/
    getPipeProxy(){
        const proxyObject = {};
        const funcStack = [];
        const model = this;

        _eachObj(this,(itemName, item) => {
            proxyObject[itemName] = item.label;
        });

        const proxy = new Proxy(proxyObject, {

            get(target, p) {

                // 进入管道
                if(model.hasOwnProperty(p)){
                    // funcStack.length = 0;
                    funcStack.push(p);
                    return proxy;
                }

                // currModel 取最后一位
                let val, currModel = model[funcStack[funcStack.length - 1]];
                if(p === 'get'){
                    val = currModel.getValue();
                }else{
                    val = currModel.item()[p];
                    if(val instanceof Function){
                        val = function(...params){
                            return currModel.item()[p](...params);
                        };
                    }
                }
                funcStack.pop();
                return val;
            },

            set(target, p, value) {
                if(
                    funcStack.length === 0 &&
                    model.hasOwnProperty(p)
                ){
                    model[p].setValue(value);
                }

                else if(p === 'set'){
                    model[funcStack[funcStack.length - 1]].setValue(value);
                }

                funcStack.length = 0;
                return true;
            }
        });

        return proxy;
    }

    render(){
        let model = Object.values(this);
        return `
                ${model.map(cur => `${cur.render()}`).join('')}
        `;
    }
}
