<template>
    <div style="padding: 12px 0;">
        <el-popover class="tree-popover" placement="bottom" :width="currentWidth" trigger="manual" v-model="visible">
            <div class="pop-content" v-loading='loadingS'>
                <div class="pop-item"  v-for="item in searchData"  :key="item.id"  @click="handleSelect(item)">
                    <el-tag size="mini" class="el-tag">{{item.resourceType}}</el-tag>
                    <el-tooltip placement="top" :content="item.resourceName" :open-delay="300">
                       <span class="name">{{ item.resourceName }}</span>
                    </el-tooltip>
                </div>
            </div>
            <el-input ref="input" clearable slot="reference" v-model="downSearch" @blur="visible = false" placeholder="请输入内容"  @keypress.native.enter="querySearch">
            <el-button
                :loading='loadingS'
                @click="querySearch"
                slot="append"
                icon="el-icon-search"
            ></el-button>
            </el-input>
        </el-popover>
        <div style="height: 30px;padding: 10px 0; overflow:hidden;">
            <div style="overflow-x: auto;width: 100%;white-space: nowrap;padding-bottom:10px">
                <el-tag size='mini'
                        style="cursor:pointer;margin: 0 5px"
                        v-for="item in selectData"
                        closable
                        @close="handleClose(item)"
                        @click.native="elTagClick(item)"
                        :key="item.value"
                >{{item.name}}</el-tag>
            </div>
        </div>
        <div style="height:45vh;width:100%; overflow:auto;margin-bottom:40px;" ref="scroll">
                <el-tree
                        ref="tree"
                        :props="props"
                        lazy
                        :node-key="id"
                        :data="data"
                        :load="loadNode"
                        v-loading="loading"
                        :check-strictly="true"
                        @node-click="nodeClick"
                        @check="check"
                        :highlight-current="true"
                        :show-checkbox="true"
                >

                    <span class="resource-tree-custom-node" slot-scope="{ node, data }" :class="{'notAllowed': data.disabled}" :title="getTitle(data.resType)">

                        <img v-if="hasTreeIcon(data.resType)" :src="getTreeIcon(data.resType)" width="20px" style="margin-right: 5px;" />

                        <span>
                            {{ data.name }}
                        </span>

                    </span>

                </el-tree>

        </div>
    </div>
</template>

