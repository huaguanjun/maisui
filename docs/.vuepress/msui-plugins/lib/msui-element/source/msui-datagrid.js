import _ from 'lodash'
import MsuiElement from "./msui-element";
import MsuiPagination from '../../msui-fragment/msui-base-components/msui-pagination'
import MsuiDataGridModel from '../../msui-fragment/msui-datagrid-model'
import {MSUI_DATAGRID_CONSTANT} from "../../msui-common/source/msui-constant";
import MsuiButton from "../../msui-fragment/msui-base-components/msui-button";
import {
    _addAxiosReturnIns,
    _eachObj,
    _error,
    _throttleFactory,
    _throttleFunc
} from "../../msui-common/source/_self-util";
import MsuiNotify from '../../msui-util/source/msui-notify'
import MsuiDatagridColumnListConfig
    from '../../msui-fragment/msui-datagrid-column-extends/msui-datagrid-column-list-config'
import MsuiOpenComponentsUtil from "../../msui-util/source/msui-opencomponent-util"
import MsuiRouteManager from "../../msui-util/source/msui-route-manager"
import MsuiStore from "../../msui-common/source/msui-store"
import MsuiDropdown from "../../msui-fragment/msui-base-components/msui-dropdown"
import MsuiInterval from "../../msui-util/source/msui-interval";
import MsuiUpload from "../../msui-fragment/msui-base-components/msui-upload";
import MsuiObserver from '../../msui-common/source/msui-observer'
import MsuiDataGridModularProxy from "../../msui-fragment/msui-datagrid-column-extends/msui-datagrid-modular-proxy";
import MsuiDataGridFilter from "../../msui-fragment/msui-datagrid-column-extends/msui-datagrid-filter";

const DATAMODEL_NAME = 'dataModel',
    PAGINATION_NAME = 'dgPagination',
    HEADER_HEIGHT = 39,
    FOOTER_HEIGHT = 32,
    MARGIN_HEIGHT = 10,//预留高度，防止重新渲染表格出现滚动条
    MIN_INTERVAL_TIME = 3000;

const DEFAULT_PAGE_OPTION = {
    pageSize: 10,
    pageSizes: [10, 20, 30, 40]
};

//扩展按钮默认属性
const EXT_BTN_ATTR = {
    DATA_KEY: 'optBtns',
    KEY: 'id',
    NAME: 'name',
    ICON: 'icon',
    OPEN_TYPE: 'linkOpenType',
    URL: 'linkUrl',
    CONTENT_TITLE: 'linkTitle',
    SORT: 'pos',
    DISIABLE: 'rwFlag'
};

// 节流器
const throttle = _throttleFactory(700);

/**
 * 计算表格高度
 * **/
// const calcuGridHeight = function () {
//     const pluginConfig = this.msui_plugin_config;
//     let height = 0;
//
//     if (!_.isEmpty(pluginConfig.globalButtons) || pluginConfig.showSearchInput) {
//         height += HEADER_HEIGHT
//     }
//
//     if (pluginConfig.hasPagination) {
//         height += FOOTER_HEIGHT;
//     }
//     return height + MARGIN_HEIGHT;
// };

/**
 * 添加按钮
 * **/
const addButtons = function (key, btn) {
    let btnIns;
    btn.size = 'mini';

    if((btn instanceof MsuiButton) || (btn instanceof MsuiDropdown)){
        btnIns = btn;
    }else if(_.isObject(btn)){
        switch (btn.type) {
            case 'dropdown': btnIns = new MsuiDropdown(btn); break;
            case 'upload': btnIns = new MsuiUpload(btn); break;
            default: btnIns = new MsuiButton(btn);
        }

        // btnIns = btn.type === 'dropdown' ? new MsuiDropdown(btn) : new MsuiButton(btn);
    }

    if (btnIns) {
        this.addFragment(key, btnIns);
        return btnIns.render();
    }
    return '';
};

/**
 * 开启、关闭 定时器 实现
 * **/
const _toggleInterval = function (open = false) {
    if (this.interval) {
        if (!open){
            this.interval.close();
        }
        else {
            this.interval.open();
        }
    }
};

const _formatQueryParams = function (sortAndSearch, filterRules) {

    const formatParams = {};

    // 格式化排序与过滤
    formatParams.sort = Object.keys(sortAndSearch).join(',');
    formatParams.order = Object.values(sortAndSearch).join(',');

    // 格式化过滤条件
    formatParams.filterRules = JSON.stringify(Object.values(filterRules));

    return formatParams;
};

