/**
 * 文件名：msui-datagrid-column-list-config
 * 版权：Copyright by nari
 * 描述：表格组件列显示/隐藏控制插件 [基于el-datagrid实现]
 * 修改人：Cooper
 * 修改时间：2020/5/13
 * 修改内容：
 */
import _ from 'lodash'
import MsuiFragment from "../msui-fragment-new";
import MsuiNotify from "../../msui-util/source/msui-notify"
import MsuiMessageBox from "../../msui-util/source/msui-messagebox";


export default class MsuiDatagridColumnListConfig extends MsuiFragment {

     constructor({dataGridModel = [], cacheKey = null, comfirmFun = null, ob} = {}) {
         super();

         this.columListConfigViewKey = 1;

         //全选状态
         this.checkAll = false;

         //半选中状态
         this.isIndeterminate = true;

         //数据源
         this.gridData = [];

         //表格列模型
         this.dataGridModel = dataGridModel;

         //列选择面板展示状态
         this.dialogTableVisible = false;

         // 是否调整过列顺序
         this.isOrderColumn = false;

         this.displayKey = cacheKey + '_display';
         this.sortKey = cacheKey + '_sort';

         ob.publish('set-column-config-key', this.sortKey, this.displayKey);

         //初始化表格
         this.initGrid();

         let {
             scopeIns: {
                 methods: curMethod = {}
             }
         } = this._fragScope;

         const classIns = this;

         curMethod.refreshData = () => {
             this.dialogTableVisible = true;
             this.initGrid();
         };

         curMethod.cancelColumnConfig = () => {
             this.dialogTableVisible = false;
             this.isOrderColumn = false;
             if(this.cacheResetFlag){
                 delete this.cacheResetFlag;
             }
         };

         //保存列配置
         curMethod.saveColumnConfig = () => {
             var hasShowItem = this.gridData.some(item => {
                 return item.showItem === true;
             });

             if (!hasShowItem) {
                 MsuiNotify.info("表格至少选择一列展示！", "提示");
                 return;
             }

             this.dialogTableVisible = false;
             localStorage.setItem(this.displayKey, JSON.stringify(this.gridData));

             this.gridData.forEach((item) => {
                 this.dataGridModel[item.name].showItem = item.showItem;
             });

             // 需要对列进行排序
             if(this.isOrderColumn){
                 const sortFields = this.gridData.map(cur => cur.name);
                 localStorage.setItem(this.sortKey, JSON.stringify(sortFields));

                 // 对表格进行排序
                 this.dataGridModel.orderColumns(sortFields);
                 this.isOrderColumn = false;
             }

             // 重置缓存中的列配置信息
             if(this.cacheResetFlag){
                 this.resetStorageFields(this.cacheResetFlag);
             }

             MsuiNotify.success('保存成功！');

             //确定按钮回调函数
             if (_.isFunction(comfirmFun)) {
                 comfirmFun(this.gridData);
             }
         };

         //勾选、取消
         curMethod.handleCheckChange = (val) => {
             this.checkSelectStatus();
         };

         // 列移动
         curMethod.move = (type, row) => {
             this.isOrderColumn = true;

             // 上移
             if(type === 'up') {
                 this.gridData.forEach((item,index) => {
                     if (item.label === row.label && index !== 0) {
                         this.gridData.splice(index, 1,this.gridData[index -1]);
                         this.gridData[index -1] = row
                     }
                 })
             }

             // 置顶
             else{
                 this.gridData.forEach((item,index) => {
                    if (item.label === row.label && index !== 0) {
                        this.gridData.splice(index, 1);
                        this.gridData.unshift(row)
                    }
                })
             }
         };

         curMethod.resetFields = (type) => {

             MsuiMessageBox.confirm({
                 message: '是否需要重置列配置信息？'
             })
                 .then(() => {
                     classIns.resetSelfFields(type);
                 })
                 .catch(() => {});
         };
         //全选、取消
         curMethod.handleCheckAllChange = (val) => {
             this.checkAll = val;
             this.isIndeterminate = false;
             if (this.checkAll) {
                 this.gridData.forEach((item) => {
                     item.showItem = true;
                 })
             } else {
                 this.gridData.forEach((item) => {
                     item.showItem = false;
                 })
             }
         }
     }

     // 重置缓存中的字段数据
     resetStorageFields(type){
         if(type === 'display'){
             localStorage.removeItem(this.displayKey);
         }else if(type === 'sort'){
             localStorage.removeItem(this.sortKey);
         }else{
             localStorage.removeItem(this.displayKey);
             localStorage.removeItem(this.sortKey);
         }

         delete this.cacheResetFlag;
     }

