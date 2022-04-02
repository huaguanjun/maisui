import MsuiFragment from "./msui-fragment-new";
import MsuiDataGridColumnModel from './msui-datagrid-column-model';
import {_eachObj,_eachObjDesc , _errorFactory, _warningFactory} from "../msui-common/source/_self-util";
import {
    MSUI_DATAGRID_MODEL_CONSTANT,
    MSUI_DATAGRID_CONSTANT
} from "../msui-common/source/msui-constant";

const _error = _errorFactory(MSUI_DATAGRID_MODEL_CONSTANT),
      _warning = _warningFactory(MSUI_DATAGRID_MODEL_CONSTANT);

const TABLE_SET_SORT_FUN_NAME = 'setSortData';

const isDataGridModel = function(data){
    return data instanceof MsuiDataGridModel;
};

export {
    isDataGridModel
}

export default class MsuiDataGridModel extends MsuiFragment {

    constructor(msuiModelTemplate) {
        super();

        this.ob = null;
        this._options = [];


        Object.defineProperty(this, '_originColumns', {
            value: [],
            enumerable: false
        });

        let {
            scopeIns: {
                methods: curMethod = {}
            }
        } = this._fragScope;

        curMethod.needFormatter = function(formatter){
            return formatter === true || formatter instanceof Function;
        };

        curMethod.sortClickHandler = function(order, columnName){
            this[TABLE_SET_SORT_FUN_NAME](columnName, order, !order);
        };

        if (msuiModelTemplate && this) {

            let model = msuiModelTemplate._options;

            _eachObj(model, (key, val) => {
                let curColumnModel = new MsuiDataGridColumnModel({prop: key, label: val});

                this[key] = curColumnModel;
                this._options.push(key);
                super.addFragment(key, curColumnModel);
            });
        } else
            _error('NO_SUCH_MODELS');
    }

    setObserver(ob){
        this.ob = ob;

        ob.subscribe('set-column-config-key', (sortKey, displayKey) => {
            this.sortKey = sortKey;
            this.displayKey = displayKey;
        });
    }

    each(callback){
        if(callback instanceof Function){
            _eachObj(this, (prop, item) => {
                if(item instanceof MsuiDataGridColumnModel){
                    callback(prop, item);
                }
            });
        }
    }

    add(item){
        if(item instanceof Object
            && item.hasOwnProperty('prop') && item.hasOwnProperty('label')){

            let curColumnModel = new MsuiDataGridColumnModel(item);

            this[item.prop] = curColumnModel;
            this._options.push(item.prop);
            super.addFragment(item.prop, curColumnModel);

        }
    }

    addItemModel(itemName, item) {
        if (itemName && (item instanceof MsuiDataGridColumnModel)) {
            if (this[itemName]) {
                return false;
            }
            this[itemName] = item;
            this._options.push(itemName);
            super.addFragment(itemName, item);
        }
        return true;
    }

    /**
     * 合并表格模型
     *
     * @param originModel { MsuiFormModel } 需要合并的表格模型
     * @param extendModels { Array<MsuiFormModel> } 被合并的表格模型
     *
     * **/
    static mergeGridModels(originModel, extendModels = []) {
        if (!originModel instanceof MsuiDataGridModel)
            return _error('UNKNOWN_ORIGIN_MODEL_ERROR');

        extendModels.forEach(model => {
            if (model instanceof MsuiDataGridModel) {
                _eachObj(model, (itemName, item) => {
                    if (!originModel.addItemModel(itemName, item)) {
                        return _warning(['ALREADY_EXISTS_ITEM_NAME',':',itemName]);
                    }
                });
            }
        });

        return originModel;
    }

    getPrimaryColumn() {
        return this._options.filter(cur => this[cur].getPrimaryKey())
    }

