/**
 * 文件名：msui-datagrid-column-sort
 * 版权：Copyright by nari
 * 描述：表格列排序插件
 * 修改人：Cooper
 * 修改时间：2020/5/27
 * 修改内容：
 */
import MsuiFragment from "./../msui-fragment-new";

const SORT_ITEM = '_sortItem';
const TABLE_SET_SORT_FUN_NAME = 'setSortData';

export default class MsuiDataGridColumnSort extends MsuiFragment{

    constructor( columnName ){

        super();

        this.orderValue = '';
        this.sortVisible = true;

        let {
            scopeIns: {
                methods: curMethod = {}
            }
        } = this._fragScope;

        curMethod.sortClickHandler = function(order){
            this[TABLE_SET_SORT_FUN_NAME](columnName, order, !order);
        }
    }

    getOrder() {
        return this.orderValue;
    }

    formatter(val){
        return this[SORT_ITEM].formatter(val);
    }

    setSortVisible(visible = true){
        this.sortVisible = visible;
    }

    render(){
        const dataPath = super.getDataPath(),
              methodPath = super.getMethodPath();

        return `
            <div v-show="${dataPath}.sortVisible" style="display: inline-block;">
                <span class="caret-wrapper sort-content">
                <i 
                    slot="reference"
                    class="sort-caret ascending" 
                    :class="${dataPath}.orderValue === 'asc'?'sort-highlight':''" 
                    @click="${dataPath}.orderValue = ${dataPath}.orderValue === 'asc'? '':'asc';${methodPath}_sortClickHandler(${dataPath}.orderValue)"/>
                    
                <i 
                    slot="reference" 
                    class="sort-caret descending" 
                    :class="${dataPath}.orderValue === 'desc'?'sort-highlight':''"
                    @click="${dataPath}.orderValue = ${dataPath}.orderValue === 'desc'? '':'desc';${methodPath}_sortClickHandler(${dataPath}.orderValue)"/>
                </span>
            </div>`;
    }

}
