import MsuiButton from './msui-base-components/msui-button'
import MsuiDateTimePicker from './msui-base-components/msui-datetime-picker'
import MsuiInput from './msui-base-components/msui-input'
import MsuiRadio from './msui-base-components/msui-radio'
import MsuiSelectBox from './msui-base-components/msui-selectbox'
import MsuiDataGridModel from './msui-datagrid-model'
import MsuiDataGridColumnModel from './msui-datagrid-column-model'

let MsuiFragment = {
    MsuiButton,
    MsuiInput,
    MsuiRadio,
    MsuiSelectBox,
    MsuiDateTimePicker,
    MsuiDataGridModel,
    MsuiDataGridColumnModel,
    install(Vue){
        Vue.prototype.$MsuiFragment = MsuiFragment;
    }
};

export default MsuiFragment;

export {
    MsuiInput,
    MsuiRadio,
    MsuiButton,
    MsuiSelectBox,
    MsuiDateTimePicker,
    MsuiDataGridModel,
    MsuiDataGridColumnModel
}