    // 添加操作按钮列
    addOperationColumn(inlineButtons, fixed, opreationExtFragment) {
        let opt = MsuiDataGridColumnModel.operation(inlineButtons, fixed, opreationExtFragment);

        this.opt = opt;
        super.addFragment('opt', opt);
        // this._options.push('opt');
    }

    // 添加选择项列
    addSelectionColumn() {
        let selection = MsuiDataGridColumnModel.selection();

        this.selection = selection;
        super.addFragment('selection', selection);
        // this._options.unshift('selection');
    }

    // 添加索引列
    addIndexColumn() {
        let index = MsuiDataGridColumnModel.index();

        this.indexColumn = index;
        super.addFragment('indexColumn', index);
        // this._options.unshift('indexColumn');
    }

    //添加行展开
    addExpandColumn(expandView) {
        let expand = MsuiDataGridColumnModel.expand(expandView);

        this.expandColumn = expand;
        super.addFragment('expandColumn', expand);
        // this._options.unshift('expandColumn');
    }


    hasSortAndSearch(hasSortAndSearch) {
        _eachObj(this, (columnName, column) => {
            if(column instanceof MsuiDataGridColumnModel){
                column.hasSortAndSearch(hasSortAndSearch);
            }
        });
        return this;
    }

    hasSort(sort) {
        _eachObj(this, (columnName, column) => {
            if(column instanceof MsuiDataGridColumnModel){
                column.hasSort(sort);
            }
        });
        return this;
    }

    hasSearch(search,global) {
        _eachObj(this, (columnName, column) => {
            if(column instanceof MsuiDataGridColumnModel) {
                column.hasSearch(search, global);
            }
        });
        return this;
    }

    getSearchColumnsLabel() {
        let searchColumns = [];

        //顺序转换
        _eachObjDesc(this,(itemName,item) => {
            if(item.hasOwnProperty('getGlobalSearch') && item.getGlobalSearch()){
                searchColumns.push(item);
            }
        });

        return searchColumns.map( column => {
            return column.getLabel();
        }).join(',');
    }

    /**
     * 渲染 排序功能
     * **/
    _renderSort(dataPath, methodPath){
        return `
            <div v-show="${dataPath}.sortVisible" style="display: inline-block;">
                <span class="caret-wrapper sort-content">
                <i 
                    slot="reference"
                    class="sort-caret ascending" 
                    :class="${dataPath}.orderValue === 'asc'?'sort-highlight':''" 
                    @click="${dataPath}.orderValue = ${dataPath}.orderValue === 'asc'? '':'asc';${methodPath}_sortClickHandler(${dataPath}.orderValue, ${dataPath}._options.prop)"/>
                    
                <i 
                    slot="reference" 
                    class="sort-caret descending" 
                    :class="${dataPath}.orderValue === 'desc'?'sort-highlight':''"
                    @click="${dataPath}.orderValue = ${dataPath}.orderValue === 'desc'? '':'desc';${methodPath}_sortClickHandler(${dataPath}.orderValue, ${dataPath}._options.prop)"/>
                </span>
            </div>`;
    }

    _renderExpandColumn(){

        const expandColumn = this.expandColumn;

        if(!expandColumn)
            return '';

        const dataPath = super.getDataPath();
        const {prop} = expandColumn._options;

        return `
            <el-table-column
                prop="${prop}"
                type="expand"
            >
            
                ${expandColumn.expandView ? `
                    <template slot-scope="{row}">
                       <component :is="${dataPath}.expandColumn.expandView" :data="row"></component>
                    </template>` : '' }
            
            </el-table-column>
        `
    }

    /**
     * 渲染索引列
     * **/
    _renderIndexColumn(){
        const indexColumn = this.indexColumn;
        if(!indexColumn)
            return '';

        const {prop, label} = indexColumn._options;

        return `
            <el-table-column
                prop="${prop}"
                label="${label}"
                type="index"
            >
            </el-table-column>
        `
    }

