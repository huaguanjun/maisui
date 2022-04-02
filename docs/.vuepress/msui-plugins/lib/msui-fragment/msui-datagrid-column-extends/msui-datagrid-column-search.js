/**
 * 文件名：msui-datagrid-column-filter
 * 版权：Copyright by nari
 * 描述：表格列头过滤数据 插件
 * 修改人：
 * 修改时间：2020/5/27
 * 修改内容：
 *
 * TODO: 该方案为旧版表格方案，目前已经废弃（2021年11月8日）
 *
 *
 */
import MsuiFragment from "./../msui-fragment-new";
import MsuiSelectBox from "./../msui-base-components/msui-selectbox";
import MSuiDateTimePicker from "./../msui-base-components/msui-datetime-picker";
import MsuiInput from "./../msui-base-components/msui-input";
import {_throttleFactory} from "../../msui-common/source/_self-util";

const FILTER_ITEM = '_filterItem',
    TABLE_SET_FILTER_FUN_NAME = 'setFilterData',
    ITEM_TYPE = {
        INPUT: 'input',
        SELECT_BOX: 'selectBox',
        TIME_PICK: 'timePick'
    };

// 节流器
const throttle = _throttleFactory(700);

export default class MsuiDataGridColumnFilter extends MsuiFragment{

    constructor( columnName ){

        super();

        this.filterVisible = false;

        Object.defineProperties(this, {
            // 过滤器类型
            'filterType': {
                value: '',
                writable: true,
                enumerable: false
            },
            // 过滤器内容变化监听
            'filterChangeHandler': {
                value(filterVal){
                    this[TABLE_SET_FILTER_FUN_NAME](columnName, filterVal, (filterVal === '' || filterVal == null));
                },
                enumerable: false
            }
        });

        this.isInput();
    }


    getFilterValue() {
        const filterItem = this[FILTER_ITEM];
        return filterItem
            ? filterItem.getValue ? filterItem.getValue() : filterItem.value : '';
    }

    addFilterBox(boxFragment, filterType){
        this.filterType = filterType;
        this[FILTER_ITEM] = super.addFragment(FILTER_ITEM, boxFragment);
        return this;
    }

    isInput(options = {}){

        const filterChangeHandler = this.filterChangeHandler;

        options.size = 'mini';
        options.inputHandler = function(val){throttle(filterChangeHandler, this, val)};

        return this.addFilterBox(new MsuiInput(options), ITEM_TYPE.INPUT);
    }

    isSelectBox(options = {}) {

        options.size = 'mini';
        options.changeHandler = this.filterChangeHandler;

        return this.addFilterBox(new MsuiSelectBox(options), ITEM_TYPE.SELECT_BOX);
    }

    isDateTimePicker(options = {}) {

        options.size = 'mini';
        options.changeHandler = this.filterChangeHandler;

        return this.addFilterBox(new MSuiDateTimePicker(options), ITEM_TYPE.TIME_PICK);
    }

    formatter(val){
        return this[FILTER_ITEM].formatter instanceof Function ? this[FILTER_ITEM].formatter(val) : val;
    }

    setFilterVisible(filterVisible){
        this.filterVisible = filterVisible;
    }

    render(){
        const dataPath = super.getDataPath();

        return `
            <div v-show="${dataPath}.filterVisible">
                ${this[FILTER_ITEM] ? this[FILTER_ITEM].render() : ''}
            </div>
            `;
    }

}
