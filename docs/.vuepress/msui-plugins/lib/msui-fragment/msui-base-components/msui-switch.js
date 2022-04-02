import MsuiFragment from "../msui-fragment-new";

export default class MsuiSwitch extends MsuiFragment{

    constructor({
                    disabled = false,
                    activeColor = '#409EFF',
                    inactiveColor = '#C0CCDA',
                    activeValue = true,
                    inactiveValue = false,
                    activeText = '',
                    inactiveText = '',
                    changeHandler = null
                } = {}){

        super();

        let {
            scopeIns: {
                methods: curMethod = {}
            }
        } = this._fragScope;

        this.activeColor = activeColor;
        this.inactiveColor = inactiveColor;
        this.activeValue = activeValue;
        this.inactiveValue = inactiveValue;
        this.activeText = activeText;
        this.inactiveText = inactiveText;
        this.disabled = disabled;

        this.value = activeValue;

        if(changeHandler instanceof Function)
            curMethod.changeHandler = changeHandler;
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

    render(){

        let {
            scopeIns: {
                methods: curMethod = {}
            }
        } = this._fragScope;

        const dataPath = super.getDataPath(),
            methodPath = super.getMethodPath();

        let template = `
            <el-switch 
                msuiRef
                v-model="${dataPath}.value"
                :disabled="${dataPath}.disabled"
                active-value="${this.activeValue}"
                inactive-value="${this.inactiveValue}"
                active-color="${this.activeColor}"
                inactive-color="${this.inactiveColor}"
                ${this.activeText ? `active-text="${this.activeText}"` : ''}
                ${this.inactiveText ? `inactive-text="${this.inactiveText}"` : ''}
                ${curMethod.changeHandler ? `@change="${methodPath}_changeHandler"` : ''}
                />
        `;

        return super.render(template);
    }

}