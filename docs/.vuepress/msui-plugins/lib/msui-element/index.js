import MsuiElement from './source/msui-element'
import MsuiTree from './source/msui-tree'
import MsuiDataGrid from './source/msui-datagrid'
import MsuiDialog from './source/msui-dialog'
import MsuiForm from "./source/msui-form";
import MsuiMenu from './source/msui-menu';
import MsuiFormGroup from './source/msui-form-group';
import MsuiResourceTree from './source/msui-resourcetree';

import MsuiFormNew from './source/msui-form-new'


MsuiElement.add(MsuiTree);
MsuiElement.add(MsuiDataGrid);
MsuiElement.add(MsuiForm);
MsuiElement.add(MsuiDialog);
MsuiElement.add(MsuiFormGroup);
MsuiElement.add(MsuiResourceTree);


export default MsuiElement;

export {
    MsuiTree,
    MsuiMenu,
    MsuiForm,
    MsuiDialog,
    MsuiDataGrid,
    MsuiFormGroup,
    MsuiResourceTree,
    MsuiFormNew
}