class MsuiDataGrid extends MsuiElement {

    static _pluginName = 'MsuiDataGrid';

    constructor({
                    loader = '',
                    dataModel = {},

                    showFilter = true,
                    extFilter = null,

                    showColumnConfig = true,//列过滤功能是否启用
                    showOptColumn = true,//展示操作列
                    optColumnFixed = true,//操作列固定，默认右侧，可设置'left'/'right'/true/false

                    openInnerCallback = null,//扩展按钮点击回调函数[inner方式]
                    extBtnAttr = null, //扩展按钮属性

                    interval,

                    showSearchInput = true,
                    searchInputText = '',
                    hasPagination = true,
                    hasSelection = true,
                    hasIndex = true,

                    modularProxy = false,

                    stripe = true,
                    border = true,
                    fit = true,
                    showHeader = true,
                    emptyText = ' ',
                    selectFun = null,
                    selectAllFun = null,
                    selectChangeFun = null,
                    rowClickFun = null,
                    rowDbClickFun = null,
                    onExpandChangeFun=null,
                    cellMouseEnter=null,
                    cellMouseLeave=null,
                    inlineButtons = [],
                    globalButtons = [],

                    cellClick = null,
                    tableRowClassName = null,
                    loading = true,

                    pageOption = {},

                    expandView = null,
                    spanMethod = null
                } = {}, customConfig = {}) {

        super();

        //合并datagrid动态按钮配置参数
        MSUI_DATAGRID_CONSTANT.EXT_BTN_ATTR = _.merge(_.cloneDeep(EXT_BTN_ATTR), extBtnAttr);

        let vueConfig = this.msui_element_config;
        let pluginConfig = this.msui_plugin_config;


        const tableSelf = this;

        // 过滤参数长度 -> 用于在翻页时，比较过滤参数是否有变动，以确定是否重置page页数
        // pluginConfig.cacheFilterLength = 0;

        // 基础参数配置
        pluginConfig.showFilter = showFilter;
        pluginConfig.extFilter = extFilter;
        pluginConfig.custom = customConfig;
        pluginConfig.hasSelection = hasSelection;
        pluginConfig.hasIndex = hasIndex;
        pluginConfig.border = border;
        pluginConfig.stripe = stripe;
        pluginConfig.emptyText = emptyText;
        pluginConfig.showHeader = showHeader;
        pluginConfig.globalButtons = globalButtons;
        pluginConfig.hasPagination = hasPagination;
        pluginConfig.searchInputText = searchInputText;
        pluginConfig.showSearchInput = showSearchInput;
        pluginConfig.loading = loading;
        //表格分页参数合并修改，pageSizes 改为覆盖默认pageSizes
        pluginConfig.pageOption = _.mergeWith({}, DEFAULT_PAGE_OPTION, pageOption,mergeFun);
        pluginConfig.expandView = expandView;

        // 固定查询参数缓存
        const sortAndOrder = pluginConfig.sortAndOrder = {};
        const filterRules = pluginConfig.filterRules = {};

        // 固定查询参数
        pluginConfig.queryParams = {
            allFieldParam: '',
            sort: '',
            order: '',
            filterRules: '',
            page: 1,
            rows: pluginConfig.pageOption.pageSize
        };

        // 缓存使用者传递的查询参数
        pluginConfig.cacheQueryParams = {};

        if (!dataModel || !(dataModel instanceof MsuiDataGridModel)) {
            return _error(MSUI_DATAGRID_CONSTANT.MODEL_NAME,
                MSUI_DATAGRID_CONSTANT.UNKNOWN_COLUMN_MODEL_ERROR);
        }

        // 初始化Observer
        const ob = this.ob = new MsuiObserver();

        // 订阅方法，refreshTable
        ob.subscribe('refreshTable', () => {
            this.$self && this.$self.datagridKey++;
        });

        dataModel.setObserver(ob);

        vueConfig.data = {
            rows: [],
            badDynamicBtnNum: 0,
            datagridKey: 1,
            MsuiDataGridVisible: true,
            dialogVisible: false,
            allFieldParam: '',
            tooltipContent: '',
            doNotCleanTooltip: false,
            _selection: [],
            loading: false,
            expandRows: []
        };

        vueConfig.watch = {
            badDynamicBtnNum(val, oldVal) {
                if (val !== oldVal) {
                    this.dynamicChangeOptColumnWidth(val);
                }
            },
            // allFieldParam(val, oldVal) {
            //     throttle(() => {
            //         if (val !== oldVal) {
            //            tableSelf.load({});
            //         }
            //     });
            // }
        };

        vueConfig.methods = {

            showTooltip: _throttleFunc(300, (cell, cellChild) => {

                const $self = this.$self;

                if($self.doNotCleanTooltip){
                    return false;
                }

                // 判断文字是否存在溢出情况
                const range = document.createRange();
                range.setStart(cellChild, 0);
                range.setEnd(cellChild, cellChild.childNodes.length);

                const {paddingLeft, paddingRight} = cellChild.style;

                const rangeWidth = range.getBoundingClientRect().width;
                const padding = (parseInt(paddingLeft, 10) || 0) + (parseInt(paddingRight, 10) || 0);

                if ((rangeWidth + padding > cellChild.offsetWidth || cellChild.scrollWidth > cellChild.offsetWidth) && $self.$refs.tooltip) {
                    const tooltip = $self.$refs.tooltip;
                    // TODO 会引起整个 Table 的重新渲染，需要优化
                    $self.tooltipContent = cell.textContent || cell.innerText;

                    tooltip.referenceElm = cell;
                    tooltip.$refs.popper && (tooltip.$refs.popper.style.display = 'none');
                    tooltip.doDestroy();
                    tooltip.setExpectedState(true);
                    tooltip.handleShowPopper();
                }
            }),

            hideTooltip: _throttleFunc(300, () => {

                const $self = this.$self;

                const tooltip = $self.$refs.tooltip;
                if (tooltip) {
                    if(!$self.doNotCleanTooltip){
                        tooltip.setExpectedState(false);
                        tooltip.handleClosePopper();
                    }
                }
            }),

            handleTooltipMouseEnter(){
                this.doNotCleanTooltip = true;
            },

            handleTooltipMouseLeave(){
                this.doNotCleanTooltip = false;
                this.hideTooltip();
            },

            /**
             * 监听鼠标移入单元格
             * **/
            handleCellMouseEnter(row, column, cell){
                const dataModelKey = column.property;

                // 判断该列是否需要显示tooltip
                if(!dataModel[dataModelKey]
                    || !dataModel[dataModelKey]._options.showOverflowTooltip){
                    return false;
                }

                this.showTooltip(cell, cell.querySelector('.cell'));
            },

            /**
             * 监听鼠标移出单元格
             * **/
            handleCellMouseLeave(){
                this.hideTooltip();
            },

            /**
             * 多选监听
             * **/
            onSelectChange(selection) {
                this._selection = selection;

                /*
                * 定时器的开关
                * * 选中数据，关闭定时器
                * * 没有选中数据，开启定时器
                * */
                _toggleInterval.call(tableSelf, !selection.length);

                if (_.isFunction(selectChangeFun)) {
                    selectChangeFun(selection);
                }
            },
            /**
             * 行展开监听
             * **/
            onExpandChange(row, expandedRows) {
                const primaryColumn = this[DATAMODEL_NAME].getPrimaryColumn();

                if (!primaryColumn.length)
                    return;

                this.expandRows = [];
                if (expandedRows.length && row) {
                    this.expandRows.push(row[primaryColumn[0]])
                }

                _toggleInterval.call(tableSelf, !expandedRows.length);

                if(_.isFunction(onExpandChangeFun)){
                    onExpandChangeFun(row, expandedRows);
                }
            },

            _columnFormatter(columnKey, row){
                const column = this[DATAMODEL_NAME][columnKey];
                if(!column || !column.showItem) return '';
                const formatter = column.get('formatter');
                if(formatter){
                    const gridFilter = tableSelf.gridFilter;
                    return formatter instanceof Function ? column._options.formatter(row) || '' :
                        gridFilter[columnKey].getDict(row[columnKey]);
                }else{
                    return row[columnKey];
                }
            },

            cellClickFunction(columnKey,row){
                const column = this[DATAMODEL_NAME][columnKey];
                if(!column) return null;
                const func = column._options.clickFun;
                if(_.isFunction(func)){  func(row); }
            },

            cellMouseOver(columnKey,row) {
                const column = this[DATAMODEL_NAME][columnKey];
                if(!column || !column._options.mouseOver) return null;
                throttle(() => {
                    column._options.mouseOver(row);
                })
            },

            /**
             * 列字段格式化
             * **/
            columnFormatter(columnKey, row) {
                const column = this[DATAMODEL_NAME][columnKey];
                if(!column) return '';
                if(!column._options.formatter) return '';
                return column && column._options.formatter ? column._options.formatter(row) : '';
            },

            // /**
            //  * 列字段字典格式化（当某个列配置了过滤器，且配置了formatter时触发）
            //  * **/
            // columnDictFormatter(columnKey, cur) {
            //     const column = this[DATAMODEL_NAME][columnKey];
            //     return column && column.getDict(cur);
            // },

            renderDynamicButton(btns) {
                this.badDynamicBtnNum = Math.max(this.badDynamicBtnNum, btns?.length ?? 0);
                return (btns instanceof Array) && btns.length > 0;
            },
            dynamicChangeOptColumnWidth(num) {
                const width = (num * 45) + ((num - 1) * 10) + 20;
                this.dataModel.opt.incrWidth(width);
            },
            dynamicButtonClickHandler(row, optExt) {
                let contentName = optExt[MSUI_DATAGRID_CONSTANT.EXT_BTN_ATTR.CONTENT_TITLE];
                let contentUrl = optExt[MSUI_DATAGRID_CONSTANT.EXT_BTN_ATTR.URL];
                let openType = optExt[MSUI_DATAGRID_CONSTANT.EXT_BTN_ATTR.OPEN_TYPE];

                let component = MsuiRouteManager.getComponent(contentUrl);
                let parentData = MsuiRouteManager.getParamsByUrl(contentUrl);
                if (openType === MsuiStore.MSUI_OPENCOMPONENT_CONSTANT.OPEN_TYPE.inner) {
                    if (_.isFunction(openInnerCallback)) openInnerCallback(parentData, component);
                } else if (openType === MsuiStore.MSUI_OPENCOMPONENT_CONSTANT.OPEN_TYPE.self) {
                    MsuiOpenComponentsUtil.openComponentDialog({
                        content: component,
                        title: contentName,
                        parentData: parentData
                    })
                } else {
                    MsuiOpenComponentsUtil.openTab({title: contentName, path: contentUrl})
                }
            },
            /**
             * 查询表格，专门给 vueIns 中的组件使用的 -_-||
             * **/
            loadByVueIns(params) {
                pluginConfig.queryParams.page = 1;
                tableSelf.load(params);
            },

            /**
             * 设置 过滤 数据
             * @param columnName { String } 列名
             * @param filterValue { String } 过滤数据
             * @param isRemove { Boolean } 移除 或 添加
             * **/
            setFilterData(params, isAllFieldQuery) {

                const pc = tableSelf.msui_plugin_config,
                      cacheParams = pc.cacheQueryParams;
                pc.filterRules = [];

                // 模糊查询
                if(!isAllFieldQuery){
                    const paramKeys = Object.keys(params);
                    paramKeys.forEach(curKey => {
                        curKey !== 'allFieldParam' && pc.filterRules.push({
                            field: curKey,
                            value: params[curKey],
                            displayValue: tableSelf.gridFilter[curKey].getDict(params[curKey])
                        });
                    });

                    cacheParams.allFieldParam = '';
                }
                else{
                    delete cacheParams.allFieldParam;
                }
                console.log('params: %o', pc.cacheQueryParams);

                this.loadByVueIns();
            },

            /**
             * 设置 过滤 数据
             * **/
            // setFilterData(params){
            //
            //     // const paramKeys = Object.keys(params);
            //
            //     tableSelf.msui_plugin_config.cacheQueryParams = {};
            //
            //     // paramKeys.forEach( curKey => {
            //     //     if(params[curKey] === ''){
            //     //         delete params[curKey];
            //     //     }
            //     // });
            //     // console.log('params: %o', params);
            //
            //     this.loadByVueIns(params);
            // },

            /**
             * 设置 排序 数据
             * @param columnName { String } 列名
             * @param orderValue { String } asc || desc 排序状态
             * @param isRemove { Boolean } 移除 或 添加
             * **/
            setSortData(columnName, orderValue, isRemove = false) {
                if (isRemove) {
                    delete sortAndOrder[columnName];
                } else {
                    sortAndOrder[columnName] = orderValue;
                }
                this.loadByVueIns();
            },

            /**
             * 拖动表格调整
             * 表格大小限制
             *
             */

             headerDragend(newWidth, oldWidth, column, event) {
                const minlen = column.label.length * 12 + 50;
                if(newWidth < minlen) {
                    column.width = minlen
                }
             }
        };

        if (_.isFunction(selectFun)) {
            vueConfig.methods.selectFun = selectFun;
        }
        if (_.isFunction(selectAllFun)) {
            vueConfig.methods.selectAllFun = selectAllFun;
        }
        if (_.isFunction(rowClickFun)) {
            vueConfig.methods.rowClickFun = rowClickFun;
        }
        if (_.isFunction(rowDbClickFun)) {
            vueConfig.methods.rowDbClickFun = rowDbClickFun;
        }
        if (_.isFunction(cellClick)) {
            vueConfig.methods.cellClick = (row, column) => {
                return cellClick && cellClick(this[DATAMODEL_NAME][column.property], row, column);
            };
        }
        if (_.isFunction(tableRowClassName)) {
            vueConfig.methods.tableRowClassName = tableRowClassName;
        }

        // if(_.isFunction(onExpandChangeFun)) {
        //     vueConfig.methods.onExpandChangeFun = onExpandChangeFun
        // }

        if(_.isFunction(cellMouseEnter)) {
            vueConfig.methods.cellMouseEnter = cellMouseEnter
        }
        if(_.isFunction(cellMouseLeave)) {
            vueConfig.methods.cellMouseLeave = cellMouseLeave
        }
        if(_.isFunction(spanMethod)) {
            vueConfig.methods.spanMethod = spanMethod
        }


        // 分页组件
        if (hasPagination) {
            const pageOption = pluginConfig.pageOption;
            super.addFragment(PAGINATION_NAME, new MsuiPagination({
                pageSize: pluginConfig.pageOption.pageSize,
                pageSizes: pluginConfig.pageOption.pageSizes,
                handleChange: (curPage, pageSize) => {
                    pluginConfig.queryParams.page = curPage;
                    pluginConfig.queryParams.rows = pageSize;
                    this.load();
                    if(pageOption.handleChange instanceof Function){
                        pageOption.handleChange(curPage, pageSize);
                    }
                }
            }));
        }

        // 合并表格行内按钮
        let gridInlineBtns = [];
        if(_.isArray(inlineButtons)){
            gridInlineBtns = gridInlineBtns.concat(inlineButtons);
        }

        // 添加 modularProxy
        this.enableModularProxy(modularProxy, loader, gridInlineBtns);

        /*
        * 表格列配置器
        * 用于 配置表格列的 隐藏/显示、排序
        * */
        let opreationExtFragment = [];
        let urlPath = null;

        if(this.axiosIns){
            urlPath = this.axiosIns.getUrl();
        }

        if (showColumnConfig && urlPath) {
            opreationExtFragment.push(
                new MsuiDatagridColumnListConfig({
                    ob,
                    dataGridModel: dataModel,
                    cacheKey: urlPath,
                    comfirmFun: (data) => {
                        this.$self.datagridKey++;
                    }
                })
            );
        }

        /*
        * 表格数据过滤器 的 开关
        * 用于 配置表格数据过滤器的 隐藏/显示
        * */
        // if (showColumnFilter) {
        //     //操作栏 添加列搜索
        //     opreationExtFragment.push(
        //         new MsuiDatagridColumnListFilter({
        //             filterHandler: (filterVisible) => {
        //                 dataModel.setFilterVisible(filterVisible);
        //                 this.$self.datagridKey++;
        //             }
        //         })
        //     );
        // }

        // 添加操作列
        if (showOptColumn && gridInlineBtns.length > 0) {
            dataModel.addOperationColumn(gridInlineBtns, optColumnFixed, opreationExtFragment);
        }

        // 添加选择列
        if (hasSelection)
            dataModel.addSelectionColumn();

        // //添加行展开
        if (expandView)
            dataModel.addExpandColumn(expandView);

        // 添加索引列
        if (hasIndex)
            dataModel.addIndexColumn();

        // 添加dataModel
        super.addFragment(DATAMODEL_NAME, dataModel);

        // 添加表格过滤器
        const gridFilter = this.gridFilter = new MsuiDataGridFilter(dataModel, this.ob);
        super.addFragment('gridFilter', gridFilter);

        // 定时器
        if(interval) {
            if (typeof interval === "number") {
                this.interval = new MsuiInterval(interval, this.load, this);
            }else if(typeof interval === "object"){
                this.interval = new MsuiInterval(interval.time || 5000, () => {
                    interval.open instanceof Function && interval.open();
                    this.load();
                }, this,interval.close);
            }
            _toggleInterval.call(this, true);
        }
    }