    /**
     * 渲染选择列
     * **/
    _renderSelectionColumn(){
        const selectionColumn = this.selection;
        if(!selectionColumn)
            return '';

        return `
            <el-table-column
                prop="${selectionColumn._options.prop}"
                label="${selectionColumn._options.label}"
                type="selection"
            >
            </el-table-column>
        `
    }

    /**
     * 渲染操作列
     * **/
    _renderOperationColumn(){

        if(!this.opt){
            return '';
        }

        const operColumn = this.opt,
             {prop, label, width, fixed, extFragment, operationBtn} = operColumn._options;

        if(!operColumn)
            return '';

        return `
            <!-- 冻结会导致展开组件渲染两次的BUG -->
            <el-table-column
                prop="${prop}"
                label="${label}"
                type="opt"
                align="left"
                :width="${width}"
                ${this.expandColumn? '' : `fixed="${fixed}"`}
            >

                <template slot="header" slot-scope="scope">
                    <span>${label}</span>
                    ${extFragment.length > 0 ? `
                        ${this._renderExtFragment(extFragment)}
                    ` : ``}
                </template>
            
                ${operationBtn ? `
                <template slot-scope="scope">
                    <div class="inline-button-content" >
                        ${this._getOperButton(operationBtn)}
                        ${this._renderDynamicButton()}
                    </div>
                </template>
                ` : ``}
            
            </el-table-column>
        `
    }

    /**
     * 组装操作按钮
     * **/
    _getOperButton(operationBtn) {

        const methodPath = super.getMethodPath(),
              prefix = 'inlineBtn', suffixClick = '_click', suffixShow = '_show';

        let {
            scopeIns: {
                methods: scopeMethods
            }
        } = this._fragScope;

        return `${operationBtn.map(({icon, text, clickHandler, visible}, index) => {
            const handlerKey = prefix + index + suffixClick,
                  showKey = prefix + index + suffixShow;

            if (_.isFunction(clickHandler)) {
                scopeMethods[handlerKey] = clickHandler;
                if (_.isFunction(visible))
                    scopeMethods[showKey] = visible;
                return `<i ${visible ? `v-show="${methodPath}_${showKey}(scope.row, scope.$index)"` : ''} @click.stop="${methodPath}_${handlerKey}(scope.$index, scope.row)" class="${icon} msui-datagrid-icon" title="${text}" />`
                // return `<el-button ${visible ? `v-show="${methodPath}_${showKey}(scope.row, scope.$index)"` : ''} @click.stop="${methodPath}_${handlerKey}(scope.$index, scope.row)" size="mini" icon="${icon}" title="${text}" />`
            } else {
                return '';
            }
        }).join('')}`;
    }

    /**
     * 渲染从行里传来的动态表单
     * **/
    _renderDynamicButton(){

        const {
            DATA_KEY,
            ICON,
            NAME
        } = MSUI_DATAGRID_CONSTANT.EXT_BTN_ATTR;

        let html =`
            <span v-if="renderDynamicButton(scope.row.${DATA_KEY})">
                <i 
                    v-for="(item,i) in scope.row.${DATA_KEY}"
                    v-bind:class="item.${ICON}"
                    class="msui-datagrid-icon"
                    :title="item.${NAME}"
                    @click.stop="dynamicButtonClickHandler(scope.row, scope.row.${DATA_KEY}[i])"
                ></i>
            </span>
        `;
        return html;
    }

    /**
     * 渲染 其他挂载的组件
     * **/
    _renderExtFragment(extFragments) {
        let html = '<div class="extdiv" style="display: inline-flex">';

        if (extFragments.length > 0) {
            extFragments.forEach((item, index) => {
                html += item.render();
            })
        }

        html += '</div>';
        return html;
    }

    /**
     * 对列进行排序
     * **/
    orderColumns(ordered){
        if(ordered instanceof Array){
            this._options.sort((a, b) => {
                return ordered.indexOf(a) - ordered.indexOf(b);
            });
        }
    }

