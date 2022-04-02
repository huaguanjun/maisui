// diaglog可拖动配置
// import './lib/msui-util/source/msui-dialogDrag'

// 引入样式
import './lib/msui-common/source/index'

import MsuiElement, {
    MsuiDataGrid,
    MsuiDialog,
    MsuiForm,
    MsuiFormGroup,
    MsuiFormNew,
    MsuiMenu,
    MsuiResourceTree,
    MsuiTree
} from './lib/msui-element/index'

import MsuiUtil, {
    MsuiMicroAdapter,
    MsuiStorage,
    MsuiAxios,
    MsuiEventCenter,
    MsuiLoading,
    MsuiMsg,
    MsuiNotify,
    MsuiOpenComponentsUtil,
    MsuiRouteManager,
    MsuiInterval
} from './lib/msui-util/index'

import MsuiFragment, {
    MsuiButton,
    MsuiDataGridColumnModel,
    MsuiDataGridModel,
    MsuiDateTimePicker,
    MsuiInput,
    MsuiRadio,
    MsuiSelectBox
} from './lib/msui-fragment/index'
import MsuiModelTemplate from './lib/msui-common/source/msui-model-template'

import MsuiStore, {MsuiObserver} from './lib/msui-common/index';


export default function (Vue) {
    if (Vue && Vue.use instanceof Function) {
        Vue.use(MsuiElement);
        Vue.use(MsuiUtil);
    }
}

export {
    MsuiUtil,
    MsuiElement,
    MsuiFragment
};

export {
    MsuiMicroAdapter,
    MsuiObserver,
    MsuiStore,

    MsuiTree,
    MsuiMenu,
    MsuiForm,
    MsuiDialog,
    MsuiDataGrid,
    MsuiFormGroup,
    MsuiFormNew,
    MsuiResourceTree,

    MsuiStorage,
    MsuiAxios,
    MsuiInterval,
    MsuiNotify,
    MsuiLoading,
    MsuiMsg,
    MsuiRouteManager,
    MsuiEventCenter,
    MsuiOpenComponentsUtil,

    MsuiInput,
    MsuiRadio,
    MsuiButton,
    MsuiSelectBox,
    MsuiDateTimePicker,
    MsuiDataGridModel,
    MsuiDataGridColumnModel,

    MsuiModelTemplate
}
