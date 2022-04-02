'use strict';

import Axios from 'axios/index'
import _ from 'lodash'
import MsuiUtil from "./msui-util"
import Qs from 'qs'


let instanceTemplate = {};

const MSUI_AXIOS_SENDTYPE = ['get', 'post', 'delete', 'put'].join(',');

const MSUI_AXIOS_ERROR = {
    URL_ERROR: 'url参数接收一个string字符串且不能为空',
    METHOD_ERROR: `method参数必须为 ${MSUI_AXIOS_SENDTYPE} 中的一种`
};
const CONTENT_TYPE_URL_ENCODED = 'application/x-www-form-urlencoded';
const CONTENT_TYPE_JSON = 'application/json';
const CONTENT_TYPE_FORM_DATA = 'multipart/form-data';
const CONTENT_TYPE_CHARSET_UTF8 = 'charset=utf-8';

const CONTENT_TYPE_MAPPING = [
    CONTENT_TYPE_URL_ENCODED,
    CONTENT_TYPE_JSON,
    CONTENT_TYPE_FORM_DATA
];

const _defaultAxiosOptions = {
        paramsSerializer(params) {
            return Qs.stringify(params);
        }
    },
    _getRestParam = function( params = {} ){
        let finalParams = {};

        // 动态获取配置的数据
        if(params && this.lazy && this.lazyParams){
            finalParams = this.lazyParams(params);
        }else{
            finalParams = params;
        }

        let emptyData = {};
        if(typeof this.data === (typeof finalParams)){
            if(_.isArray(finalParams))
                emptyData = [];

            finalParams = _.merge(emptyData, this.data, finalParams);
        }

        // 序列化参数，如果编码方式是 application/json 则使用 JSON.stringify 序列化，否则使用 Qs.stringify 序列化
        if(this.method === 'get'){
            return {params: finalParams};
        }else{
            if(!this.contentType || this.contentType !== 'text/plain'){
                if(new RegExp(CONTENT_TYPE_JSON, 'g')
                    .test(this.contentType ? this.contentType.toLowerCase() : '')){
                    finalParams = JSON.stringify(finalParams);
                }else{
                    finalParams = Qs.stringify(finalParams)
                }
            }

            return {
                data: finalParams
            }
        }
    },
    _getRestOptions = function(){

        let curRequestOptions = {
            responseType: this.responseType
        };

        // 处理基本配置
        curRequestOptions.url = this.url;
        curRequestOptions.method = this.method;

        // 如果没有配置 POST 请求的编码方式，则使用 urlencoded 方式进行编码
        if(this.method === 'post'){
            curRequestOptions.headers = {'Content-Type': this.contentType ?? CONTENT_TYPE_URL_ENCODED + ';' + CONTENT_TYPE_CHARSET_UTF8};
        }

        // CancelToken 处理
        const token = this.createAxiosCancel(this.needCancel);
        if(token){
            curRequestOptions.cancelToken = token;
        }

        return curRequestOptions;
    },
    _callErrFun = function(err){
        if(this.lazyErr){
            if(_.isFunction(this.lazyErr)) this.lazyErr(err);
            else if(_.isArray(this.lazyErr)){
                this.lazyErr.forEach( curFun => _.isFunction(curFun) && curFun(err));
            }
        }
    },
    _sendLazy = function( axiosResult ){
        return axiosResult
            .then(
                res => this.lazySuc ? this.lazySuc(res) : res
            )
            .catch(
                err => _callErrFun.call(this, err)
            )
    },
    _sendLazyList = function( axiosResult, i ){
        if(this.lazySuc[i] || this.lazyErr[i]){
            let idx = i;
            const curResult = axiosResult
                .then(res => {
                    this.lazySuc[idx] && this.lazySuc[idx](res);
                    return res;
                });
            return _sendLazyList.call(this, curResult, ++i);
        }else
            return axiosResult;
    },
    _addLazy = function(token, callback){
        if(callback){
            let lazyScope = this[token];
            if(!lazyScope){
                this[token] = callback;
                this.lazy = true;
            }else{
                if(_.isArray(lazyScope))
                    lazyScope.push(callback);
                else this[token] = [lazyScope, callback];
            }
        }
    };

