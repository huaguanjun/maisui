/**
 * MsuiStore msui常量类
 */

const MSUI_OPENCOMPONENT_CONSTANT = deepFreeze({
    DEDAULT_DIALOG_ID: 'main-dialog-container',
    CONTENT_TYPE: {
        element: 1, //element元素
        content: 2, //html内容
        component: 3, //组件
        outer: 4,  //外部系统
    },
    OPEN_TYPE: {
        inner:'inner',//内部组件打开
        self: 'self', //dialog打开
        blank: 'blank',//tab打开
    },
})

//from 类型
const FORM_TYPE_CONSTANT = deepFreeze({
    ADD_FORM: 'add',
    VIEW_FORM: 'view',
    DETAIL_FORM: 'detail'
});

const COMMON_TYPE = {
    ACCESS_TOKEN: 'Access-Token'
};


const MsuiStore = {
    MSUI_OPENCOMPONENT_CONSTANT,
    FORM_TYPE_CONSTANT,
    COMMON_TYPE
}

// 深冻结函数.
function deepFreeze(obj) {

    // 取回定义在obj上的属性名
    var propNames = Object.getOwnPropertyNames(obj);

    // 在冻结自身之前冻结属性
    propNames.forEach(function(name) {
        var prop = obj[name];

        // 如果prop是个对象，冻结它
        if (typeof prop == 'object' && prop !== null)
            deepFreeze(prop);
    });

    // 冻结自身(no-op if already frozen)
    return Object.freeze(obj);
}

export default MsuiStore;
