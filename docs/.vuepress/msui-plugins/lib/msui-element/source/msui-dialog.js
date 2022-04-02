/**
 * Created by liangwenzheng on 2020-02-17
 */
import _ from 'lodash'
import MsuiElement from "./msui-element"
import {_eachObj} from "../../msui-common/source/_self-util";

const DIALOG_HOOKS = new Set(['confirmCallback', 'openCallback', 'closeCallback']);

/**
 * 触发狗子
 * **/
const triggerHook = function(hookName, params){
    const $refs = this.$refs;
    return new Promise((resolve) => {
        if(_.isString(hookName) && DIALOG_HOOKS.has(hookName)){
            setTimeout(() => {
                const cptRef = $refs.dialogComponent;
                if(cptRef && cptRef.hasOwnProperty(hookName)){
                    resolve(cptRef[hookName](params));
                }else resolve();
            }, 0);
        }else resolve();
    });
};

class MsuiDialog extends MsuiElement {

    static _pluginName = 'MsuiDialog';

    /**
     * @param routerPath 路由地址
     * @param title
     * @param width
     * @param fullscreen
     * @param modal
     * @param modalAppendBody
     * @param showClose
     * @param customClass
     * @param parentData 子组件数据
     * @param content 内容
     * @param openFun
     * @param openedFun
     * @param closeFun
     * @param closedFun
     * @param content
     * @param dialogDrag
     */
    constructor({
                el = '',
                title = '',
                width = '80%',
                destroyOnClose = false,
                fullScreen = false,
                modal = true,
                modalAppendBody = true,
                showClose = true,
                lockScroll = true,
                customClass = '',
                content = null,
                parentData = null,
                closeOnClickModal = false,
                closeOnPressEscape = true,
                appendToBody = true,
                visible = true,
                showFooter = true,
                openFun = null,
                openedFun = null,
                closeFun = null,
                closedFun = null,
                closeComponent = null,
                confirmFun = null,
                dialogDrag = false
            } = {}) {

        super();

        const plCfg = this.msui_plugin_config = {
            el:el,
            confirmFun,
            showFooter,
        };

        let config = this.msui_element_config;

        config.data = {
            title,
            width,
            destroyOnClose,
            fullScreen,
            modal,
            modalAppendBody,
            lockScroll,
            customClass,
            closeOnClickModal,
            closeOnPressEscape,
            appendToBody,
            showClose,
            content,
            parentData,
            isVisible: visible ,
            showFooter,
            dialogDrag
        };

        if (_.isFunction(openFun)) {
            config.methods.openFun = openFun;
        }
        if (_.isFunction(openedFun)) {
            config.methods.openedFun = openedFun;
        }
        if (_.isFunction(closeFun)) {
            config.methods.closeFun = closeFun;
        }
        if (_.isFunction(closedFun)) {
            config.methods.closedFun = closedFun;
        }

        config.methods.dialogConfirmFun = function () {
            triggerHook
                .call(this, 'confirmCallback')
                .then((result) => {
                    if(plCfg.confirmFun){
                        plCfg.confirmFun(result);
                    }
                });

            // if(this.$refs.dialogComponent.dialogCallBackResult)
            //     return confirmFun(this.$refs.dialogComponent.dialogCallBackResult());
            // else
            //     return confirmFun();
        };

        config.methods.openDialog = this.open;
        config.methods.closeDialog = this.close;
    }

    render(el) {
        let pl_conf = this.msui_plugin_config;
        let vue_conf = this.msui_element_config;
        vue_conf.template = `<el-dialog
            msuiRef  
            :title="title"
            :width="width"
            :custom-class="customClass"
            :fullscreen="fullScreen"
            :modal="modal"
            :modal-append-to-body="modalAppendBody"
            :show-close="showClose"
            :visible.sync="isVisible"
            :lock-scroll="lockScroll"
            :close-on-click-modal="closeOnClickModal"
            :close-on-press-escape="closeOnPressEscape"
            :append-to-body="appendToBody"
            :destroy-on-close="destroyOnClose"
            ${vue_conf.data.dialogDrag ? 'v-dialogDrag' : ''}
            ${vue_conf.methods.openFun ? `@open=openFun` : ``}
            ${vue_conf.methods.openedFun ? `@opened=openedFun` : ``}
            ${vue_conf.methods.closeFun ? `@close=closeFun` : ``}
            ${vue_conf.methods.closedFun ? `@closed=closedFun` : ``}
            >
            <div class="el-dialog-div">
                <component ref="dialogComponent" :parentData="parentData" :is="content"></component>
            </div>
            
            ${pl_conf.showFooter ?  
                ` <span slot="footer" class="dialog-footer">
                    <el-button @click="isVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogConfirmFun">确 定</el-button>
                  </span> ` : ``}
            </el-dialog>`;

        return super.render(el);
    }

    setConfirmFun(confirmFun){
        if(_.isFunction(confirmFun))
            this.msui_plugin_config.confirmFun = confirmFun;
        return this;
    }

    open(options = {}, openCallback = true ) {

        const $self = this.$self;
        // 打开窗体的狗子
        $self.isVisible = !options.hasOwnProperty('visible') ? true : options.visible;

        // 是否执行 openCallback
        if(openCallback) {
            _eachObj(options,
                (objKey, objVal) =>
                    $self.hasOwnProperty(objKey) && ($self[objKey] = objVal));

            triggerHook.call(this.$self, 'openCallback', options);
        }

        // // 打开窗体时，触发事件
        // setTimeout(() => {
        //
        //     const dialogComponent = $self.$refs.dialogComponent;
        //
        //     if(_.isFunction(dialogComponent.openCallback)){
        //         dialogComponent.openCallback(options);
        //     }
        //
        // }, 0);
        return this;
    }

    close() {
        this.$self.isVisible = false;
        triggerHook.call(this.$self, 'closeCallback');
    }

    /**
     *
     * 制定如何绑定到父类
     *
     * */
    static install(MsuiElement) {
        MsuiElement[this._pluginName] = this;
    }
}

export default MsuiDialog