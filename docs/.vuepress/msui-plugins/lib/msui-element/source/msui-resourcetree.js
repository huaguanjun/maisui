import MsuiElement from "./msui-element";
import MsuiResourceTreeInput from "../../msui-fragment/msui-base-components/msui-resourcetree-input";
import mspResourceTree from './../../msui-useage-vue-template/mspResourceTree'

export default class MsuiResourceTree extends MsuiElement{

    static _pluginName = 'MsuiResourceTree';

    constructor(options = {}){

        super();

        options.resTreeComponent = mspResourceTree;

        this.needRender = !options.target;
        this.addFragment('resourceTree', new MsuiResourceTreeInput(options));
    }

    render(el){

        if(this.needRender){
            const vueConfig = this.msui_element_config;

            // 表单分页渲染模板
            vueConfig.template = `
            ${super.getFragment('resourceTree').render()}
        `;

            return super.render(el);
        }

        return this;
    }

    static install(MsuiElement) {
        MsuiElement[this._pluginName] = this;
    }
}
