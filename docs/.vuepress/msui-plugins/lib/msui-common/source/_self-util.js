import MsuiAxios from "../../msui-util/source/msui-axios";
import _ from "lodash";
import MsuiButton from "../../msui-fragment/msui-base-components/msui-button";

/**
 *
 * Msui内部工具，仅对开发者开放
 *
 * @author sq / lwz
 *
 * **/

/**
 * 节流工厂
 *
 * @param time { Number } 过渡时间
 * @return Function(fn: Function): void 回调函数
 *
 * **/
const _throttleFactory = function(time = 500) {
    let throttle = 0;
    return function(fn, scope, ...args){
        clearTimeout(throttle);
        throttle = setTimeout(function(){
            fn.apply(scope, args);
        }, time);
    };
};

const _throttleFunc = function(delay = 50, callback, scope = null) {
    let throttle = 0;
    return function(...args){
        clearTimeout(throttle);
        throttle = setTimeout(function(){
            callback.apply(scope, args);
        }, delay);
    };
};

const _msuiButtonCreator = function ($self, addFragment) {
    return function(buttons){
        let btnInsArr = [];
        if(_.isObject(buttons) || _.isArray(buttons)){
            if(_.isArray(buttons)){
                if(buttons.length > 0){
                    btnInsArr = buttons.map( (btn, idx) => {
                        return _addMsuiButton(btn, `msuiBtn${idx}`, $self, addFragment);
                    });
                }
            }else{
                _eachObj(buttons, (btnName, btn) => {
                    btnInsArr.push(_addMsuiButton(btn, btnName, $self, addFragment));
                });
            }
        }
        return btnInsArr;
    };
};
const _addMsuiButton = function(btn, btnName, $self, addFragment){
    let curMsuiButton = btn instanceof MsuiButton ? btn : new MsuiButton(btn);
    if(curMsuiButton){
        if(btnName && $self && addFragment){
            addFragment.call($self, btnName, curMsuiButton);
        }
        return curMsuiButton;
    }else
        return null;
};

const _addAxios = function(load, sucFun, errFun){

    const axiosIns = _addAxiosReturnIns.call(this,load, sucFun, errFun);

    Object.defineProperty(this, 'axiosIns', {
        value: axiosIns,
        enumerable: false
    });
};

const _addAxiosReturnIns = function(load, sucFun, errFun){
    let axiosIns = null, lazyList = [], errList = [];

    // 处理load的3种情况
    if(_.isString(load)){
        axiosIns = new MsuiAxios({
            url: load,
            lazySuc: sucFun,
            lazyErr: errFun
        });
    }

    else if(load instanceof MsuiAxios){
        axiosIns = load;
        lazyList.push(sucFun);
        errList.push(errFun);
    }

    else{

        axiosIns = new MsuiAxios(_.merge({}, load));

        // 如果启用了远程过滤，则取消懒请求
        if(!load.remote){
            lazyList.push(sucFun, load.success);
            errList.push(errFun, load.error);
        }
    }


    // 添加懒加载方法
    if(lazyList.length > 0){
        axiosIns.addLazySuc(lazyList.concat(load.successList || []));
    }

    if(errList.length > 0){
        axiosIns.addLazyErr(errList.concat(load.errorList || []));
    }

    return axiosIns;
};

const _eachObj = function(objs, callback){
    let oKeys = Object.keys(objs), i = oKeys.length;
    while(i--)
        callback(oKeys[i], objs[oKeys[i]]);
};

const _eachObjDesc = function(objs, callback){
    let oKeys = Object.keys(objs), l = oKeys.length, i = 0;
    while(i < l){
        callback(oKeys[i], objs[oKeys[i]]);
        i++;
    }
};

const _eachObjAsc = function(objs, callback){
    let oKeys = Object.keys(objs), l = oKeys.length, i = 0;
    while(i < l){
        callback(oKeys[i], objs[oKeys[i]]);
        i++;
    }
};

const _warning = function(type, errors) {
    if (typeof console !== 'undefined' && console.warn) {
        if (typeof console !== 'undefined' && console.warn) {
            if(errors.join){
                errors = errors.join('\n');
            }
            console.warn(`[${type}]:`, errors);
        }
    }
};

const _error = function(type, errors) {
    if (typeof console !== 'undefined' && console.error) {
        if(errors.join){
            errors = errors.join('\n');
        }
        console.error(`[${type}]:`, errors);
    }
};

const _errorFactory = function(constants){
    return function(errors){
        if (typeof console !== 'undefined' && console.error) {
            if(errors.map){
                errors = errors.map( err => constants[err] || err).join(' ');
            }else{
                errors = constants[errors];
            }
            console.error(`[${constants.MODEL_NAME}]:`, errors);
        }
        return false;
    }
};

const _errorFactoryWithoutConstant = function(modelName){
    return function(errors){
        if (typeof console !== 'undefined' && console.error) {
            if(errors.map){
                errors = errors.join(' ');
            }

            console.error(`[${modelName}]:`, errors);
        }
        return false;
    }
};

const _warningFactory = function(constants){
    return function(errors){
        if (typeof console !== 'undefined' && console.warn) {
            if(errors.map){
                errors = errors.map( err => constants[err] || err).join(' ');
            }else{
                errors = constants[errors];
            }
            console.warn(`[${constants.MODEL_NAME}]:`, errors);
        }
        return false;
    }
};

export {
    _addAxios,
    _addAxiosReturnIns,
    _msuiButtonCreator,
    _eachObj,
    _eachObjDesc,
    _eachObjAsc,
    _warning,
    _error,
    _errorFactory,
    _warningFactory,
    _throttleFactory,
    _throttleFunc,

    _errorFactoryWithoutConstant
};
