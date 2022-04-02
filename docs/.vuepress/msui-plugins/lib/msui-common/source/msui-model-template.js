import MsuiDataGridModel from '../../msui-fragment/msui-datagrid-model'
import MsuiFormModel from "../../msui-fragment/msui-form-model";


export default class MsuiModelTemplate{

    constructor(model = {}){

        Object.defineProperty(this, '_options', {
            value: {},
            enumerable: false
        });

        let keys = Object.keys(model),i = keys.length;
        while(i--){
            this._options[keys[i]] = model[keys[i]];
        }
    }

    isDataGridModel(){
        return new MsuiDataGridModel(this);
    }

    isFormModel(){
        return new MsuiFormModel(this);
    }

}