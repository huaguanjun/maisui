import MsuiFragment from "../msui-fragment-new";
import _ from 'lodash';
import {_errorFactory} from "../../msui-common/source/_self-util";
import {MSUI_DROPDOWN_CONSTANT} from "../../msui-common/source/msui-constant";

const _error = _errorFactory(MSUI_DROPDOWN_CONSTANT);

const _defaultProps = {
    text: 'text',
    value: 'value'
};

/**
 * MsuiDropdown 下拉按钮
 * @constructor
 * **/
export default class MsuiDropdown extends MsuiFragment {

    constructor({
                data = [],
                icon = '',
                props,
                target = '',
                clickHandler
                } = {}) {
        super();

        let {
            scopeIns: {
                methods: curMethod = {}
            }
        } = this._fragScope;

        if(!_.isArray(data))
            _error('NO_SUCH_DATA');

        if(_.isEmpty(target))
            _error('NO_SUCH_TARGET');

        this.data = data;
        this.icon = icon;
        this.target = target;
        this.props = props ? _.merge({}, _defaultProps, props) : _defaultProps;

        if (clickHandler instanceof Function) {
            curMethod.clickHandler = clickHandler;
        }
    }

    render() {
        const dataPath = super.getDataPath(),
            methodPath = super.getMethodPath(),
            {
                scopeIns: {
                    methods: curMethod = {}
                }
            } = this._fragScope;

        let template = `
                <el-dropdown ${curMethod.clickHandler ? `@command="${methodPath}_clickHandler"` : ''}>
                  <el-button size="mini" :icon="${dataPath}.icon">
                    {{ ${dataPath}.target }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item 
                        :key="item[${dataPath}.props.value]"
                        v-for="(item, i) in ${dataPath}.data"
                        :command="item.${this.props.value}"
                    >{{ item.${this.props.text} }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
        `;
        return super.render(template);
    }
}
