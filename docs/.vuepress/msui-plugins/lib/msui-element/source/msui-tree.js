'use strict';

import MsuiElement from './msui-element'
import _ from 'lodash'
import {_eachObj,_throttleFactory} from "../../msui-common/source/_self-util";

const defaultProps = {
    id: "id",
    label: "name",
    icon: "icon",
    children: "children"
};

const throttleFactory = _throttleFactory(1000);

const commonQueryParams = ['startResType', 'includeResTypes', 'reservedNode', 'exclusionNode', 'endNode', 'customParam'];

const getIcon = function(iconPath) {
    if (iconPath) {
        if (iconPath.indexOf('/') > -1 && iconPath.indexOf('.') > -1 && iconPath.lastIndexOf('/') < iconPath.indexOf('.')) {
            iconPath = iconPath.substring(iconPath.lastIndexOf('/') + 1, iconPath.lastIndexOf('.'))
        }
        return iconPath;
    } else {
        return '';
    }
};

const formatterRules = {
    /*
    * 空值替换label
    * */
    emptyName: (data, prop) => {
        _.isEmpty(data[prop.label]) && (data[prop.label] = '(空)');
    },

    /*
    * 格式化id，追加资源类型
    * */
    mergeId: (data, prop) => {
        !data[prop.id].includes(';') && (data[prop.id] = data[prop.id] + ';10100');
    }
};

/**
 * 替换返回数据规则
 * **/
const formatterResultData = function(data, props, rules){
    if(_.isArray(data) && data.length > 0){
        data.forEach( cur => {
            rules.forEach( ({ruleName, ruleStatus = true}) => {
                formatterRules[ruleName] && ruleStatus && formatterRules[ruleName](cur, props);
            })
        });
    }
};

/**
 * MsuiTree
 * 资源树插件
 * @extends MsuiElement
 * @Date 2020-2-27 16:04:30
 * @author cooper
 *
 * **/

class MsuiTree extends MsuiElement {

    static _pluginName = 'MsuiTree';

