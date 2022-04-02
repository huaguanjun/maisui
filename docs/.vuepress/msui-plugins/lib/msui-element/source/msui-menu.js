import MsuiElement from "./msui-element";

const SELECT_HANDLER_KEY = 'sltHld';

class MsuiMenu extends MsuiElement {

    static _pluginName = 'MsuiMenu';

    constructor({
                    data = [],
                    mode = 'horizontal',
                    className = '',
                    selectHandler = null
                } = {}) {

        super();

        let vueConfig = this.msui_element_config;
        let pluginConfig = this.msui_plugin_config;

        pluginConfig.data = data;
        pluginConfig.mode = mode;
        pluginConfig.className = className;

        if (selectHandler instanceof Function)
            vueConfig.methods[SELECT_HANDLER_KEY] = selectHandler;

    }

    renderMenu(menus) {
        const {
            className,
            mode
        } = this.msui_plugin_config;

        const {
            methods: vueMethods
        } = this.msui_element_config;

        return `
                <el-menu ${vueMethods[SELECT_HANDLER_KEY] ? `@select="${SELECT_HANDLER_KEY}"` : ''} mode="${mode}" class="${className}">
                    ${menus.map(cur => this.renderMenuChildren(cur)).join('')}
                </el-menu>
        `;
    }

    renderMenuChildren(menu) {
        return `
            ${menu.children.length > 0 ? `
                <el-submenu class="first-menu" index="${menu.id}"><template slot="title">${menu.menuName}</template>
                    ${menu.children.map(item => this.renderMenuChildren(item)).join('')}
                </el-submenu>
            ` : `<el-menu-item index="${menu.menuUrl}" class="first-menu">${menu.menuName}</el-menu-item>`}
        `;
    }

    render(el) {

        let pluginConfig = this.msui_plugin_config,
            vueConfig = this.msui_element_config;

        vueConfig.template = `
            ${this.renderMenu(pluginConfig.data)}
        `;

        return super.render(el);
    }

    /**
     *
     * 制定如何绑定到父类
     *
     * */
    static install(MsuiElement) {
        MsuiElement[this._pluginName] = this;
    }

}

export default MsuiMenu;