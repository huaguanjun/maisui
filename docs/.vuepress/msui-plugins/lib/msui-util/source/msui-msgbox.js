'use strict';
import {MessageBox} from 'element-ui'
import MsuiUtil from "./msui-util";

export default class MsuiMsg extends MsuiUtil {

    static _pluginName = 'MsuiMsg';

    static alert(content, title = '提示', options) {
        return MessageBox.alert(content, title, options);
    }

    static confirm(content, title = '提示', options) {
        return MessageBox.confirm(content, title, options);
    }

    static prompt(content, title = '提示', options) {
        return MessageBox.prompt(content, title, options);
    }

    static install(MsuiUtil) {
        MsuiUtil[this._pluginName] = this.Notify;
    }

};