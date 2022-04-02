import MsuiUtil from "./msui-util";
import { Loading } from 'element-ui';

const _loadingInstance = Symbol('_loadingInstance');

class MsuiLoading extends MsuiUtil{

    static _pluginName = 'MsuiLoading';
    static [_loadingInstance];

    constructor(){
        super();
    }

    static open(options){
        this[_loadingInstance] = Loading.service(options);
    }

    static close(){
        if(this[_loadingInstance]){
            this[_loadingInstance].close();
        }
    }

    /**
     *
     * 制定如何绑定到父类
     *
     * */
    static install(MsuiUtil) {
        MsuiUtil[this._pluginName] = this;
    }

}

export default MsuiLoading