    enableModularProxy(modularProxy, loader, inlineButtons){

        const modularProxyClass = this.modularProxy = new MsuiDataGridModularProxy();

        const getPrimaryColumn = () => this.getPrimaryColumn(),
              getSelection = () => this.getSelection(),
              getQueryParams = () => this.getQueryParams(),
              getData = () => this.getData(),
              setLoading = (status = false) => {
                this.$self.loading = status;
              };


        /*
        * 配置 查询表格数据 的MsuiAxios
        * */
        if(loader || (modularProxy || {}).loader){

            const loadSuc = data => {
                this.loadResult(data);
            };

            const loadErr = () => {
                _error(MSUI_DATAGRID_CONSTANT.MODEL_NAME,
                    MSUI_DATAGRID_CONSTANT.REQUEST_DATA_ERROR);
                this.$self && (this.$self.loading = false);
            };

            if(loader){
                this.axiosIns = _addAxiosReturnIns(loader, loadSuc, loadErr);
            }
            else{
                this.axiosIns = modularProxyClass.createLoader(modularProxy.loader, {
                    loadSuc,
                    loadErr
                });
            }
        }

        if(!modularProxy){
            return;
        }

        /*
        * 配置 查询表格数据 删除器模块
        * */
        if (_.isObject(modularProxy.deleter)) {

            const deleteSuc = data => {

                if(data && data.success === false){
                    MsuiNotify.warning(data.msg || '业务逻辑出错！', '提示');
                }
                else{
                    MsuiNotify.success('删除成功', '提示');
                    this.load();
                }

                return data;
            };

            const deleteErr = err => {
                MsuiNotify.error('建立请求失败，请重试！', '提示');
                return err;
            };

            const {inlineBtn} = this.modularProxy.createDeleter(modularProxy.deleter, {
                deleteSuc,
                deleteErr,
                getPrimaryColumn,
                getSelection
            });

            if(inlineBtn){
                inlineButtons.push(inlineBtn);
            }

            this.modularProxyDeleter = true;
        }

        if (_.isObject(modularProxy.exporter)) {
            this.modularProxy.createExporter(modularProxy.exporter, {
                getData,
                getSelection,
                getPrimaryColumn,
                getQueryParams,
                setLoading
            });
            this.modularProxyExporter = true;
        }
    }

