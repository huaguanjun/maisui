/**
 * 文件名：msui-datagrid-column-list-filter
 * 版权：Copyright by nari
 * 描述：表格过滤功能，开关控制
 * 修改人：Cooper
 * 修改时间：2020/5/27
 *
 * TODO: 由于表格过滤器整改，该类暂时没有任何引用（2021年11月8日）
 *
 */
import MsuiFragment from "../msui-fragment-new";

export default class MsuiDatagridColumnListFilter extends MsuiFragment {

    constructor({filterHandler = null} = {}) {
        super();

        this.filterVisible = false;

        let {
            scopeIns: {
                methods: curMethod = {}
            }
        } = this._fragScope;

        const self = this;

        //保存列配置
        curMethod.filterHandler = () => {
            //确定按钮回调函数
            if (_.isFunction(filterHandler)) {
                self.filterVisible = !self.filterVisible;
                filterHandler(self.filterVisible);
            }
        }
    }

    render() {
        const dataPath = super.getDataPath(),
            methodPath = super.getMethodPath();

        let template = `
            <div>
                 <i slot="reference" 
                    class = "datagrid-filter-icon icon-filter "
                    :class="${dataPath}.filterVisible === true ?'on':''"
                    @click="${methodPath}_filterHandler()" />
            </div>`;

        return super.render(template);
    }
}
