import MsuiFragment from "./msui-fragment-new";
import {MSUI_DATAGRID_COLUMN_MODEL_CONSTANT} from "../msui-common/source/msui-constant";

const FILTER_KEY = MSUI_DATAGRID_COLUMN_MODEL_CONSTANT.FILTER_KEY;
const SORT_KEY = MSUI_DATAGRID_COLUMN_MODEL_CONSTANT.SORT_KEY;

const isDataGridColumnModel = function(data){
    return data instanceof MsuiDataGridColumnModel;
};

export { isDataGridColumnModel }

export default class MsuiDataGridColumnModel extends MsuiFragment{
    constructor({
                    primaryKey = false,
                    prop = '',
                    type = '',
                    label = '',
                    width = '',
                    minWidth = '',
                    fixed = false,
                    align = 'center',
                    resizable = true,
                    formatter = null,
                    labelClassName = '',
                    hasSortAndSearch = true,
                    operationBtn = null,
                    expandView = null,
                    showOverflowTooltip = true,
                    clickFun = null,
                    mouseOver = null,
                    extFragment = [],
                    isBusinessField = true
                } = {}) {

        super();

        Object.defineProperty(this, '_options', {
            value: {
                primaryKey,
                prop,
                label,
                width,
                minWidth,
                fixed,
                resizable,
                formatter,
                align,
                type,
                hasSort: false,
                hasFilter: false,
                currentFilterVisibleStatus: false,
                globalSearch: false,
                labelClassName,
                hasSortAndSearch,
                operationBtn,
                showOverflowTooltip,
                clickFun,
                mouseOver,
                extFragment,
                isBusinessField
            },
            enumerable: false
        });

        this.columnWidth = width;
        this.showItem = !primaryKey;

        this.orderValue = '';
        this.sortVisible = true;

        this[FILTER_KEY] = null;

        if (expandView) {
            this.expandView = expandView;
        }

        // 添加过滤,排序
        this.hasSortAndSearch(hasSortAndSearch);

        //扩展碎片集成
        if (extFragment) {
            extFragment.forEach((item, index) => {
                let _fragmentName = 'extFragment_' + index;
                super.addFragment(_fragmentName, item);
                this[_fragmentName] = item;
            })
        }
    }

    get(fieldName){
        return this._options.hasOwnProperty(fieldName) ? this._options[fieldName] : null;
    }

    show(show = true) {
        this.showItem = show;
        return this;
    }

    isPrimaryKey() {

        this._options.primaryKey = true;
        this.showItem = false;

        this.hasSortAndSearch(false);

        return this;
    }

    getPrimaryKey(){
        return this._options.primaryKey;
    }

    bindClickFun(func){
        if(_.isFunction(func)){
            this._options.clickFun = func;
        }
        return this;
    }

    bindMouseOver(func){
        if(_.isFunction(func)){
            this._options.mouseOver = func;
        }
        return this;
    }

    label(label) {
        this._options.label = label;
        return this;
    }

    width(width) {
        this._options.width = width;
        this.columnWidth = width;
        return this;
    }

    incrWidth(incr){
        this.columnWidth = this._options.width + incr;
    }

    minWidth(minWidth) {
        this._options.minWidth = minWidth;
        return this;
    }

    align(align) {
        this._options.align = align;
        return this;
    }

    resizable(resizable = true) {
        this._options.resizable = resizable;
    }

    formatter(formatter = true) {
        this._options.formatter = formatter;
        return this;
    }

    getLabel(){
        return this._options.label;
    }

    getProp(){
        return this._options.prop;
    }

    hasSortAndSearch(hasSortAndSearch = true) {

        this.hasSort(hasSortAndSearch);
        this.hasSearch(hasSortAndSearch);

        return this;
    }

    hasSort(sortVisible = true) {

        this._options.hasSort = sortVisible;
        this.sortVisible = sortVisible;

        return this;
    }

    /**
     * 过滤器的显示、隐藏 相对于 排序 比较特殊
     * 过滤器因为并不是配置了就能显示，所以这里的配置，是告诉过滤器开关，当前这个列是否允许开关过滤器
     * **/
    hasSearch(filterVisible = true, global = filterVisible) {

        this._options.hasFilter = filterVisible;
        this._options.globalSearch = global;

        return this;
    }


    /**
     * 是否为业务字段
     * **/
    isBusinessField(){
        return this._options.isBusinessField;
    }

    /**
     * 获取过滤器信息
     * **/
    getFilterInfo(){
        return {
            hasFilter: this._options.hasFilter,
            filterType: this._options.filterType,
            filterOptions: this._options.filterOptions
        }
    }

    isSelectBox(options = {}) {
        this._options.filterType = 'isSelectBox';
        this._options.filterOptions = options;
        return this;
    }

    isResourceTree(options = {}){
        this._options.filterType = 'isResourceTree';
        this._options.filterOptions = options;
        return this;
    }

    isDateTimePicker(options = {}) {
        this._options.filterType = 'isDateTimePicker';
        this._options.filterOptions = options;
        return this;
    }

    isBreakLine() {
        this._options.showOverflowTooltip = false;
    }

    getSearch() {
        return this._options.currentFilterVisibleStatus;
    }

    getGlobalSearch() {
        return this._options.globalSearch;
    }

    getDict(val) {
        return this[FILTER_KEY] ? this[FILTER_KEY].formatter(val) : val;
    }

    getOrder() {
        return this._options.hasSort ? this[SORT_KEY].getOrder() : '';
    }

    getFilterValue() {
        return this._options.hasFilter ? this[FILTER_KEY].getFilterValue() : '';
    }

    render() {}

    static selection() {
        return new MsuiDataGridColumnModel({type: 'selection', prop: 'selection', label: '全选', hasSortAndSearch: false, resizable: true, isBusinessField: false});
    }

    static index() {
        return new MsuiDataGridColumnModel({type: 'index', prop: 'index', label: '序号', hasSortAndSearch: false, isBusinessField: false});
    }

    static expand(expandView) {
        return new MsuiDataGridColumnModel({
            type: 'expand',
            prop: 'expand',
            label: '展开',
            hasSortAndSearch: false,
            isBusinessField: false,
            expandView: expandView
        });
    }

    /**
     * 生成操作按钮列
     * @param inlineButtons {[
     *     {
     *         icon: String,
     *         text: String,
     *         handler: Function(row):void
     *     }
     * ]}
     * @param fixed
     * **/
    static operation(inlineButtons = [], fixed, operationExtFragment = []) {
        let width = 73;
        if (inlineButtons.length === 1) {
            width = 73
        } else {
            width = !_.isEmpty(inlineButtons) ? (inlineButtons.length * 30) + 23 : 73;
        }
        // let width = !_.isEmpty(inlineButtons)  ? (inlineButtons.length * 35) + ((inlineButtons.length - 1) * 3) : 50;
        return new MsuiDataGridColumnModel({
            prop: 'opt',
            width: width,
            type: 'opt',
            label: '操作',
            align: 'left',
            fixed: fixed === 'left' ? fixed : fixed === '' ? fixed : 'right',
            hasSortAndSearch: false,
            operationBtn: inlineButtons,
            showOverflowTooltip: false,
            isBusinessField: false,
            extFragment: operationExtFragment
        });
    }
}