    getPrimaryColumn(){
        return this[DATAMODEL_NAME].getPrimaryColumn()[0];
    }

    toggleInterval(open = false) {
        if (this.interval) {
            _toggleInterval.call(this, open);
        }
    }

    toggleVisible(visible) {
        if (this.$self) {
            this.$self.MsuiDataGridVisible =
                _.isBoolean(visible) ? visible : !this.$self.MsuiDataGridVisible;
        }
    }

    _getGlobalBtnRender() {

        let globalButtons = this.msui_plugin_config.globalButtons,
            btnTemplate = '';

        // 添加普通全局按钮
        if (_.isArray(globalButtons)) {
            globalButtons.forEach((btn, index) => {
                btnTemplate += addButtons.call(this, `globalBtn${index}`, btn)
            })
        } else if (_.isObject(globalButtons)) {
            _eachObj(globalButtons, (btnName, btn) => {
                btnTemplate += addButtons.call(this, btnName, btn);
            });
        }

        // // 查看模块委托
        // if (this.modularProxyViewer) {
        //     const {
        //         btnIns
        //     } = this.viewer;
        //
        //     if (btnIns) {
        //         btnTemplate += addButtons.call(this, 'addBtnIns', btnIns);
        //     }
        // }

        // 删除模块委托
        if (this.modularProxyDeleter) {

            const {
                btnIns
            } = this.modularProxy.deleter;

            if (btnIns) {
                btnTemplate += addButtons.call(this, 'delBtnIns', btnIns);
            }
        }

        // 导出模块委托
        if (this.modularProxyExporter) {

            const {
                btnIns
            } = this.modularProxy.exporter;

            if (btnIns) {
                btnTemplate += addButtons.call(this, 'expBtnIns', btnIns);
            }
        }

        return btnTemplate;
    }

