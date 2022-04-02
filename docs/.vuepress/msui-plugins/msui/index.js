import MsuiAxios from "./msui-utils/msui-axios";
import MsuiUtils from "./msui-utils/msui-utils";
import MsuiSubcribe from "./msui-utils/msui-subcribe";
import MsuiElement from "./msui-element/msui-element";
import MsuiDataGridModel from "./msui-model/msui-datagrid-model";
import MsuiFormModel from "./msui-model/msui-form-model";
import MsuiDialog from './msui-base-component/msui-dialog';
import MsuiInput from './msui-base-component/msui-input';
import MsuiSelectBox from './msui-base-component/msui-select';
import MsuiUpload from './msui-base-component/msui-upload'
import MsuiPagination from './msui-base-component/msui-pagination';
import MsuiDatagrid from './msui-base-component/msui-datagrid';
import Msuiform from './msui-base-component/msui-form';
import MsuiTimePicker from './msui-base-component/msui-time-picker';
import MsuiMessage  from "./msui-utils/msui-messagse";

const map = {
    MsuiAxios,
    MsuiUtils,
    MsuiElement,
    MsuiDataGridModel,
    MsuiFormModel,
    MsuiSubcribe,
    MsuiMessage
}

const components = [
    MsuiDialog,
    MsuiInput,
    MsuiSelectBox,
    MsuiPagination,
    MsuiTimePicker,
    MsuiDatagrid,
    Msuiform,
    MsuiUpload
]

export default class  MsuiPlugins {
    static install(Vue) {
        for (let key in map) {
            Vue.prototype[key] = map[key]
            if(key === 'MsuiElement') {
                MsuiElement.Vue = Vue

                // 注册MSUI全局组件
                components.forEach(item => {
                    Vue.component(item.name, item)
                })
            }
        }
    }
}

export {
    MsuiDataGridModel,
    MsuiFormModel
}