     // 重置该组件本身需要用到的字段数据
     resetSelfFields(type){

         const originFields = this.dataGridModel.getOriginColumnsConfig();

         // 重置隐藏显示
         if(type === 'display'){
             this.gridData.forEach((curData) => {
                 const originData = originFields.filter(originData => originData.name === curData.name);
                 if(originData.length > 0 && curData.showItem !== originData[0].showItem){
                     curData.showItem = originData[0].showItem;
                 }
             });
         }

         // 重置排序
         else if(type === 'sort'){
             this.gridData.sort((a, b) => {
                 return originFields.findIndex(cur => cur.name === a.name)
                     - originFields.findIndex(cur => cur.name === b.name);
             });
         }

         // 重置所有
         else{
             this.gridData = originFields;
         }

         if(type === 'sort' || type === 'all'){
             this.isOrderColumn = true;
         }

         this.cacheResetFlag = type;
     }

     initGrid = () => {

         const gridData = this.gridData = [];

         // 从缓存中读取 隐藏/显示 信息
         const originColumnList = this.dataGridModel.getOriginColumnsConfig(),
               cacheColumnList = JSON.parse(localStorage.getItem(this.displayKey));

         // 缓存中存在列配置并且数量与原始配置一致，则使用缓存的数据
         if(cacheColumnList
             && cacheColumnList.length === originColumnList.length){
             this.gridData = cacheColumnList;
         }
         else{
             this.gridData = originColumnList;
         }


         // 从缓存中读取 排序 信息
         const sortList = JSON.parse(localStorage.getItem(this.sortKey));
         if(sortList && sortList instanceof Array){

             if(gridData.length !== sortList.length){
                 return console.warn('[MsuiDataGridColumnConfig]: 缓存中的排序字段与实际字段不匹配');
             }

             // 对gridData进行排序
             gridData.sort((a, b) => {
                 return sortList.indexOf(a.name) - sortList.indexOf(b.name);
             });
         }

         //检查选中状态
         this.checkSelectStatus();
     };

     //检查是否多选状态
     checkSelectStatus = () => {
         this.isIndeterminate = !(this.gridData.every(item => item.showItem === true) || this.gridData.every(item => item.showItem === false))
         this.checkAll = this.gridData.every(item => item.showItem === true);
     };


     render() {
         const dataPath = super.getDataPath(),
             methodPath = super.getMethodPath();

         let template = `
             <div :key="${dataPath}.columListConfigViewKey">
                 <i style="cursor: pointer;" 
                     slot="reference" 
                     class="icon-setup"
                     @click="${methodPath}_refreshData" />
                 <el-dialog title="列配置" width="450px"
                     :modal="false"
                     :visible.sync="${dataPath}.dialogTableVisible"
                     :close-on-click-modal="false">
                   <el-table size="mini" max-height="500"
                     msuiRef
                     align="center"
                     :resizable = "true"
                     :data="${dataPath}.gridData"      
                     :highlight-current-row="true"
                     
                     :stripe="true"
                     :border="true">
                     <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
                    
                     <el-table-column property="showItem" width="50" align="center">
                       <template slot-scope="{row}">
                             <el-checkbox v-model="row.showItem" @change="${methodPath}_handleCheckChange"></el-checkbox>
                         </template>
                         <template slot="header" slot-scope="scope">
                             <el-checkbox :indeterminate="${dataPath}.isIndeterminate" v-model="${dataPath}.checkAll" @change="${methodPath}_handleCheckAllChange"></el-checkbox>
                         </template>
                     </el-table-column>
                     
                     <el-table-column property="label" label="配置项"></el-table-column>
                     <el-table-column width="70" label="上移" align="center">
                        <template slot-scope="{row}">
                            <i @click="() => {${methodPath}_move('up', row)}" class="el-icon-top" style="color:#1ca8bc;cursor:pointer;"></i>                        
                        </template>
                     </el-table-column>
                    
                     <el-table-column width="70" label="置顶" align="center">
                        <template slot-scope="{row}">
                            <i @click="() => {${methodPath}_move('top', row)}" style="cursor:pointer;" class="icon-align-top"></i>
                        </template>
                     </el-table-column>
                   </el-table>
                   
                   <div slot="footer" class="dialog-footer">
                        <el-dropdown style="float: left;" @command="${methodPath}_resetFields">
                            <el-button type="danger">
                                重置<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="display">
                                    <i class="el-icon-view"></i>
                                    恢复显示配置
                                </el-dropdown-item>
                                <el-dropdown-item command="sort">
                                    <i class="el-icon-sort"></i>
                                    恢复排序配置
                                </el-dropdown-item>
                                <el-dropdown-item command="all">
                                    <i class="el-icon-refresh"></i>
                                    恢复所有配置
                                </el-dropdown-item>
                            </el-dropdown-menu>
                         </el-dropdown>
                         
                         <el-button @click="${methodPath}_cancelColumnConfig" style="margin-left: 10px;">取 消</el-button>
                         <el-button type="primary" @click="${methodPath}_saveColumnConfig">确 定</el-button>
                   </div>
                   
                 </el-dialog>
             </div>`;

         return super.render(template);
     }
 }