    getQueryParams(pluginConfig = this.msui_plugin_config){
        return _.merge({}, pluginConfig.queryParams,
            _formatQueryParams(pluginConfig.sortAndOrder, pluginConfig.filterRules), pluginConfig.cacheQueryParams);
    }

    load(params) {

        if (this.axiosIns) {

            const pluginConfig = this.msui_plugin_config,
                  queryParams = pluginConfig.queryParams;

            if (_.isObject(params)) {
                params.page = Math.max(params.page >>> 0, 1);
                pluginConfig.cacheQueryParams = params;
            }

            queryParams.allFieldParam = this.$self.allFieldParam;
            const finalParams = this.getQueryParams(pluginConfig);

            /*
            * 重置查询页数
            * 如果调用方法传入了page，则按照传入的page作为页数
            * 如果没有传入并且过滤条件至少有一条或以上，则将页数重置
            * 如果没有传入page，且没有过滤条件，则按照当前页数查询
            * */
            // if (_.isEmpty(pluginConfig.cacheQueryParams.page) && filterRulesLength !== cacheFilterLength) {
            //     finalParams.page = 1;
            //     pluginConfig.cacheFilterLength = filterRulesLength;
            //     // console.log('将page重置');
            // }

            delete pluginConfig.cacheQueryParams['page'];
            if (this[PAGINATION_NAME]) {
                // console.log('设置分页组件的页数：%o', finalParams.page);
                this[PAGINATION_NAME].setCurrentPage(finalParams.page);
            }

            // 显示查询等待框 & 查询表格数据
            this.$self.loading = true;
            this.axiosIns.sender(finalParams);
        }

        return this;
    }

