/**
 * msui-opencomponent-util 打开组件工具类
 * Created by Cooper 2020-5-20 10:47:05
 */

'use strict';

import MsuiUtil from "./msui-util";
import MsuiEventCenter from './msui-event-center'
import MsuiRouter from './msui-route-manager'
import MsuiDialog from './../../msui-element/source/msui-dialog'
import MsuiStore from '../../msui-common/source/msui-store'
import {MSUI_OPEN_COMPONENT_UTIL_CONSTANT} from '../../msui-common/source/msui-constant'
import {_errorFactory} from "../../msui-common/source/_self-util";

const _error = _errorFactory(MSUI_OPEN_COMPONENT_UTIL_CONSTANT);

const _dialog_cache = new Map();
let dialog = null;

class MsuiOpenComponentsUtil extends MsuiUtil {

    static _pluginName = 'MsuiOpenComponentsUtil';

    /**
     * @param title {string} 标题
     * @param url {string} url地址
     * @param contentType {boolean} 加载组件类型 参考 MsuiStore.MSUI_OPENCOMPONENT_CONSTANT.CONTENT_TYPE
     * @constructor
     */
    static openTab(options = {}){
        options.contentType = options.contentType || MsuiStore.MSUI_OPENCOMPONENT_CONSTANT.CONTENT_TYPE.content;

        let component = MsuiRouter.getComponent(options.path);
        if(!component){
            _error(MSUI_OPEN_COMPONENT_UTIL_CONSTANT.NO_SUCH_COMPONENT);
            return;
        }
        MsuiEventCenter.subscribe('createTab', {tabName: options.title, path: options.path});
    }

    /**
     * 创建弹框msui内置element
     * @param options {obj} 常考MsuiDialog
     * @constructor
     */
    static openElementDialog(options = {}){
        options.CONTENT_TYPE = MsuiStore.MSUI_OPENCOMPONENT_CONSTANT.CONTENT_TYPE.element;
        return this.openDialog(options);
    }

    /**
     * 创建外部页面弹框
     * @param options {obj} 常考MsuiDialog
     * @constructor
     */
    static openOuterDialog(options = {}){
        options.CONTENT_TYPE = MsuiStore.MSUI_OPENCOMPONENT_CONSTANT.CONTENT_TYPE.outer;
        return this.openDialog(options);
    }

    /**
     * 创建组件弹框
     * @param options {obj} 常考MsuiDialog
     * @constructor
     */
    static openComponentDialog(options = {}){
        options.CONTENT_TYPE = MsuiStore.MSUI_OPENCOMPONENT_CONSTANT.CONTENT_TYPE.component;
        return this.openDialog(options);
    }

    /**
     * 创建html内容弹框
     * @param options {obj} 常考MsuiDialog
     * @constructor
     */
    static openContentDialog(options = {}){
        options.CONTENT_TYPE = MsuiStore.MSUI_OPENCOMPONENT_CONSTANT.CONTENT_TYPE.content;
        return this.openDialog(options);
    }

    static openDialog(options = {}){
        options.el = options.el ||  '#'+MsuiStore.MSUI_OPENCOMPONENT_CONSTANT.DEDAULT_DIALOG_ID;
        dialog = _dialog_cache.get(options.el);
        if(dialog){
            dialog.open(options);
        }else{

            const renderEle = document.querySelector(options.el);

            if(!renderEle){
                let domId = options.el;
                const dom = document.createElement('div');
                const splitFlagIdx = options.el.indexOf('#');
                if(splitFlagIdx > -1){
                    domId = options.el.substring(splitFlagIdx + 1, options.el.length);
                }
                dom.id = domId;
                document.body.appendChild(dom);
            }

            dialog = new MsuiDialog(options).render();
            _dialog_cache.set(options.el,dialog);
        }
        return dialog;
    }

    static install(MsuiUtil) {
        MsuiUtil[this._pluginName] = MsuiOpenComponentsUtil;
    }
}

export default MsuiOpenComponentsUtil;