const sourceFactory = function(){
    return Axios.CancelToken.source();
};

/**
 *
 * MsuiAxios
 * @author sq
 *
 * TODO: 封装下载文件功能，暴露接口
 * TODO: 为 请求模板 构造模型类
 *
 * @example 单发、并发请求示例
 * let ax1 = new MsuiAxios({
 *   url: 'http://127.0.0.1:8080/server/vue/getMethodTest',
 *   data: {
 *       userId: '1',
 *       userName: '王1'
 *   }
 * });
 *
 * let ax2 = new MsuiAxios({
 *   url: 'http://127.0.0.1:8080/server/vue/getMethodTest',
 *   data: {
 *       userId: '2',
 *       userName: '王2'
 *   }
 * });
 *
 * console.log('='.repeat(10));
 * MsuiAxios.sender( ax1, ax2 )
 *   .then(function( result ){
 *     console.log(result);
 * });
 *
 *
 * @example 懒请求示例
 * let treeGridAxios = new MsuiAxios({
 *   url: 'vue/getTreeData',
 *   lazyParams(node){
 *     return {
 *       id: node.id
 *     }
 *   },
 *   lazySuc(data){
 *     return data;
 *   }
 * })
 *
 * new MsuiTree({
 *     load: treeGridAxios
 * }).render()
 *
 * */

class MsuiAxios extends MsuiUtil {

    static _pluginName = 'MsuiAxios';

    constructor({url,
                    contentType=null,
                    method = 'get',
                    data = null,
                    useSimpTemplate = 'DEFAULT',
                    responseType = '',
                    lazyParams = null,
                    lazySuc = null,
                    lazyErr = null,
                    cancel = false} = {}) {

        super();

        if(!(_.isString(url)) || url === '')
            return console.error(MSUI_AXIOS_ERROR.URL_ERROR);

        if (!(_.isString(url))
            || !(MSUI_AXIOS_SENDTYPE.includes(method.toLowerCase())))
            return console.error(MSUI_AXIOS_ERROR.METHOD_ERROR);

        // this.cancelToken = cancelToken;

        this.url = url;
        this.data = data;
        this.responseType = responseType;
        this.contentType = contentType;
        this.method = method.toLowerCase();
        this.lazyParams = lazyParams;
        this.lazySuc = lazySuc;
        this.lazyErr = lazyErr;
        this.needCancel = cancel;

        if(_.isFunction(lazySuc) || _.isArray(lazySuc) ||
            _.isFunction(lazyErr) || _.isArray(lazyErr))
            this.lazy = true;

        this.axios = _.isString(useSimpTemplate) && instanceTemplate[useSimpTemplate] ? instanceTemplate[useSimpTemplate] : Axios;

    }

    getUrl(){
        return this.url;
    }

    /**
     * 单发请求
     * */
    sender( params ) {

        const restOptions = _.merge({}, _getRestParam.call(this, params),
            _getRestOptions.call(this));

        let axiosResult = this.axios(restOptions);

        return this.lazy ?
            _.isArray(this.lazySuc) ?
                _sendLazyList.call(this,axiosResult, 0)
                    .catch(err => _callErrFun.call(this, err)) :
                _sendLazy.call(this, axiosResult) : axiosResult;
    }

    cancel(reason){
        this.source && this.source.cancel(reason);
    }

    setCancel(cancel){
        this.needCancel = !!cancel;
    }

    createAxiosCancel(needCancel){

        const prevSource = this.source;

        this.source = Axios.CancelToken.source();

        if(needCancel){
            // 取消上一次请求
            if(prevSource && prevSource.cancel()){
                prevSource.cancel();
            }
        }

        return this.source.token;
    }

    addLazySuc(lazySuc){
        if(_.isFunction(lazySuc))
            _addLazy.call(this, 'lazySuc', lazySuc);
        else if(_.isArray(lazySuc))
            lazySuc.forEach( curSuc => _addLazy.call(this, 'lazySuc', curSuc));
        return this;
    }

    addLazyErr(lazyErr){
        if(_.isFunction(lazyErr))
            _addLazy.call(this, 'lazyErr', lazyErr);
        else if(_.isArray(lazyErr))
            lazyErr.forEach( curErr => _addLazy.call(this, 'lazyErr', curErr));
        return this;
    }