    loadResult({total, rows}) {
        this.setData(rows, total);
        this.$self.loading = false;
    }

    /**
     * 获取 dataGrid 数据
     * **/
    getData() {
        return _.cloneDeep(this.$self.rows);
    }

    updateRow(rows = [], paramKeys = []) {
        let updateMap = {},
            datagridDatas = this.$self.rows;
        let primaryKey = this[DATAMODEL_NAME].getPrimaryColumn()[0];
        if (rows.length > 0) {
            rows.forEach(cur => {
                updateMap[cur[primaryKey]] = cur;
            });
        }
        datagridDatas.forEach(row => {
            let curKey = row[primaryKey];
            let curUpdateMap = updateMap[curKey];
            if (curUpdateMap) {
                paramKeys.forEach(key => {
                    row[key] = curUpdateMap[key];
                });
            }
        });

    }

    /**
     * 全量添加 dataGrid 数据
     * **/
    setData(rows, total) {
        if (_.isArray(rows)) {
            this.$self.rows = rows;
            if (this[PAGINATION_NAME]) {
                if (total === void 0)
                    total = rows.length;
                this[PAGINATION_NAME].setPagination(total);
            }
        }
    }

    clearData() {
        this.$self.rows = [];
        if (this[PAGINATION_NAME]) {
            this[PAGINATION_NAME].setPagination(0);
        }
    }