    /**
     * 获取原始的列配置信息
     * **/
    getOriginColumnsConfig(){
        if(this._originColumns.length === 0){
            _eachObjDesc(this, (itemName, item) => {
                //过滤主建/操作/全选/序号
                if(item instanceof MsuiDataGridColumnModel
                    && !item._options.primaryKey
                    && item._options.type === ''){

                    this._originColumns.push({
                        label: item._options.label,
                        showItem: item.showItem,
                        name: item._options.prop,
                    })
                }
            });
        }
        return _.cloneDeep(this._originColumns);
    }

    /** 行为代理 **/
    render() {

        // 获取原始的配置信息
        this.getOriginColumnsConfig();

        // 从缓存中获取排序信息
        const sortFields = JSON.parse(localStorage.getItem(this.sortKey));
        if(sortFields instanceof Array){
            this.orderColumns(sortFields);
        }

        // 从缓存中获取隐藏/显示信息
        const displayFields = JSON.parse(localStorage.getItem(this.displayKey));
        if(displayFields instanceof Array){
            displayFields.forEach( ({name, showItem}) => {
                if(this[name] instanceof MsuiDataGridColumnModel
                    && this[name].showItem !== showItem){
                    this[name].showItem = showItem;
                }
            });
        }

        let fontSize = 12;
        let dataPath = super.getDataPath(),
            curDataPath = `${dataPath}[model]`,
            curOptDataPath = `${curDataPath}._options`;

        let methodPath = super.getMethodPath();

        return `
            
            <!-- 渲染展开列 -->
            ${this._renderExpandColumn()}
            
            <!-- 渲染索引列 -->
            ${this._renderIndexColumn()}
            
            <!-- 渲染选择列 -->
            ${this._renderSelectionColumn()}

            <template v-for="model in ${dataPath}._options">

                <el-table-column
                    v-if="${curDataPath}.showItem"
                    :key="${curOptDataPath}.prop"
                    :prop="${curOptDataPath}.prop"
                    :label="${curOptDataPath}.label"
                    :width="${curDataPath}.columnWidth"
                    :min-width="(${curOptDataPath}.prop.length + 2) * ${fontSize}"
                    :align="${curOptDataPath}.align"
                    :resizable="false"
                    :type="${curOptDataPath}.type || ''"
                    :fixed="${curOptDataPath}.fixed"
                >
                
                    <template slot="header" slot-scope="scope">
                        <div 
                            class="cell-child" 
                            style="line-height: 23px;cursor: pointer;"
                        >
                            <span>{{ ${curOptDataPath}.label }}</span>
                            <template v-if="${curOptDataPath}.hasSort">
                                ${this._renderSort(curDataPath, methodPath)}
                            </template>
                        </div>
                    </template>
                    
                    <!-- 渲染列文字 -->
                    <template v-if="${curOptDataPath}.type === ''" slot-scope="{row}">
                            <template v-if="${methodPath}_needFormatter(${curOptDataPath}.formatter)">
                                <div
                                    v-html="_columnFormatter(${curOptDataPath}.prop, row)"
                                    :class="{'click-cell-content': ${curOptDataPath}.clickFun}"
                                    style="white-space: nowrap; overflow: hidden;text-overflow: ellipsis"
                                    @click="cellClickFunction(${curOptDataPath}.prop, row)"></div>
                            </template>
                            <template v-else>
                                <div
                                    :class="{'click-cell-content': ${curOptDataPath}.clickFun}"
                                    style="white-space: nowrap; overflow: hidden;text-overflow: ellipsis"
                                    @click="cellClickFunction(${curOptDataPath}.prop, row)">{{ row[${curOptDataPath}.prop] }}</div>
                            </template>                   
                    </template>
                    
                </el-table-column>
            </template>
            
            <!-- 渲染操作列 -->
            ${this._renderOperationColumn()}
        `;
    }
}
