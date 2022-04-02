import MsuiFragment from "../msui-fragment-new";
import {_error} from "../../msui-common/source/_self-util";
import {MSUI_INPUT_CONSTANT} from "../../msui-common/source/msui-constant";

const _typeEnum = new Set(['text','file','number','password','textarea','hidden']),
      _typeStr = [..._typeEnum].toString();

export default class MsuiInput extends MsuiFragment{

    constructor({
                    max,
                    icon: {
                        prefix = '',
                        suffix = ''
                    } = {},
                    maxrows,
                    size = '',
                    value = '',
                    type = 'text',
                    resize = 'none',
                    readonly = false,
                    disabled = false,
                    placeholder = '请输入内容',
                    clickHandler = null,
                    inputHandler = null,
                    blurHandler = null,
                    clearHandler = null
                } = {}){

        super();

        let {
            scopeIns: {
                methods: curMethod = {}
            }
        } = this._fragScope;

        if(!_typeEnum.has(type))
            return _error(MSUI_INPUT_CONSTANT.MODEL_NAME,
                MSUI_INPUT_CONSTANT.UNKNOWN_INPUT_TYPE + _typeStr);

        this.max = max;
        this.size = size;
        this.type = type;
        this.value = value;
        this.resize = resize;
        this.prefix = prefix;
        this.suffix = suffix;
        this.maxrows = maxrows;
        this.readonly = readonly;
        this.disabled = disabled;
        this.placeholder = placeholder;

        if(max){
            this.showWordLimit = true;
        }

        if(clickHandler instanceof Function)
            curMethod.clickHandler = clickHandler;

        if(inputHandler instanceof Function)
            curMethod.inputHandler = inputHandler;

        if(blurHandler instanceof Function)
            curMethod.blurHandler = blurHandler;

        if(clearHandler instanceof Function)
            curMethod.clearHandler = clearHandler
    }

    blur(){

        console.log(this._fragScope.refKey);

        this.$eleRef && (this.$eleRef.blur());
        return this;
    }

    disable(disabled = true){
        this.disabled = disabled;
        return this;
    }

    getValue(){
        return this.value;
    }

    setValue(val = ''){
        this.value = val;
        return this;
    }
    setPlaceHolder(value) {
        this.placeholder = value
    }
    render(){

        let {
            scopeIns: {
                methods: curMethod = {}
            }
        } = this._fragScope;

        const dataPath = super.getDataPath(),
            methodPath = super.getMethodPath();

        let template = `
            <el-input 
                msuiRef
                clearable
                autosize
                ${this.size?`size=${this.size}`:''}
                type="${this.type}"
                resize="${this.resize}"
                ${this.type === 'number' ? `v-model.number="${dataPath}.value"` : `v-model="${dataPath}.value"`}
                :placeholder="${dataPath}.placeholder"
                ${this.readonly ? `readonly` : ''}
                :disabled="${dataPath}.disabled"
                ${this.max ? `maxlength=${this.max}` : ''}
                ${this.showWordLimit ? `show-word-limit` : ''}
                ${this.type === 'password' ? `show-password` : ``}
                ${this.prefix ? `prefix-icon="${this.prefix}"` : ''}
                ${this.suffix ? `suffix-icon="${this.suffix}"` : ''}
                :autosize="{ minRows: 2 ${this.maxrows ? `, maxRows: ${this.maxrows}` : ''} }"
                ${curMethod.clickHandler ? `@focus="${methodPath}_clickHandler"` : ''}
                ${curMethod.inputHandler ? `@input="${methodPath}_inputHandler"` : ''}
                ${curMethod.blurHandler ? `@blur="${methodPath}_blurHandler"` : ''}
                ${curMethod.clearHandler ? `@clear="${methodPath}_clearHandler"`: ''}
                />
        `;

        return super.render(template);
    }

}
