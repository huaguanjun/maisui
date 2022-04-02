/**
 * element-ui 通知组件封装
 * Created by liangwenzheng on 2020-02-18
 */

'use strict';

import MsuiUtil from './msui-util'
import {MessageBox} from 'element-ui'

class MsuiMessageBox extends MsuiUtil {

    static _pluginName = 'MsgBox';
    /**
     *
     * @param title {string} 消息框标题
     * @param message {string}  消息框内容
     * @param dangerouslyUseHTMLString {boolean} 是否使用html片段
     * @param type {string}
     * @param iconClass {string}
     * @param customClass {string}
     * @param callback {function}
     * @param showClose {boolean}
     * @param beforeClose {function}
     * @param distinguishCancelAndClose {boolean}
     * @param lockScroll {boolean}
     * @param showCancelButton {boolean}
     * @param showConfirmButton {boolean}
     * @param cancelButtonText {string}
     * @param confirmButtonText {string}
     * @param cancelButtonClass {string}
     * @param confirmButtonClass {string}
     * @param closeOnClickModal {boolean}
     * @param closeOnPressEscape {boolean}
     * @constructor
     */
    static MsgBox({
                      title = '',
                      message = '',
                      dangerouslyUseHTMLString = false,
                      type = '',
                      iconClass = '',
                      customClass = '',
                      callback = null,
                      showClose = true,
                      beforeClose = null,
                      distinguishCancelAndClose = false,
                      lockScroll = true,
                      showCancelButton = true,
                      showConfirmButton = true,
                      cancelButtonText = '取消',
                      confirmButtonText = '确定',
                      cancelButtonClass = '',
                      confirmButtonClass = '',
                      closeOnClickModal = false,
                      closeOnPressEscape = false,
                  } = {}) {
        return MessageBox({
            title,
            message,
            dangerouslyUseHTMLString,
            type,
            iconClass,
            customClass,
            callback,
            showClose,
            beforeClose,
            distinguishCancelAndClose,
            lockScroll,
            showCancelButton,
            showConfirmButton,
            cancelButtonText,
            confirmButtonText,
            cancelButtonClass,
            confirmButtonClass,
            closeOnClickModal,
            closeOnPressEscape
        })
    }

    static confirm(
        {
            title = '提示',
            message,
            type = 'info'
        } = {}){

        return MessageBox.confirm(message, title, {
            type
        });
    }

    static install(MsuiUtil) {
        MsuiUtil[this._pluginName] = this.MsgBox;
    }
}

export default MsuiMessageBox