    constructor({
                    el,
                    url = '',
                    data = [],
                    nodeKey = 'id',
                    props = null,
                    lazy = false,
                    loading = false,
                    load,
                    onLoad = null,
                    searchEnable = false,
                    filterBySearch = true,
                    searchUrl = '',
                    locationUrl = '',
                    showIcon = true,
                    queryParams = {},
                    nodeClickFun,
                    showCheckbox = false,
                    checkStrictly = false,
                    immediate = true,
                    checkHandler = null
                } = {}, custom = {}) {

        super();
        this.msui_plugin_config = {
            el: el,
            url: url,
            lazy: lazy,
            nodeKey: nodeKey,
            showIcon: showIcon,
            searchEnable: searchEnable,
            filterBySearch: filterBySearch,
            searchUrl: searchUrl,
            locationUrl: locationUrl,
            onLoad
        };

        this.msui_element_config.custom = custom;

        var self = this;

        let pluginConfig = this.msui_plugin_config;

        pluginConfig.queryParams = {
            includeResTypes: '',
            reservedNode: '',
            exclusionNode: '',
            endNode: ''
        };
        this.setQueryParams(queryParams);

        let vueConfig = this.msui_element_config;
        vueConfig.data = {
            data,
            loading: loading,
            showCheckbox,
            checkStrictly,
            filterText: '',
            props: props || defaultProps,
        };

        vueConfig.methods = {
            filterNode(value, data) {
                if (!value) return true;
                return data[this.props.label].indexOf(value) !== -1;
            },

            //过滤节点，查询树
            filterTree(queryString, cb) {
                throttleFactory(() => {
                    if (filterBySearch) {
                        pluginConfig.queryParams.resName = queryString;

                        _eachObj(pluginConfig.queryParams, (paramName, param) => {
                            if(param === void 0){
                                pluginConfig.queryParams[paramName] = ''
                            }
                        });

                        self.msui_plugin_config.searchAxios.sender(pluginConfig.queryParams).then((data) => {
                            if (_.isFunction(cb)) {
                                cb(data);
                            }
                        });

                    } else {
                        //静态过滤
                        //获取msui element的当前tree 应用 [ == ref ]
                        this.$eleRef.filter(this.filterText);
                    }
                });
            },
            //懒加载方法
            load(node, resolve) {

                pluginConfig.queryParams.resType = node.data.resType;
                pluginConfig.queryParams.readWriteFlag = node.data.readWriteFlag;
                pluginConfig.queryParams.nodeType = node.data.nodeType;
                pluginConfig.queryParams.guid = node.data.guid;

                self.load(pluginConfig.queryParams, node, resolve);
            },
            localTreeItem(item) {
                pluginConfig.queryParams.guid = item.guid;
                self.msui_plugin_config.locationAxios.sender(pluginConfig.queryParams).then((data) => {
                    if (data) {
                        this.expandTreeNodeById(data, 0);
                    }
                });
            },

            //递归展开树节点
            expandTreeNodeById(data, i) {
                if (i >= data.length) {
                    //最后一条数据 高亮
                    this.$eleRef.setCurrentKey(data[data.length - 1]);
                    if(_.isFunction(nodeClickFun)){
                        this.$nextTick(() => {
                            var padding = 20;
                            var tree = this.$eleRef.$el.parentNode;
                            var node = this.$eleRef.$el.querySelector('.is-current');
                            var left = this.$eleRef.$el.querySelector('.is-current .custom-tree-node').offsetLeft - padding;
                            var top = node.offsetTop - tree.offsetTop;

                            setTimeout(() => {
                                tree.scrollTo(left, top);
                                nodeClickFun(this.$eleRef.getCurrentNode());
                            }, 300)
                        });
                    }
                } else {
                    let {id: nodeId = ''} = data[i++];
                    if (nodeId) {
                        let curNode = this.$eleRef.getNode(nodeId);
                        if (!curNode) {//找不到节点 继续下一个节点
                            this.expandTreeNodeById(data, i);
                        } else {
                            return curNode && curNode.expand(() => {
                                this.expandTreeNodeById(data, i);
                            });
                        }
                    }
                }
            }
        };

        if (_.isFunction(nodeClickFun)) {
            vueConfig.methods.nodeClickFun = nodeClickFun;
        }

        if (_.isFunction(checkHandler)) {
            vueConfig.methods.checkHandler = checkHandler;
        }

        //请求url 获取data
        if (url) {
            // 生成Axios
            this.addDataAxios(url);
            if (!this.msui_plugin_config.lazy && immediate) {
                this.load(pluginConfig.queryParams);
            }
        }

        //搜索定位功能开启
        if (searchEnable) {
            //判断url是否传递
            if (locationUrl && searchUrl) {
                this.addSearchAxios(locationUrl, searchUrl);
            }
        }
    }

    /**
     * 查询树数据的回调
     * **/
    loadSuccess(data, resolve){

        const vueScope = this.$self ?
            this.$self : this.msui_element_config.data;

        vueScope.loading = false;

        if(_.isObject(data) || _.isArray(data)){
            const props = vueScope.props, lazy = this.msui_plugin_config.lazy;

            let rows = lazy ? data : data[0].rows;

            // 格式化返回数据，如果是资源树，要做特殊处理
            formatterResultData(rows, props, [
                {ruleName: 'emptyName'},
                {ruleName: 'mergeId', ruleStatus: lazy}
            ]);

            // 树赋值
            if(_.isFunction(resolve)){
                resolve(rows);
            }
            else{
                vueScope.data = rows;
            }
        }
    }

    setQueryParams(queryParams = {}){

        let pluginConfig = this.msui_plugin_config;

        if(!pluginConfig.queryParams)
            pluginConfig.queryParams = {};

        commonQueryParams.forEach( curParamsName => {
            pluginConfig.queryParams[curParamsName] = queryParams[curParamsName] ?? '';
        });
    }

