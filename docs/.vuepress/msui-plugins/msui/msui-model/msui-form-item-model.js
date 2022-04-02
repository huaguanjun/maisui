class MsuiFormItemModel {
    constructor({
        label = '',
        value = '',
        rules = null,
        template = 'MsuiInput',
    } ={}) {
        this.label = label,
        this.value = value,
        this.rules = rules,
        this.template = template
    }
    type(attrs, type='MsuiInput') {
        if (type === 'MsuiSelectBox' && attrs.options instanceof Promise) {
            attrs.options.then(options => {
                attrs.options = options
            })
        }
        this.attrs = attrs;
        this.template = type;
        return this;
    }
    addRules(rules) {
        if (rules instanceof Array) {
           this.rules = rules
        } else if (rules instanceof Object) {
            this.rules.push(rules)
        }
        return this
    }
    getAttrs() {
        return this.attrs
    }
    getSpan() {
        if(this.attrs && this.attrs.span) {
            return Number(this.attrs.span)
        } else {
            return ''
        }
    }
    observe(callBack) {
        //监听value变化进行formater
        Object.defineProperty(this,'value',{
            set:(val) => {
              if(val === this.value) return;
              this.value = callBack(val)
            }
        })
        return this
    }
    render() {
        return this.template
    }
    setValue(value) {
        this.value = value;
        return this
    }
}

export default MsuiFormItemModel