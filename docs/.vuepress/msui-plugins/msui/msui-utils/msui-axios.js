import axios from "axios";
import qs from 'qs';

export class MsuiAxios {
    constructor({
        url = '',
        method = 'get',
        data = {},
        headers = {}
    }) {
        this.data = data
        this.method = method
        this.url = url
        this.headers = headers
        this.sendConfig = {
            url,
            method,
            headers
        }
    }
    /**
     * 
     * @param {*} params 
     * @returns axios 请求发送
     */
    sender(params) {
        if (params) {
            this.data = params
        }
        if (this.method === 'get') {
           this.sendConfig.params = this.data
        } else {
            this.sendConfig.data = qs.stringify(this.data)
        }
        return axios(this.sendConfig)
    }
    
    /**
     ** 并发请求
     * @param {*} list MsuiAxios s实例 sender 方法执行
     * @return { Promsise } 
     * 
     */

    static all(list) {
       return axios.all(list)
    }

    /**
     * 
     * @param {*} opts Object
     *  axios 请求的一些通用设置
     */
    static setDefault(opts) {
        for(let key in opts) {
            axios[key] = opts[key]
        }
    }

    /**
     * 
     * @param {*} opt Object
     * @returns instance
     */
    static create(opt) {
        return axios.create(opt)
    }

    /**
     * 
     * @param {*} request //请求拦截器
     * @param {*} responce // 响应拦截器
     */
    static setInterceptors(request,responce) {
        if(request) {
            axios.interceptors.request.use(request)
        }
        if(responce) {
            axios.interceptors.request.use(request)
        }
    }
}

export default MsuiAxios