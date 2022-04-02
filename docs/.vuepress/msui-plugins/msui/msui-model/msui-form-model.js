import MsuiFormItemModel from './msui-form-item-model'

class MsuiFormModel {
    constructor(formModel) {
        this.init(formModel)
    }
    init(formModel) {
        for(let key in formModel) {
            this[key] = new MsuiFormItemModel({
                value: '',
                label: formModel[key]
            })
        }
    }
    addRules(rules) {

      // 对校验规则深拷贝，避免指向同一个地址
      rules = JSON.parse(JSON.stringify(rules))
      for(let item in this) {
        this[item].addRules(rules)
      }
    }
    setData(data) {
        for(let key in data) {
          if(this[key]) {
            this[key].setValue(data[key])
          }
        }
    }
}

export default MsuiFormModel
