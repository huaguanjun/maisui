/**
 * 用于测试组件
 * Created by liangwenzheng on 2020-03-18
 */
import MsuiElement from "./msui-element";
import MSuiDateTimePicker from "../../msui-fragment/msui-base-components/msui-datetime-picker";

export default class MsuiFragmentTest extends MsuiElement {
    static _pluginName = 'MsuiFragmentTest';

    constructor({value = ''} = {}) {
        super();

        //测试时间选择器
        let dateTimePicker = new MSuiDateTimePicker({
            value: value,
            type: 'daterange',
            valueFormat:'yyyy-MM-dd',
            changeHandler(value) {
                console.log(value);
            }
        });
        super.addFragment('dateTimePicker', dateTimePicker);
    }

    render(el) {
        let vueConfig = this.msui_element_config,
            pluginConfig = this.msui_plugin_config;
        vueConfig.template = `
            <div>
                 ${super.getFragment("dateTimePicker").render()}
            </div>
        `;
        return super.render(el);
    }

    static install(MsuiElement) {
        MsuiElement[this._pluginName] = this;
    }
}