<script>

    import {MsuiAxios} from "../msui-util";


    import img_10100 from './tree/10100.png';
    import img_10101 from './tree/10101.png';
    import img_10102 from './tree/10102.png';
    import img_10107 from './tree/10107.png';
    import img_10001 from './tree/10001.png';

    const TREE_IMG_MAPPING = {
        '10100': img_10100,
        '10101': img_10101,
        '10102': img_10102,
        '10107': img_10107,
        '10001': img_10001
    };

    const resTreeQueryUrl = "resource/baseRes/" + "resourceTree/list";

    const RES_NAMED_MAPPING = {
        '10100': '区域',
        '10000':"系统备份",
        '10101':"站点",
        '10102':"机房",
        '10104':"机架",
        '10001': "设备"
    };


    export default {
        name: 'resourceTree',

        // props: {
        //     dataDacktracking: {
        //         type: [Array, String, Object],
        //         default: null
        //     }
        // },

        data() {
            return {
                endNode: "10001,10101,20000,10012", // 以哪些类型的节点作为结束节点
                includeResTypes: "10001,10101,20000,10012", // 查询包含哪些类型的节点
                exclusionNode: "",
                multiple: false, //是否为多选
                selectData: [], // 选择的节点
                selectResType: [], // 选择类型
                data: [], //初始化数据
                downSearch: "", // 查询数据
                searchData: [], // 查询数据
                visible:false,
                currentWidth: 300, // 下拉框宽度
                searchFlag: false, // 是否进行远程搜索
                props: {
                    label: 'name',
                },
                id: "id",
                loading: false,
                loadingS: false,
                expendFlag: false
            }
        },

        computed: {
            getTreeIns(){
                return this.$refs.tree;
            }
        },

        created(){
            this.resTreeQueryUrl = new MsuiAxios({
                url: 'resource/baseRes/resourceTree/queryResByName'
            });

            // 数据回显Axios
            this.dacktrackingAxios = new MsuiAxios({
                url: "resource/baseRes/resourceTree/findResPathByGuid"
            })

        },

        methods: {
            getTitle(resType) {
                return resType ? RES_NAMED_MAPPING[resType.slice(0,6)]|| '' : '';
            },
           handleClose(tag) {
             this.selectData.splice(this.selectData.indexOf(tag), 1);
             this.getTreeIns.setCheckedNodes(this.selectData);
          },
            // 弹框打开时的回调
            openCallback(options){
                // 置空搜索框
                this.downSearch = '';

                // 取父组件传过来的值
                const {
                    parentData: {
                        selectData,
                        queryParams,
                        multiple = false
                    } = {}
                } = options;

                //将includeResTypes缓存下来，有大用
                this.includeResTypes = queryParams.includeResTypes;
                // 结束树的node
                this.endNode =  queryParams.endNode || '';

                // 树中可选择节点
                this.selectResType = [];

                if (this.endNode) {
                      this.selectResType = this.endNode.split(',')
                } else if(this.includeResTypes) {
                      this.selectResType = this.includeResTypes.split(',')
                } else if(queryParams.selectResType) {
                      this.selectResType =  queryParams.selectResType
                }

                //multiple是否多选
                this.multiple = multiple;

                // 回显数据
                if (selectData) {

                    this.selectData = JSON.parse(JSON.stringify(selectData));
                }

                if(queryParams){
                   this.initResourceTree(queryParams)
                }
            },
            elTagClick(tag) {
                this.dataDacktrackingEvents(tag);
            },
            confirmCallback() {
                return  this.selectData;
            },
            getTreeIconTest(){
                return img_10100;
            },

            hasTreeIcon(resType){
                return TREE_IMG_MAPPING[resType] !== void 0;
            },

            getTreeIcon(resType){
                return TREE_IMG_MAPPING[resType];
            },

            // 查询数据
            querySearch(queryString, cb) {
                this.loadingS = true;
                this.visible = true;
                // 先清理掉上次进入时的定时函数，保证队列中只有一个定时函数
                if(this.chacheSearch === this.downSearch) {
                    this.loadingS = false;

                } else {
                    // 缓存查询参数
                    this.chacheSearch = this.downSearch;
                    this.searchData = [];
                    this
                    .resTreeQueryUrl
                    .sender({
                        endNode: this.endNode,
                        resName: this.downSearch,
                        includeResTypes: this.includeResTypes
                    })
                    .then(data => {
                        data.forEach(cur => cur.value = cur.resourceName);
                        data.sort((a,b) => { return a.resourceTypeCode - b.resourceTypeCode})
                        this.searchData = data;
                        this.loadingS = false;
                    })
                }
            },

            //  数据回溯
            dataDacktrackingEvents(value) {

                if (value) {
                    this.dacktrackingAxios
                        .sender({
                            guid: value.guid,
                            resType: value.resType || value.resourceType,
                            readWriteFlag: value.readWriteFlag
                        })
                        .then(data => {
                            // 处理后台返回值根节点拼resType的情况，进行data[0]处理
                            data[0] ={ id: data[0].id.split(';')[0]};
                            this.loadingS = false;
                            this.expandTreeNodeById(data, 0);
                        })
                }
            },

            // 递归展开树节点
            expandTreeNodeById(data, i) {
                this.expendFlag = true;
                if (i >= data.length) {
                    this.loading = false;
                    this.getTreeIns.setCurrentKey(data[data.length - 1]);
                    this.getTreeIns.setChecked(data[data.length - 1], true);
                    //  从selectNodes中拿出当前input定位的数据，判断当前选中值是否为可选值，可选 ？ 赋值给selectData
                    let dataChange = this.getTreeIns.getCheckedNodes().filter(item => {
                        return item.id === data[data.length - 1].id && !item.disabled
                    })
                    if(dataChange.length > 0 && !this.multiple) {
                        this.selectData = dataChange
                    } else {
                        // 重新塞一遍selectData, 去除上面不应该选中的数据
                        this.getTreeIns.setCheckedNodes(dataChange)
                    }

                    this.$nextTick(() => {
                        this.expendFlag = false;
                        this.loading = false;
                        let tree = this.$el.parentNode;
                        let node = this.$el.querySelector('.is-current');
                        let top = node.offsetTop - tree.offsetTop;
                        setTimeout(() => {
                            let scrollbarEl = this.$refs.scroll;
                            scrollbarEl.scrollTop = top
                        }, 500)
                    })

                } else {
                    let {id: nodeId = ''} = data[i++];
                    if (nodeId) {
                        let curNode = this.getTreeIns.getNode(nodeId);
                        if (!curNode) {
                            this.expandTreeNodeById(data, i);
                        } else {
                            return curNode && curNode.expand(() => {
                                this.expandTreeNodeById(data, i);
                            });
                        }
                    }
                }
            },
            handleSelect(value) {
                this.dataDacktrackingEvents(value)
            },
            // 清空表单内容
            clickIcon() {
                this.downSearch = ""
            },

            //  节点被点击时的回调 或选择时触发
            nodeClick(data, node) {
                let checked = this.getTreeIns.getCheckedNodes();
                // 单选模式逻辑
                if(!data.disabled && !this.multiple) {
                    if(checked.length === 0) {
                        this.getTreeIns.setCurrentKey(node.id);
                        this.selectData = [data]
                    } else if (checked[0].id === data.id) {
                        this.getTreeIns.setCurrentKey(node.id);
                        this.selectData = []
                    } else {
                        this.getTreeIns.setCurrentKey(node.id);
                        this.selectData = [data]
                    }
                }
                 else if(this.multiple && !data.disabled) {
                    const find = this.selectData.find(item => {
                      return item.guid === data.guid
                    })
                    if(find) {
                        this.selectData.forEach((item,index )=> {
                            if(item.guid === data.guid) {
                                this.selectData.splice(index,1)
                            }
                        })

                    } else {
                        this.selectData.push(data)
                    }
                }
            },
            check(data,node) {
                // 获取树上checked节点
                let checked = this.getTreeIns.getCheckedNodes();

                // 单选模式逻辑
                if(!this.multiple) {
                    if(checked.length >= 2) {
                        this.getTreeIns.setCurrentKey(node.id);
                        this.selectData = [data]
                    } else {
                        this.getTreeIns.setCurrentKey(node.id);
                        this.selectData = checked
                    }
                } else {
                    const find = this.selectData.find(item => {
                      return item.guid === data.guid
                    })
                    if(find) {
                        this.selectData.forEach((item,index )=> {
                            if(item.guid === data.guid) {
                                this.selectData.splice(index,1)
                            }
                        })

                    } else {
                        this.selectData.push(data)
                    }
                }
            },
            // 初始化树
            initResourceTree(queryParams) {

                this
                    .resTreeQueryUrls = new MsuiAxios({
                    url: resTreeQueryUrl,
                });
                this
                    .resTreeQueryUrls
                    .sender(queryParams)
                    .then(data => {

                        data.forEach(item => {

                            // 单选模式，系统文件夹节点不可选
                            if(item.nodeType == null) {
                                item.disabled = true;
                            }

                            // 用户是否配置了可选择的节点
                            if(this.selectResType.length > 0) {
                                let flag = true;
                                this.selectResType.forEach(selectRs => {
                                    if(item.resType.indexOf(selectRs) >=0) {
                                        flag = false
                                    }
                                })
                                item.disabled = flag;

                            // 用户没设置，所有节点都可选
                            } else {
                                item.disabled = false;
                            }

                        });
                        this.data = data;
                        this.loading = false;

                        // 设置上次已选择数据
                        this.$nextTick(() => {
                            this.$refs.tree.setCheckedNodes(this.selectData);
                        })

                    })
            },
            // 懒加载方法
            loadNode(node, resolve) {
                this.loading = true;
                const hasSelectResType = this.selectResType.length;
                if (node.level === 0) {
                    return resolve([{name: this.twodata}]);
                }
                const data = node.data;
                // 懒加载树接口
                this
                    .resTreeQueryUrls
                    .sender({
                        includeResTypes: this.includeResTypes,
                        readWriteFla: data.readWriteFla,
                        nodeType: data.nodeType,
                        resType: data.resType,
                        guid: data.guid,
                        endNode: this.endNode
                    })
                    .then(data => {
                        data.forEach(item => {

                            const selectResType = this.selectResType;

                            if (item.name === null) {
                                item.name = "(空)"
                            }

                            if (item.nodeType !== null){
                                // 单选模式，系统文件夹节点不可选
                                item.disabled = true;

                                // 用户设置了selectResType, 进行不可选设置
                            } else if(hasSelectResType){
                                let flag = true;
                                selectResType.forEach(selectRs => {
                                    if(item.resType.indexOf(selectRs) >=0) {
                                        flag = false
                                    }
                                })
                                item.disabled = flag;
                            }
                            else {
                                // 用户没设置，默认所有节点都可选

                                item.disabled = false
                            }
                        });
                        resolve(data);

                        if(!this.expendFlag) {
                            this.loading = false;
                        }
                    });
            },
        },
        watch: {
            data() {
                this.dataDacktrackingEvents(this.dataDacktracking)
            },
            selectData() {
                this.$refs.tree.setCheckedNodes(this.selectData);
            }
        },
        mounted() {
         this.currentWidth = this.$refs.input.$el.offsetWidth -20;
        },
    }
