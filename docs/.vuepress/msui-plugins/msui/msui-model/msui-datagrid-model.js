import MsuiDataGridItemModel from "./msui-datagrid-item-model"

class MsuiDataGridModel {
    constructor({
        dataModel,
        align = 'center'
        } = {}) {
        this.initDataGridItem(dataModel, align)
    }
    initDataGridItem(dataModel, align) {
        this._options = []
        
        for(let key in dataModel) {
            this._options.push({
                label: dataModel[key],
                prop: key,
                align: align
            })
        }

        this._options.forEach(item => {
            this[item.prop] = new MsuiDataGridItemModel(item) 
        })
    }
}

export default MsuiDataGridModel