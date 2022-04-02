class MsuiDataGridItemModel {
    constructor({
        width,
        prop, 
        label, 
        align = 'center',
        show = true,
        type = 'text'
    } ={}) {
        this.width = width
        this.prop = prop
        this.label = label
        this.align = align
        this.show = show
        this.type = type
        this.edit = false
    }
    setWidth(width) {
        this.width = width
        return this
    }
    setEdit(boolean) {
        this.edit = boolean
        return this
    }
    connect(connect) {
        this.connect = connect;
        return this;
    }
    setAlign(align) {
        this.align = align
        return this
    }
    formatter(formatters) {
        this.formatters = (value) => {
            if(this.data instanceof Promise) {
                this.data.then(() => {
                    this.formatters = formatters
                })
                return value
            } else {
                this.formatters = formatters
            }
        };
        return this
    }
    formatterData({ data }) {
        if(data instanceof Promise) {
           data.then(data => {
               this.data = data
           })
           this.data = data
        } else if(data.length > 0){
            this.data = data
        }
       return this
    }
    loader({ loader }) {
        this.loader = loader;
        return this;
    }
    setType(type) {
        this.type = type
        return this
    }
}

export default MsuiDataGridItemModel