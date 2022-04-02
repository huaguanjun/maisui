import _ from 'lodash';
import qs from 'qs';
import {_error, _warning, _eachObj} from "../../msui-common/source/_self-util";
import {MSUI_ROUTE_MANAGER_CONSTANT} from "../../msui-common/source/msui-constant";

let componentNameIdx = 0;

export default class MsuiRouteManager{

    static init(entryRoute, firstPath, notFoundPath){
        if(!this.isRendered){
            if(entryRoute && firstPath){
                this.rootRouteList = [entryRoute, firstPath, notFoundPath];
                this.routeMap = {};
                this.routeComponentMap = {};
                this.routeList = entryRoute.children;
                this.isRendered = true;
            }else
                _error(MSUI_ROUTE_MANAGER_CONSTANT.MODEL_NAME,
                    MSUI_ROUTE_MANAGER_CONSTANT.NO_SUCH_ENTRYPAGE_FIRSTPATH_ERROR)
        }
    }

    static getComponent(path){
        if(typeof path === 'string' && path !== ''){
            //路由匹配，参数不参与
            if(path.includes("?")){
                path = path.substr(0,path.indexOf('?'));
            }

            const component = this.routeMap[path]?.component ?? null;
            if(!component){
                _warning(MSUI_ROUTE_MANAGER_CONSTANT.MODEL_NAME,
                    `无法根据地址:[${path}]获取组件`);
            }
            return component
        }
    }

    static getComponentNameByPath(path){
        if(typeof path === 'string' && path !== ''){

            if(path.includes("?")){
                path = path.substr(0,path.indexOf('?'));
            }

            return this.routeMap[path]?.compName ?? '';
        }
        return '';
    }

    // static getComponentByComponentName(compName){
    //     if(typeof compName === 'string' && compName !== ''){
    //
    //         if(this.routeComponentMap[compName])
    //             return this.routeComponentMap[compName];
    //
    //         return this.routeList.map((route) => {
    //             if(route['compName'] === compName){
    //                 this.routeComponentMap[compName] = route;
    //                 return route;
    //             }
    //         })[0] ?? null;
    //     }
    //     return null;
    // }

    static getParamsByUrl(path) {
        let urlParam = {}, flagIndex = path.indexOf('?');
        if(typeof path === 'string' && flagIndex > -1)
            urlParam = qs.parse(path.substring(flagIndex + 1, path.length));
        return urlParam;
    }

    static getRouteList(){
        return _.clone(this.routeList || []);
    }

    static getRoutes(){
        this.routeList.length = 0;
        _eachObj(this.routeMap, (path, {component}) => {
            this.routeList.push({
                path,
                component
            })
        });
        return this.rootRouteList;
    }

    static addModuleRoutes(modules = []){
        modules.forEach( module => {
            if(_.isArray(module)){
                this.addRoutes(module);
            }else if(_.isObject(module)){
                this.routeMap[module.path] = module;
            }
        });
    }

    static addRoutes(routes = []){
        routes.forEach(cur => {
            if(_.isObject(cur)){
                this.routeMap[cur.path] = cur;
            }
        });
    }
}