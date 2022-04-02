import {_addAxiosReturnIns, _error} from "../../msui-common/source/_self-util";
import MsuiNotify from "../../msui-util/source/msui-notify";
import {MSUI_DATAGRID_CONSTANT} from "../../msui-common/source/msui-constant";
import MsuiAxios from "../../msui-util/source/msui-axios";
import MsuiMsg from "../../msui-util/source/msui-msgbox";
import MsuiButton from "../msui-base-components/msui-button";
import _ from "lodash";

// 模块委托 - 导出
const EXPORTER_BTNS = [
    {text: '导出全部', value: '0'},
    {text: '导出本页', value: '1'},
    // {text: '导出选中', value: '2'},
    {text: '导出模板', value: ''}
];

const PLUGIN_NAME = 'MsuiDataGridModularProxy';
export default class MsuiDataGridModularProxy{
    constructor(props = {}) {

    }

    createLoader(loader, options = {}){

        const {loadSuc, loadErr} = options;

        if(!loader.url){
            return _error(PLUGIN_NAME, 'loader.url未定义或格式不是string');
        }

        this.loader = _addAxiosReturnIns(loader, loadSuc, loadErr);
        return this.loader;
    }

    createDeleter(deleter, options){

        const deleterIns = this.deleter = {};
        const visibleFun = deleter.visible;

        const {deleteSuc, deleteErr, getPrimaryColumn, getSelection} = options;

        const delAxiosIns = deleterIns.deleter = new MsuiAxios({
            url: deleter.url,
            method: 'post',
            lazySuc: [
                deleteSuc,
                deleter.success
            ],
            lazyErr: [
                deleteErr,
                deleter.error
            ]
        });
        deleterIns.axiosIns = delAxiosIns;

        deleterIns.sendPost = data => {
            let resultData = {ids: ''};

            if (deleter.before) {
                const userCustomData = deleter.before(data);
                if (userCustomData instanceof Array)
                    resultData.ids = JSON.stringify(userCustomData);
                else if (typeof userCustomData === 'string')
                    resultData.ids = userCustomData;
            } else {
                const primaryKey = getPrimaryColumn();
                if (!primaryKey) {
                    return _error(MSUI_DATAGRID_CONSTANT.MODEL_NAME,
                        MSUI_DATAGRID_CONSTANT.NO_SUCH_PRIMARY_KEY);
                }

                resultData.ids = JSON.stringify(data.map(cur => cur[primaryKey]));
            }

            if (!resultData){
                return _error(MSUI_DATAGRID_CONSTANT.MODEL_NAME,
                    MSUI_DATAGRID_CONSTANT.BEFORE_METHOD_RETURN_ERROR);
            }

            delAxiosIns.sender(resultData);
        };

        // 全局删除按钮
        if (deleter.globalShowRule !== false) {

            // 删除按钮
            deleterIns.btnIns = new MsuiButton({
                size: 'mini',
                text: '删除',
                icon: 'el-icon-delete',
                clickHandler: () => {
                    let selections = getSelection(),
                        deleteList = selections, excludeList = [];

                    // 过滤删除数据
                    if(_.isFunction(visibleFun)){
                        deleteList = selections.filter( (selection, idx) => {
                            if(visibleFun(selection)){
                                return true;
                            }else{
                                excludeList.push(idx + 1);
                                return false;
                            }
                        });
                    }

                    // 删除
                    if (deleteList.length > 0) {

                        this
                            .confirmDelete(deleteList, excludeList)
                            .then(() => {
                                deleterIns.sendPost(deleteList);
                            });

                    } else
                        MsuiNotify.info('请选择需要删除的数据', '提示');
                }
            });
        }

        // 行内删除按钮
        if (deleter.visible !== false) {
            deleterIns.inlineBtn = {
                icon: 'el-icon-delete',
                text: '删除',
                visible: deleter.visible || function () {
                    return true
                },
                clickHandler: (index, row) => {
                    this.confirmDelete([row])
                        .then(() => {
                            deleterIns.sendPost([row]);
                        });
                }
            }
        }

        return deleterIns;
    }

    createExporter(exporter, options = {}){

        const {getSelection, getPrimaryColumn, getQueryParams, getData, setLoading} = options;

        const exporterIns = this.exporter = {};

        const axiosIns = exporterIns.axiosIns = new MsuiAxios({
            url: exporter.url,
            data: exporter.data || {resType: ''},
            responseType: 'blob',
            useSimpTemplate: 'EXPORT4DG'
        });

        exporterIns.btnIns = {
            icon: 'el-icon-download',
            target: '导出',
            type: 'dropdown',
            data: _.merge([], EXPORTER_BTNS),
            clickHandler: (itemValue) => {

                setLoading(true);

                let exportParams = {},
                    pk = getPrimaryColumn();

                if(itemValue === '0'){
                    exportParams = getQueryParams();
                }else if(itemValue === '1' || itemValue === '2'){
                    const gridData = itemValue === '1' ? getData() : getSelection();
                    exportParams.ids = JSON.stringify(gridData.map( row => (row[pk] || '')));
                }
                exportParams.exportStyle = itemValue;

                axiosIns
                    .sender(exportParams)
                    .then( response => {
                        const content = response.data,
                            headers = response.headers;

                        let fileName = '导出数据_' +new Date() + '.xlsx';

                        const fileNameReg = /filename="(?<fileName>.*?)"/;

                        if(headers.hasOwnProperty('content-disposition')){
                            const regResult = fileNameReg.exec(headers['content-disposition']);
                            if(regResult.groups && regResult.groups.fileName){
                                fileName = decodeURIComponent(regResult.groups.fileName) + '.xlsx';
                            }
                        }

                        setLoading(false);

                        // const content = response.data;
                        let elink = document.createElement("a");
                        elink.download = fileName;
                        elink.style.display = "none";
                        let blob = new Blob([content]);
                        elink.href = URL.createObjectURL(blob);
                        document.body.appendChild(elink);
                        elink.click();
                        document.body.removeChild(elink);
                    });
            }
        };

        return exporter;
    }



    confirmDelete(selections, excludeList) {
        let excludeListInfo = '';
        if(excludeList instanceof Array && excludeList.length > 0){
            excludeListInfo = `第 ${excludeList.join(',')} 条数据无法删除，`;
        }

        return MsuiMsg.confirm(`此操作将删除 ${selections.length} 条 数据，${excludeListInfo}是否继续？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
    }

}
