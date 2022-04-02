/**
 * element-ui 通知组件封装
 * Created by liangwenzheng on 2020-02-14
 */

'use strict';


import MsuiUtil from './msui-util'
import {Notification} from 'element-ui'

const _defaultTitle = '提示';

class MsuiNotify extends MsuiUtil {

    static _pluginName = 'Notify';

    /**
     *
     * @param title { string } 通知标题
     * @param message { string } 通知正文
     * @param dangerouslyUseHTMLString { boolean } 是否使用html片段
     * @param type {string} 通知类型 可选：success/warning/info/error
     * @param iconClass {string} 自定义图标 如果设置type则忽略该属性
     * @param customClass {string} 自定义类名
     * @param duration {number} 显示时间, 毫秒。设为 0 则不会自动关闭
     * @param position {string} 自定义弹出位置 top-right/top-left/bottom-right/bottom-left
     * @param showClose {boolean} 是否显示关闭按钮
     * @param onClose {function} 点击 关闭 时的回调函数
     * @param onClick {function} 点击 通知 时的回调函数
     * @param offset {number} 偏移的距离
     * @constructor
     */
    static Notify({
                      title = '提示',
                      message = '',
                      dangerouslyUseHTMLString = false,
                      type = null,
                      iconClass = '',
                      customClass = '',
                      duration = 3000,
                      position = 'top-right',
                      showClose = true,
                      onClose = null,
                      onClick = null,
                      offset = 0
                  } = {}) {

        Notification({
            title,
            message,
            dangerouslyUseHTMLString,
            type,
            iconClass,
            customClass,
            duration,
            position,
            showClose,
            onClose,
            onClick,
            offset
        });
    }

    static success(content, title = _defaultTitle, options) {
        return Notification.success({
            title,
            message: content,
            ...options
        });
    }

    static error(content, title = _defaultTitle, options) {
        return Notification.error({
            title,
            message: content,
            ...options
        });
    }

    static info(content, title = _defaultTitle, options) {
        return Notification.info({
            title,
            message: content,
            ...options
        });
    }

    static warning(content, title = _defaultTitle, options) {
        return Notification.warning({
            title,
            message: content,
            ...options
        });
    }

    static install(MsuiUtil) {
        MsuiUtil[this._pluginName] = this.Notify;
    }
}

export default MsuiNotify;