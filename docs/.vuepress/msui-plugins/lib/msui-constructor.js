/**
 *
 * MsuiConstructor
 *
 * 制定与 Vue框架 的集成规则
 *
 * 制定 子框架 与 子组件 的集成关系
 *
 *
 *
 * */

const _installComponents = Symbol('_installComponents');

class MsuiConstructor{

    static install(Vue, Super, pluginName){
        Vue.prototype[pluginName] = Super;

    }

    static add( Super, Plugin, options ){
        if(Plugin.prototype.__proto__.constructor === Super){
            Plugin.install(Super, options);
        }
    }


    static [_installComponents](){

    }
}

export default MsuiConstructor