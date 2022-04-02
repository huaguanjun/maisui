import _ from 'lodash';
import qs from 'qs';
import {_warning, _eachObj} from "../../msui-common/source/_self-util";
import {MSUI_ROUTE_MANAGER_CONSTANT} from "../../msui-common/source/msui-constant";

const ROUTE_MAP_SYMBOL = Symbol('routeMap'),
    ROUTE_LIST_SYMBOL = Symbol('routeList');


/**
 * 添加路由
 * @param route { Object } 路由对象
 * @param rootPath { String } 父路由路径
 * **/
const _addRoute = function(route, rootPath, root){
    if(_.isPlainObject(route) && route.path !== ''){

        const finalPath = rootPath + route.path;

        // 获取缓存
        const curRoot = root[finalPath] ? root[finalPath] : (root[finalPath] = {...route});

        // 加子数据
        if(route.children instanceof Array && route.children.length > 0){
            _addRoutes(route.children, finalPath[finalPath.length - 1] === '/' ? finalPath: finalPath + '/', root);
        }
    }
};


/**
 * 批量添加路由
 * @param routes { Array } 路由列表
 * @param root { Object } 路由存放对象
 * **/
const _addRoutes = function(routes = [], rootPath, root){
    routes.forEach(cur => {
        _addRoute(cur, rootPath, root);
    });
};

export default class MsuiRouteManager{

    static [ROUTE_MAP_SYMBOL] = {};

    static [ROUTE_LIST_SYMBOL] = [];

    /**
     * 根据url获取组件对象
     * @param path { String } url路径
     * @return { Function } 组件对象
     * **/
    static getComponent(path){
        if(typeof path !== 'string' || path === '')
            return null;

        //路由匹配，参数不参与
        if(path.includes("?")){
            path = path.substr(0,path.indexOf('?'));
        }

        // 全量匹配
        const component = this[ROUTE_MAP_SYMBOL][path]?.component ?? null;

        if(!component){
            _warning(MSUI_ROUTE_MANAGER_CONSTANT.MODEL_NAME,
                `无法根据地址:[${path}]获取组件`);
        }

        return component;
    }

    /**
     * 根据url获取组件名称
     * @param path { String } url路径
     * @return { String } 组件名称
     * **/
    static getComponentNameByPath(path){
        if(typeof path === 'string' && path !== ''){

            if(path.includes("?")){
                path = path.substr(0,path.indexOf('?'));
            }

            return this[ROUTE_MAP_SYMBOL][path]?.compName ?? '';
        }
        return '';
    }

    /**
     * 获取url路径后缀的参数
     * @param path { String } url路径
     * @return { Object } 参数集合
     * **/
    static getParamsByUrl(path) {
        let urlParam = {}, flagIndex = path.indexOf('?');
        if(typeof path === 'string' && flagIndex > -1)
            urlParam = qs.parse(path.substring(flagIndex + 1, path.length));
        return urlParam;
    }

    static getRouteMap(){
        return this[ROUTE_MAP_SYMBOL];
    }

    /**
     * 获取路由List
     * **/
    static getRoutes(){

        const routeList = this[ROUTE_LIST_SYMBOL],
            routeMap = this[ROUTE_MAP_SYMBOL];

        routeList.length = 0;

        _eachObj(routeMap, (path, {component}) => {
            routeList.push({
                path,
                component
            })
        });

        return _.cloneDeep(routeList);
    }

    /**
     * 添加路由模块缓存
     * @param modules { Array } 路由模块
     * **/
    static addModuleRoutesCache(modules = []){
        modules.forEach( module => {
            if(_.isArray(module)){
                _addRoutes(module, '', this[ROUTE_MAP_SYMBOL]);
            }else if(_.isObjectLike(module)){
                _addRoute(module, '', this[ROUTE_MAP_SYMBOL]);
            }
        });
    }
}