    isLazy(){
        return this.lazy;
    }

    toString() {
        return `${'='.repeat(5)} 
        URL: ${this.url}, 
        METHOD: ${this.method}, 
        DATA: ${JSON.stringify(this.data)} 
        ${'='.repeat(5)}`;
    }


    /**
     *
     * 添加Axios请求模板
     *
     * @static
     *
     *
     * @param name { String } 请求模板名称，唯一键
     * @param options { Object } 请求模板参数配置，参考Axios官方文档
     *
     * @param interceptors {{
     *     reqSuc: { function( request: Object ): Promise },
     *     reqErr: { function( err: Object ): void }=,
     *     resSuc: { function( response: Object ): Promise },
     *     resErr: { function( err: Object ): void }=
     * }} 实例
     *
     * */
    static addAxiosTemplate(name, options = {}, interceptors){
        if (_.isString(name) && name !== '' && name !== 'NONE') {
            if (Object.keys(options).length > 0) {

                const newOptions = _.merge(_defaultAxiosOptions, options);
                let axiosIns = Axios.create(newOptions);

                instanceTemplate[name] = axiosIns;
                MsuiAxios.setInterceptors(axiosIns, interceptors);

                return axiosIns;
            }
        }
    }

    /**
     *
     * 设置 Axios 请求/响应 拦截器
     *
     * @static
     *
     * @param axiosIns { Object } Axios实例
     *
     * @param reqSuc { function( request: Object ): Promise} 请求成功回调函数，接收request为参数，返回Promise
     * @param reqErr { function( err: Object ): void =} 请求失败回调函数，接收err为参数，无需返回，该参数 可选
     * @param resSuc { function( response: Object ): Promise } 响应成功回调函数，接收request为参数，返回Promise
     * @param resErr { function( err: Object ): void =} 响应失败回调函数，接收err为参数，无需返回，该参数 可选
     *
     * */
    static setInterceptors(axiosIns, {reqSuc, reqErr, resSuc, resErr} = {}){

        if (axiosIns) {

            if (_.isFunction(reqSuc)) {
                axiosIns.interceptors.request.use(request => reqSuc(request), err => {
                    _.isFunction(reqErr) && reqErr(err);
                    return Promise.reject(err);
                })
            }

            if (_.isFunction(resSuc)) {
                axiosIns.interceptors.response.use(request => resSuc(request), err => {
                    _.isFunction(resErr) && resErr(err);
                    return Promise.reject(err);
                })
            }
        }
    }

    /**
     *
     * MsuiAxios.sender
     *
     * 并行请求
     *
     * @static
     *
     * @param args { Array<MsuiAxios> } MsuiAxios的实例
     *
     * @return { Promise || undefined } Promise对象，实现Promise.then方法
     *
     * */
    static sender(...args){

        let senders = [], len = args.length;

        if (len === 0) return;

        while (len--) {

            if (args[len] instanceof MsuiAxios) {
                senders.push(args[len].sender());
            }
        }

        if (senders.length <= 1) return;

        return Axios.all(senders).then(
            Axios.spread((...res) => Promise.resolve(res))
        );
    }

    /**
     *
     * MsuiAxios.chainSender
     *
     * 串行请求
     * @static
     *
     * @example 通过设置 lazySuc 与 lazyParams 来完成参数链式传递
     *
     *
     * @param msuiAxiosList { Array<MsuiAxios> } MsuiAxios的实例
     * @param index { Integer =}
     * @param rst { Object =}
     *
     * */
    static async chainSender(msuiAxiosList = [], index = 0, rst){
        if(msuiAxiosList[index] instanceof this){
            let msuiAxios = msuiAxiosList[index++];
            if(msuiAxios.isLazy()){
                let curRst = await msuiAxios.sender(rst);
                return this.chainSender(msuiAxiosList, index, curRst)
            }
        }
    }

    static install(MsuiUtil, {options = {}, interceptors = {}}){
        MsuiUtil[this._pluginName] = MsuiAxios;
        this.addAxiosTemplate('DEFAULT', options, interceptors);
    }

}

export default MsuiAxios;


