import MsuiFragment from "../msui-fragment-new";
import {
    _eachObj,
    _eachObjDesc,
    _errorFactoryWithoutConstant,
    _throttleFactory
} from "../../msui-common/source/_self-util";

import {isDataGridModel} from "../msui-datagrid-model";
import {isDataGridColumnModel} from "../msui-datagrid-column-model";
import MsuiInput from "../msui-base-components/msui-input";
import MsuiSelectBox from "../msui-base-components/msui-selectbox";
import MSuiDateTimePicker from "../msui-base-components/msui-datetime-picker";
import mspResourceTree from "../../msui-useage-vue-template/mspResourceTree";
import MsuiResourceTreeInput from "../msui-base-components/msui-resourcetree-input";

const FILTER_ITEM = '_filterItem',
      TABLE_SET_FILTER_FUN_NAME = 'setFilterData',
      _err = _errorFactoryWithoutConstant('MsuiDataGridFilter'),
      throttle = _throttleFactory(250);

class MsuiDataGridFilterModel extends MsuiFragment{

    constructor(props = {}){
        super();

        const {prop, label, visible = true, ob} = props;

        this.prop = prop;
        this.label = label;
        this.visible = visible;

        Object.defineProperties(this, {

            // 订阅
            'ob': {
                value: ob,
                enumerable: false
            },

            // 过滤器类型
            'filterType': {
                value: '',
                writable: true,
                enumerable: false
            },

            // 是否是字典
            'isDict': {
                value: false,
                writable: true,
                enumerable: false
            }
        });

        this.isInput();
    }

    getValue(){
        if(this.filterType === 'dateTimePicker')
            return this[FILTER_ITEM].getFormatterVal();

        return this[FILTER_ITEM].getValue();
    }

    setValue(val = ''){
        this[FILTER_ITEM].setValue(val);
        return this;
    }

    addFilterBox(boxFragment, filterType){
        this.filterType = filterType;
        this[FILTER_ITEM] = super.addFragment(FILTER_ITEM, boxFragment);
        return this;
    }

    isInput(options = {}){

        this.filterType = 'input';

        options.size = 'mini';
        return this.addFilterBox(new MsuiInput(options), 'input');
    }

    isSelectBox(options = {}) {

        this.filterType = 'selectBox';

        options.size = 'mini';
        options.fullLine = true;
        options.immediate = true;

        const self = this;
        if(options.hasOwnProperty('loader')){

            this.isDict = true;

            if(typeof options.loader === 'string'){
                let cacheUrl = options.loader;
                options.loader = {
                    url: cacheUrl
                }
            }

            const sucList = options.loader.successList = [];

            sucList.push(function(){
                self.ob.publish('handleDictLoaded', self.prop);
                return arguments;
            });
        }

        return this.addFilterBox(new MsuiSelectBox(options), 'selectBox');
    }

    isDateTimePicker(options = {}) {

        this.filterType = 'dateTimePicker';

        options.size = 'mini';
        options.fullLine = true;

        return this.addFilterBox(new MSuiDateTimePicker(options), 'dateTimePicker');
    }

    isResourceTree(options = {}){
        this.filterType = 'resourceTree';

        // 获取资源选择树组件
        const resTreeComponent = mspResourceTree;
        if(!resTreeComponent){
            return this.isInput(options);
        }

        // 生成资源选择树控件s
        options.resTreeComponent = resTreeComponent;
        return this.addFilterBox(new MsuiResourceTreeInput(options), 'resourceTree');
    }

    getDict(val) {
        return this[FILTER_ITEM] && this[FILTER_ITEM].formatter ? this[FILTER_ITEM].formatter(val) : val;
    }

    render(idx, parPath){

        const dataPath = super.getDataPath();

        return `
            <el-col v-show="!${parPath}.isExpanded ? ${dataPath}.idx < 2 && ${dataPath}.visible : ${dataPath}.visible" :span="12" style="padding: 0 12px 0 12px;">
                 <el-form-item label="${this.label}">
                    ${this[FILTER_ITEM].render()}
                 </el-form-item>
            </el-col>
        `;;
    }
}

/**
 * @name MsuiDataGridFilter 表格新过滤器
 * @date 2021年11月8日
 * @author 沈强
 * **/
export default class MsuiDataGridFilter extends MsuiFragment{

    /**
     *
     * new MsuiDataGridFilter({
     *     key1: 'name1',
     *     key2: 'name2',
     *     key3: 'name3'
     * })
     *
     * new MsuiDataGridFilter(new MsuiDataGridModel())
     *
     * **/
    constructor(model = {}, ob){
        super();

        if(!model && !_.isPlainObject(model) && !isDataGridModel(model)){
            _err('未找到合适的模型数据，请确认传入的参数为：Object || MsuiDataGridModel');
        }

        let {
            scopeIns: {
                methods: curMethod = {}
            }
        } = this._fragScope;

        this.isExpanded = false;
        this._options = [];

        const constrIns = this;

        const clearSearch = function(){
            constrIns._eachModel((name, item) => {
                item.setValue('');
            });
            this.allFieldParam = '';
        };

        /** 切换 展开/收缩 **/
        curMethod.toggleExpand = function(){
            constrIns.isExpanded = !constrIns.isExpanded;
        };

        /** 查询 **/
        curMethod.querySearch = function(){

            let searchParams = {};

            if(constrIns.isExpanded){
                constrIns._eachModel((name, item) => {
                    if(constrIns.isExpanded){
                        const val = item.getValue();
                        if(val !== '' && val != null && val !== void 0){
                            searchParams[name] = val;
                        }
                    }
                });
            }

            // searchParams.allFieldParam = !constrIns.isExpanded ? this.allFieldParam : '';
            this[TABLE_SET_FILTER_FUN_NAME](searchParams, !constrIns.isExpanded);
        };

        /** 重置 **/
        curMethod.clearSearch = clearSearch;

        // 生成表格模型
        if(isDataGridModel(model)){
            this.createByGridModel(model, ob);
        }
        else{
            this.createByObject(model, ob);
        }

        // 添加订阅
        if(ob){
            this.setObserver(ob);
        }
    }

