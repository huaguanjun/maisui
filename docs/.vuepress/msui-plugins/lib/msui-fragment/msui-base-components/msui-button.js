/**
 * Created by liangwenzheng on 2020-03-17
 */
import MsuiFragment from "../msui-fragment-new";

const _typeEnum = new Set(['', 'primary', 'success', 'warning', 'danger', 'info', 'text']);
const MSUI_BUTTON_ERROR = {
    UNKNOWN_BUTTON_TYPE: 'BUTTON类型不正确，可选值为' + _typeEnum.toString()
};
export default class MsuiButton extends MsuiFragment {
    constructor({
                    text = '',
                    size = 'mini',
                    type = '',
                    plain = false,
                    round = false,
                    circle = false,
                    loading = false,
                    disabled = false,
                    visible = null,
                    icon = '',
                    autofocus = false,
                    clickHandler = null
                } = {}) {
        super();

        let {
            scopeIns: {
                methods: curMethod = {}
            }
        } = this._fragScope;

        if (!_typeEnum.has(type))
            return console.error(MSUI_BUTTON_ERROR.UNKNOWN_BUTTON_TYPE);

        this.text = text;
        this.size = size;
        this.type = type;
        this.plain = plain;
        this.round = round;
        this.circle = circle;
        this.loading = loading;
        this.disabled = disabled;
        this.visible = _.isBoolean(visible) ? visible: _.isFunction(visible) ? Boolean(visible()) : true;
        this.icon = icon;
        this.autofocus = autofocus;

        if (clickHandler instanceof Function) {
            curMethod.clickHandler = clickHandler;
        }
    }

    toggleVisible(visible){
        this.visible = visible !== void 0 && visible != null ?
            !!visible : !this.visible;
    }

    setDisabled(disabled) {
        this.disabled = disabled;
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
                <el-button 
                msuiRef
                v-show="${dataPath}.visible"
                size="${this.size}" 
                type="${this.type}"
                ${this.plain ? `plain` : ''}
                ${this.round ? `round` : ''}
                ${this.circle ? `circle` : ''}
                ${this.autofocus ? `autofocus` : ''}
                :disabled="${dataPath}.disabled"
                :loading="${dataPath}.loading"
                :icon="${dataPath}.icon"
                ${curMethod.clickHandler ? `@click="${methodPath}_clickHandler"` : ''}
                >{{ ${dataPath}.text }}</el-button>
        `;
        return super.render(template);
    }

    setLoading(flag) {
        this.loading = flag;
    }
}
