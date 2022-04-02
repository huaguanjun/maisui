/**
 * Created by liangwenzheng on 2020-03-23
 */
import MsuiFragment from "./../msui-fragment-new";

const _ITEM_NAME = '_item';

export default class MsuiRadio extends MsuiFragment {
    constructor({
                    value = '',
                    disabled = false,
                    changeHandler = null,
                    radioItems = {
                        radio1: {},
                        radio2: {}
                    }
                } = {}) {
        super();
        this.value = value;
        this.disable = disabled;
        this.changeHandler = changeHandler;
        this.radioItems = radioItems;
        let {
            scopeIns: {
                methods: curMethod = {}
            }
        } = this._fragScope;

        if (changeHandler instanceof Function) {
            curMethod.changeHandler = changeHandler;
        }
        Object.defineProperty(this, '_itemNames', {
            enumerable: false,
            value: []
        });

        for (let i = 0; i < this.radioItems.length; i++) {
            let radioOpt = this.radioItems[i];
            let radioItem = new MsuiRadioItem(radioOpt);
            let _itemName = _ITEM_NAME + i;
            this.addFragment(_itemName, radioItem);
            this._itemNames.push(_itemName);
        }

    }

    toggleDisableAll() {
        this.disable = !this.disable;
    }

    toggleDisable(index) {
        const curItemKey = this._itemNames[index];
        this._fragScope.fragments[curItemKey].toggleDisable();
    }


    renderRadioItem() {
        return this._itemNames.map( cur => {
            return this._fragScope.fragments[cur].render();
        }).join('');
    }

    render() {
        const dataPath = super.getDataPath(),
            methodPath = super.getMethodPath();

        let template = `
            <el-radio-group 
            v-model="${dataPath}.value"
            :disabled="${dataPath}.disable"
            @change="${methodPath}_changeHandler"
            >
            ${this.renderRadioItem()}
            </el-radio-group>
        `;

        return super.render(template);
    }
}

class MsuiRadioItem extends MsuiFragment {
    constructor({
                    label = '',
                    text = '',
                    disabled = false
                } = {}) {
        super();
        this.label = label;
        this.text = text;
        this.disable = disabled;
    }

    toggleDisable() {
        this.disable = !this.disable;
    }

    render() {
        const dataPath = super.getDataPath();
        let template = `
            <el-radio
            label="${this.label}"
            :disabled="${dataPath}.disabled"
            >${this.text ? this.text : ``}</el-radio>
        `;
        return super.render(template);
    }
}