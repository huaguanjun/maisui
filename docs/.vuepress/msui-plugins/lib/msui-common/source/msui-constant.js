/**
 *
 * 定义 Msui 框架中用到的各种常量
 *
 * @author sq / lwz
 *
 * MSUI_ELEMENT_CONSTANT
 * MSUI_FRAGMENT_CONSTANT
 * MSUI_UTIL_CONSTANT
 *
 * **/

const MSUI_FORM_CONSTANT = {
        MODEL_NAME: 'msui-form',
        REQUEST_TABS_DATA_ERROR: '表单页签数据请求失败，请检查连接是否通畅',
        REQUEST_DATA_ERROR: '数据请求失败，请检查连接是否通畅',
        UNKNOWN_FORM_MODEL_ERROR: `formModel格式不正确、必填参数，格式如下：formModel: Array<MsuiFormModel> || MsuiFormModel`
    },
    MSUI_FORM_GROUP_CONSTANT = {
        MODEL_NAME: 'msui-form-group',
        NO_SUCH_FORMS_ERROR: 'forms为必填参数，并且每一项都要为MsuiForm格式如下：forms: Array<MsuiForm>'
    },

    MSUI_FORM_MODEL_CONSTANT = {
        MODEL_NAME: 'msui-form-model',
        UNKNOWN_ORIGIN_MODEL_ERROR: '需要合并的表单模型不能为空',
        ALREADY_EXISTS_ITEM_NAME: '该模型已存在该字段'
    },

    MSUI_ELEMENT_CONSTANT = {
        MODEL_NAME: 'msui-element',
        NO_SUCH_ELEMENT: '渲染组件时未找到可用节点',
        RENDERED_ERROR: '该组件已经渲染完成',
        EMPTY_TEMPLATE_ERROR: '组件渲染模板为空',
        TAG_STRUCTOR_ERROR: '组件渲染的标签格式不正确',
        ELEMENT_PLUGIN_RENDER_ERROR: '组件渲染失败',
        NO_SUCH_RUNTIME: '没有VUE运行环境'
    },

    MSUI_DATAGRID_CONSTANT = {
        MODEL_NAME: 'msui-datagrid',
        REQUEST_DATA_ERROR: '数据请求失败，请检查连接是否通畅',
        INTERVAL_TIME_ERROR: 'interval值不能小于3000ms',
        NO_SUCH_MODULE_NAME: '模块委托中moduleName参数不能为空',
        BEFORE_METHOD_RETURN_ERROR: 'before方法在请求行为之前触发，请返回请求需要传递的参数',
        NO_SUCH_PRIMARY_KEY: '数据模型中没有主键列',
        NO_SUCH_LOAD_REQUEST: 'load参数不能为空，可选值为String || Object',
        UNKNOWN_COLUMN_MODEL_ERROR: `dataModel参数格式不正确、必填参数，格式如下：dataModel: MsuiDataGridModel`,
        //扩展按钮默认属性
        EXT_BTN_ATTR:{}
    },

    MSUI_DATAGRID_MODEL_CONSTANT = {
        MODEL_NAME: 'msui-datagrid-model',
        UNKNOWN_ORIGIN_MODEL_ERROR: '需要合并的表格列模型不能为空',
        ALREADY_EXISTS_ITEM_NAME: '该模型已存在当前合并的子模型',
        FORMATTER_TYPE_ERROR: 'formatter方法参数类型错误，可接受的参数为：Boolean、Function。当值为Boolean时，启用过滤插件框的格式化逻辑。当值为Function时，执行自定义格式化',
        NO_SUCH_MODELS: '请配置相应的模型，格式为：{ modelEngName, modelCNName }'
    },

    MSUI_DATAGRID_COLUMN_MODEL_CONSTANT = {
        FILTER_KEY: '_filter',
        SORT_KEY: '_sort',
    },

    MSUI_MODEL_TEMPLATE = {
        MODEL_NAME: 'msui-model-template',
        NO_SUCH_MODEL_NAME: '模块名称为必填参数，且参数类型为不是空的字符串'
    },

    MSUI_UPLOAD_CONSTANT = {
        MODEL_NAME: 'msui-upload'
    },

    MSUI_INPUT_CONSTANT = {
        MODEL_NAME: 'msui-input',
        UNKNOWN_INPUT_TYPE: 'input类型不正确，可选值为：'
    },

    MSUI_SELECTBOX_CONSTANT = {
        MODEL_NAME: 'msui-selectbox',
        REQUEST_DATA_ERROR: '数据请求失败，请检查连接是否通畅'
    },

    MSUI_ROUTE_MANAGER_CONSTANT = {
        MODEL_NAME: 'msui-route-manager',
        NO_SUCH_ENTRYPAGE_FIRSTPATH_ERROR: '没有找到有效的入口与初始页面路径'
    },

    MSUI_TABS_CONSTANT = {
        MODEL_NAME: 'msui-tabs',
        UNKNOWN_LOADER_PARAMS: 'loader参数的格式为：loader: String || Object，必填',
        REQUEST_DATA_ERROR: '数据请求失败，请检查连接是否通畅',
    },

    MSUI_DATETIME_CONSTANT = {
        MODEL_NAME: 'msui-datetime',
        UNKNOWN_DATETIME_TYPE_ERROR: `datetime类型不正确、必须是：year/month/date/week/datetime/datetimerange/daterange`
    },

    MSUI_OPEN_COMPONENT_UTIL_CONSTANT = {
        MODEL_NAME: 'msui-open-compoment-util',
        NO_SUCH_COMPONENT: '根据路由无法获取相应的组件'
    },

    MSUI_DROPDOWN_CONSTANT = {
        MODEL_NAME: 'msui-dropdown',
        NO_SUCH_DATA: '组件没有合适的数据集，data 参数必填，且类型是 Array',
        NO_SUCH_TARGET: '组件没有合适的目标组件'
    },

    MSUI_TOPO_CONSTANT = {
        MODEL_NAME: 'msui-topo',
        UNKNOWN_ELEMENT: 'element参数值必须为Element或string'
    };

export {
    MSUI_FORM_CONSTANT,
    MSUI_FORM_MODEL_CONSTANT,
    MSUI_MODEL_TEMPLATE,
    MSUI_FORM_GROUP_CONSTANT,
    MSUI_ROUTE_MANAGER_CONSTANT,
    MSUI_TABS_CONSTANT,
    MSUI_UPLOAD_CONSTANT,
    MSUI_INPUT_CONSTANT,
    MSUI_ELEMENT_CONSTANT,
    MSUI_DATAGRID_CONSTANT,
    MSUI_DATETIME_CONSTANT,
    MSUI_SELECTBOX_CONSTANT,
    MSUI_DATAGRID_MODEL_CONSTANT,
    MSUI_DATAGRID_COLUMN_MODEL_CONSTANT,
    MSUI_OPEN_COMPONENT_UTIL_CONSTANT,
    MSUI_DROPDOWN_CONSTANT,
    MSUI_TOPO_CONSTANT
}