    load(queryParams = {}, node, resolve){

        const queryPromises = [];

        const vueScope = this.$self ?
            this.$self : this.msui_element_config.data;

        vueScope.loading = true;

        const {onLoad: onLoadFunc, dataAxios} = this.msui_plugin_config;
        queryPromises.push(dataAxios.sender(queryParams));
        this.setQueryParams(queryParams);

        // 处理 onLoad 回调中所暴露的数据
        if(onLoadFunc instanceof Function){
            const result = onLoadFunc(queryParams, node);
            if(!(result instanceof Promise)){
                queryPromises.push(new Promise((resolve) => {
                    resolve(result);
                }))
            }else if(result instanceof Array){
                queryPromises.push(result);
            }
        }

        Promise.all(queryPromises).then((datas) => {
            const data = datas.reduce((prev, cur) => {
                return prev.concat(cur);
            }, []);
            this.loadSuccess(data, resolve);
        });

        return this;
    }

    clearSearchVal(){
        this.$self.filterText = '';
    }

    addIcon(rows) {
        rows.forEach(element => {
            if (element.children) {
                this.addIcon(element.children);
            }
            element.icon = 'icon-' + getIcon(element.icon);
        });
    }

    addDataAxios(url) {
        let MsuiAxios = MsuiElement.getMsuiUtil('MsuiAxios');
        this.msui_plugin_config.dataAxios = new MsuiAxios({
            url: url,
            // lazySuc: (data) => {
            //     this.loadSuccess(data);
            // }
        });
    }

    addSearchAxios(locationUrl, searchUrl) {
        let MsuiAxios = MsuiElement.getMsuiUtil('MsuiAxios');
        this.msui_plugin_config.locationAxios = new MsuiAxios({
            url: locationUrl
        });
        this.msui_plugin_config.searchAxios = new MsuiAxios({
            url: searchUrl
        });
    }


    render(el) {
        let [{
            data: vueData,
            methods: vueMethod
        }, pluginConfig] = [this.msui_element_config, this.msui_plugin_config];

        this.msui_element_config.template =
            `
            <div class='msui-tree-container'>
                <div class="tree-search-div">
                ${this.msui_plugin_config.searchEnable ?
                `
                ${this.msui_plugin_config.filterBySearch ?
                    `  
                        <el-autocomplete 
                            value-key="resourceName" 
                            :highlight-first-item="true" 
                            v-model="filterText" 
                            size="small" 
                            placeholder="请输入内容" 
                            :trigger-on-focus="false" 
                            @select="localTreeItem" 
                            :fetch-suggestions="filterTree"
                        >
                        <el-button slot="append" icon="el-icon-search"></el-button>
                        <template slot-scope="{ item }">
                            <Tip class="addr" :text="item.resourceName" placement="right"></Tip>
                        </template> 
                        </el-autocomplete>
                       
                       
                    ` : `
                        <el-input v-model="filterText" size="small" placeholder="请输入内容" @change="filterTree"><el-button slot="append" icon="el-icon-search"></el-button></el-input>
                     `}
                    ` : ``}
                </div>
                <div class="tree-div ${this.msui_plugin_config.searchEnable ? `hasSearch` : ``}">
                    <el-tree
                    msuiRef
                    msuiCustom
                    v-loading="loading"
                    highlight-current
                    :expand-on-click-node="false"
                    ${this.msui_plugin_config.nodeKey ? `node-key="${this.msui_plugin_config.nodeKey}"` : ``}
                    ${this.msui_plugin_config.lazy ? `lazy` : ``}
                    ${vueMethod.load ? `:load="load"` : ``}
                    ${vueData.data ? `:data="data"` : ``}
                    ${vueData.props ? `:props="props"` : ``}
                    ${vueMethod.filterNode ? `:filter-node-method=filterNode` : ``}
                    ${vueMethod.nodeClickFun ? `@node-click=nodeClickFun` : ``}
                    ${vueData.showCheckbox ? `show-checkbox` : ``}
                    ${vueData.checkStrictly ? `check-strictly` : ``}
                    ${vueMethod.checkHandler ? `@check-change=checkHandler` : ``}
                >
                ${pluginConfig.showIcon ?
                `<span class="custom-tree-node" slot-scope="{ node,data }">
                            <span>
                                <i :class="data.icon"></i>
                            </span>
                            <span>{{node.label}}</span>
                        </span>`
                : ``
                }
                </el-tree>
                </div>
            </div>
        `;
        return super.render(el);
    }

    static install(MsuiElement, options) {
        MsuiElement[this._pluginName] = MsuiTree;
    }
}

export default MsuiTree;