    /**
     * 增量添加 dataGrid 数据
     *
     * 当 dataGrid 没有查询数据的 loader 后，启用
     *
     * **/
    addData(rows) {
        if (!this.axiosIns) {
            let count = 0, dataRows = this.$self.rows;
            if (_.isArray(rows) && rows.length > 0) {
                rows.forEach(row => dataRows.push(row));
                count = rows.length;
            } else if (_.isObject(rows)) {
                dataRows.push(rows);
                count = 1;
            }
            if (count > 0 && this[PAGINATION_NAME]) {
                this[PAGINATION_NAME].incrementTotal(count);
            }
        }
    }

    /**
     * 移除 dataGrid 数据
     * **/
    removeData(index) {
        if (!this.axiosIns && _.isNumber(index) && index <= this.$self.rows.length) {
            this.$self.rows.splice(index, 1);
            if (this[PAGINATION_NAME]) {
                this[PAGINATION_NAME].decreaseTotal(1);
            }
        }
    }

    /**
     * 获取当前页选中
     * @returns {Array|*}
     */
    getSelection() {
        return this.$self._selection || [];
    }

    /**
     * 清空选择
     */
    clearSelection() {
        this.$eleRef.clearSelection();
    }

    /**
     * 选中当前行（用于单选）
     *
     * **/
    setCurrentRow(index){
        if (_.isNumber(index) && index <= this.$self.rows.length){
            this.$eleRef.setCurrentRow(this.$self.rows[index]);
        }
    }

    /**
     * 选中当前行(用于多选)
     * @param index
     * @param select
     */
    selectCurRow(index, select = true) {
        if (_.isNumber(index) && index <= this.$self.rows.length)
            this.$eleRef.toggleRowSelection(this.$self.rows[index], select);
    }

    selectCurRowByRowData(row, select = true) {
        if (_.isObject(row))
            this.$eleRef.toggleRowSelection(row, select);
    }

    setAllFieldParams(allFieldParams) {
        if (_.isString(allFieldParams)) {
            this.$self.allFieldParam = allFieldParams;
        }
    }