</script>

<style>
    .pop-content {
        min-height: 5vh;
        max-height: 45vh;
        overflow: auto;
        cursor: pointer;
        .pop-item {
            padding: 8px 0;
            overflow: hidden;
            display: flex;
            &:hover {
                background: #1ca8bc;
                color: white;
            }
            .name {
                white-space: nowrap;
                width: 80%;
                text-overflow: ellipsis;
                display: inline-block;
                overflow: hidden;
            }
            .el-tag {
                margin-right:5px;
                margin-left:10px;
                overflow: hidden;
            }
        }
    }
    .resourceTree-autocomplete {
        li {
            position: relative;
            padding: 7px 20px;

            img{
                position: absolute;
                left: 10px;
                top: 8px;
            }

            .autocomplete-container{
                margin-left: 0px !important;
                cursor: pointer;
                .name {
                    /*font-weight: 600;*/
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
                .descr {
                    font-size: 12px;
                    color: #b4b4b4;
                }

                .highlighted .descr {
                    color: #ddd;
                }

            }
        }
    }

    .resource-tree-custom-node{
        display: inline-block;
        width: 100%;
        img, span{
            vertical-align: middle;
        }
    }
    .resource-tree-custom-node.notAllowed{
        cursor: not-allowed;
        color: #8d8888;
    }
</style>
