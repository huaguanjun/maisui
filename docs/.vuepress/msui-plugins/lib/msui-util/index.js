import MsuiElement from './../msui-element/source/msui-element'
import MsuiUtil from './source/msui-util'

import MsuiAxios from './source/msui-axios'
import MsuiNotify from './source/msui-notify'
import MsuiMsg from './source/msui-msgbox'
import MsuiLoading from './source/msui-loading'
import MsuiRouteManager from './source/msui-route-manager'
import MsuiOpenComponentsUtil from './source/msui-opencomponent-util'
import MsuiEventCenter from './source/msui-event-center'
import MsuiInterval from './source/msui-interval'
import MsuiStorage from './source/msui-storage'
import MsuiMicroAdapter from './source/msui-microAdapter'

import NormalAdapter from './source/subMicroAdapters/NormalAdapter'
import QianKunAdapter from './source/subMicroAdapters/QianKunAdapter'

MsuiMicroAdapter.use(NormalAdapter);
MsuiMicroAdapter.use(QianKunAdapter);

import './source/msui-util-common'
/**
 * MsuiNotify 配置 与 集成
 * */
MsuiUtil.add(MsuiNotify);

/**
 * MsuiMessageBox 配置 与 集成
 */
MsuiUtil.add(MsuiMsg);

/**
 * MsuiLoading 配置 与 集成
 */
MsuiUtil.add(MsuiLoading);


/**
 * MsuiOpenComponentsUtil 配置 与 集成
 */
MsuiUtil.add(MsuiOpenComponentsUtil);


/**
 *
 * MsuiAxios 配置 与 集成
 *
 * 默认Axios请求模板配置
 *
 * * 请求参数配置
 * * 拦截器参数配置
 *
 * **/
MsuiUtil.add(MsuiAxios, {
    options: {
        baseURL: 'http://localhost:8080/ui'
    },
    interceptors: {
        reqSuc(request) {
            //request.headers.common['token'] = localStorage ? localStorage.getItem('token') || '' : '';
            return request;
        },
        resSuc(response) {
            return response.data;
        },
        resErr(err) {
            return console.error(err);
        }
    }
});

MsuiElement['MsuiUtil'] = MsuiUtil;

export default MsuiUtil;

export {
    MsuiMicroAdapter,
    MsuiStorage,
    MsuiAxios,
    MsuiInterval,
    MsuiNotify,
    MsuiLoading,
    MsuiMsg,
    MsuiRouteManager,
    MsuiEventCenter,
    MsuiOpenComponentsUtil
}