    mergeFilter(){

    }

    render(el) {

        let pluginConfig = this.msui_plugin_config,
            vueConfig = this.msui_element_config,
            dataModel = this[DATAMODEL_NAME],
            primaryColumn = dataModel.getPrimaryColumn(),
            dqPagination = this[PAGINATION_NAME],
            gridFilter = this.gridFilter;

        // 合并列过滤器
        if(pluginConfig.extFilter){
            this.mergeFilter(gridFilter, pluginConfig.extFilter);
        }

        this.msui_element_config.template = `

            <div :key="datagridKey" v-show="MsuiDataGridVisible" style="height: 100%;">
           
            <div ${pluginConfig.loading ? `v-loading="loading"` : ``} class="msui-datagrid-container">
            
                ${
                    pluginConfig.showFilter ? gridFilter.render(pluginConfig.searchInputText ? pluginConfig.searchInputText : dataModel.getSearchColumnsLabel() || '' ) : ''
                }
            
                <div class="msui-datagrid-inner-container" style="flex: 1;">
            
                ${!_.isEmpty(pluginConfig.globalButtons) || pluginConfig.showSearchInput ? `
                    <div class="msui-datagrid-header">
                        <div class="button-content">
                            ${pluginConfig.globalButtons ? this._getGlobalBtnRender() : ''}
                        </div>
                    </div>
                ` : ``}
                
                <div class="datagrid-content">
                    <el-table 
                        :data="rows"
                        msuiRef
                        msuiCustom
                        height="100%"
                        size="mini"
                        :highlight-current-row="true"
                        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                        :border="${pluginConfig.border}"
                        :stripe="${pluginConfig.stripe}"
                        ${primaryColumn.length ? `row-key="${primaryColumn[0]}"` : ``}
                        empty-text="${pluginConfig.emptyText}"
                        ${vueConfig.methods.tableRowClassName ? `:row-class-name=tableRowClassName` : ``}
                        :show-header="${pluginConfig.showHeader}"
                        ${vueConfig.methods.selectFun ? `@select=selectFun` : ``}
                        ${vueConfig.methods.selectAllFun ? `@select-all=selectAllFun` : ``}
                        ${vueConfig.methods.rowClickFun ? `@row-click=rowClickFun` : ``}
                        ${vueConfig.methods.rowDbClickFun ? `@row-dblclick=rowDbClickFun` : ``}
                        ${vueConfig.methods.cellClick ? `@cell-click=cellClick` : ``}
                        ${vueConfig.methods.cellMouseEnter ? `@cell-mouse-enter=cellMouseEnter` : ``}
                        ${vueConfig.methods.cellMouseLeave ? `@cell-mouse-leave=cellMouseLeave` : ``}
                        @cell-mouse-enter="handleCellMouseEnter"
                        @cell-mouse-leave="handleCellMouseLeave"
                        @header-dragend='headerDragend'
                        @selection-change=onSelectChange
                        ${pluginConfig.expandView ? `
                            :expand-row-keys="expandRows"
                            @expand-change="onExpandChange"
                        ` : ''}
                        ${vueConfig.methods.spanMethod ? `:span-method=spanMethod` : ''}
                    >
                        ${dataModel.render()}
                    </el-table>
                    
                    <el-tooltip effect="dark" placement="top" ref="tooltip">
                        <div class="msui-datagrid-tooltip" slot="content" v-html="tooltipContent" @mouseenter="handleTooltipMouseEnter" @mouseleave="handleTooltipMouseLeave"></div>
                    </el-tooltip>
                </div>
                
                ${pluginConfig.hasPagination ? `
                    <div class="datagrid-footer" style="height: ${FOOTER_HEIGHT}px;">
                        ${dqPagination.render()}
                    </div>
                ` : ''}
                
                </div>
                
            </div>
            
            </div>
        `;

        console.log('msuiDataGrid: %o', this);

        return super.render(el);
    }

    $destroy() {}

    destroyed() {
        this.$msuiParent.toggleInterval(false);
    }

    addFragment(fragName, frag) {
        return super.addFragment(fragName, frag);
    }

    /**
     * 绑定到父类
     * */
    static install(MsuiElement) {
        MsuiElement[this._pluginName] = this;
    }
}

const mergeFun = function(objValue, srcValue) {
    // if (_.isArray(objValue)) {
    //     return objValue.concat(srcValue);
    // }
    return srcValue;
};

export default MsuiDataGrid