    setObserver(ob){
        let cacheLoadedDictArr = [];
        ob.subscribe('handleDictLoaded', (prop) => {
            cacheLoadedDictArr.push(prop);
            // 刷新表格
            if(cacheLoadedDictArr.length === this._getDictModel().length){
                ob.publish('refreshTable');
            }
        });
    }

    _getDictModel(){
        let loadModelArr = [];
        _eachObj(this, (name, item) => {
            if(item instanceof MsuiDataGridFilterModel
                && item.filterType === 'selectBox'
                && item.isDict){
                loadModelArr.push(item.prop);
            }
        });
        return loadModelArr;
    }

    _eachModel(cb){
        _eachObj(this, (name, item) => {
            if(item instanceof MsuiDataGridFilterModel && item.visible){
                cb(name, item);
            }
        });
    }

    /**
     * 根据普通对象生成过滤模型
     * **/
    createByObject(model, ob){

        const errFields = [];

        _eachObjDesc(model, (prop, label) => {
            if(typeof prop === 'string' && prop !== ''){

                const field = this[prop] = new MsuiDataGridFilterModel({
                    prop,
                    label,
                    ob
                });

                if(this._options.indexOf(prop) === -1){
                    this._options.push(prop);
                }

                super.addFragment(prop, field);

            }else{
                errFields.push(prop);
            }
        });

        if(errFields.length > 0){
            _err(`${errFields.toString()}字段无法生成对应的模型！`);
        }
    }

    /**
     * 根据 MsuiDataModel 生成过滤模型
     * **/
    createByGridModel(model, ob){

        _eachObjDesc(model, (prop, columnModel) => {

            // 不能是主键且是业务字段
            if(isDataGridColumnModel(columnModel)
                && !columnModel.getPrimaryKey()
                && columnModel.isBusinessField()){

                const {hasFilter, filterType, filterOptions} = columnModel.getFilterInfo();

                // hasFilter 为 true，或者hasFilter 为 false 但是具有filterType（针对需要formatter但并不需要在过滤框中显示的列）
                if(hasFilter || (!hasFilter && filterType)){

                    const field = this[prop] = new MsuiDataGridFilterModel({
                        prop,
                        label: columnModel.getLabel(),
                        visible: hasFilter,
                        ob
                    });

                    // isInput
                    if(!field[filterType]){
                        field.isInput();
                    }

                    // 其他类型
                    else{
                        field[filterType](filterOptions);
                    }

                    if(this._options.indexOf(prop) === -1){
                        this._options.push(prop);
                    }

                    super.addFragment(prop, field);
                }
            }
        });
    }

    render(searchInputText) {

        const dataPath = super.getDataPath(),
              methodPath = super.getMethodPath();

        return `
            <el-row class="msui-datagrid-filter" @keyup.enter.native="${methodPath}_querySearch">
                
                <div class="msui-datagrid-filter-container">
                
                    <el-form v-show="!${dataPath}.isExpanded" @submit.native.prevent label-position="left" :model="${dataPath}" label-width="80px" size="small">
                        <el-col :span="16" style="padding: 0 12px 0 12px;">
                             <el-form-item label="模糊查询">
                                <el-input clearable size="small" v-model="allFieldParam"
                                      placeholder="${searchInputText}"
                                  >
                                </el-input>
                             </el-form-item>
                        </el-col>
                    </el-form>
                
                    <el-form v-if="${dataPath}._options.length > 0" v-show="${dataPath}.isExpanded" :model="${dataPath}" label-width="120px" size="small">
                        ${
                            this._options.map( (cur, idx) => this[cur].render(idx, dataPath) ).join('\n')
                        }
                    </el-form>
                    
                </div>
                
                <el-col class="datagrid-filter-btn-container" :span="${dataPath}.isExpanded ? 24 : 8">
                    <div class="datagrid-filter-btn-group" :class="{'notExpand': !${dataPath}.isExpanded}">
                        <el-button @click="${methodPath}_querySearch" type="primary" size="mini" icon="el-icon-search">查询</el-button>
                       <el-button @click="${methodPath}_clearSearch" size="mini" icon="el-icon-refresh-right">重置</el-button>
                       <el-button v-if="${dataPath}._options.length > 0" @click="${methodPath}_toggleExpand" size="mini" type="text">{{ ${dataPath}.isExpanded ? '收缩' : '展开' }}</el-button>
                    </div>
                </el-col>
                
            </el-row>
        `;
    }
}
