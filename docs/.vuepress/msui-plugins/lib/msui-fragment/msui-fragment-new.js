import _ from 'lodash'

const MSUI_FRAGMENT_ERROR = {
    NO_SCOPE_ERROR: '组件片段渲染时没有vue作用模块'
};

const MSUI_DATA_SCOPE_FLAG = 'msuiDataPath';
const MSUI_METHOD_SCOPE_FLAG = 'msuiMethodPath';

const REF_FLAG = '$msuiFragRef';
const REF_REG = /msuiRef/;
let REF_FLAG_INDEX = 0;

const _eachObj = function(objs, callback){
    let oKeys = Object.keys(objs), i = oKeys.length;
    while(i--)
        callback(oKeys[i], objs[oKeys[i]]);
};

const _setPath = function(isDataPath){
    let fragScope = this._fragScope;
    if(fragScope.scopePath && Array.isArray(fragScope.scopePath)){
        let pathKey, pathSymbol;
        if(isDataPath){
            pathKey = 'dataPathStr';
            pathSymbol = '.';
        }
        else{
            pathKey = 'methodPathStr';
            pathSymbol = '_';
        }
        fragScope[pathKey] = this._fragScope.scopePath.join(pathSymbol);
        return fragScope[pathKey];
    }else return '';
};

const _mergeVueScope = function(
                                dataScope,
                                vueScopeIns,
                                fragScope,
                                needBindData){

    let {
            methods: vueMethods,
            computed: vueComputed,
            watch: vueWatch
        } = vueScopeIns,
        {

            scopeIns: {
                methods: curMethods = {},
                computed: curComputed = {},
                watch: curWatch = {}
            },

            fragments = {},
            scopePath

        } = fragScope;

    const methodsKeys = Object.keys(curMethods);
    // 合并 methods
    if(methodsKeys.length > 0){
        methodsKeys.forEach( curKey => {
            if(curMethods[curKey]){
                vueMethods[`${this.getMethodPath()}_${curKey}`] = curMethods[curKey];
            }
        });
    }

    // 合并 watch
    // 合并 computed


    // 合并 data
    if(needBindData && dataScope){
        const dataKey = _.last(scopePath);

        // 如果当前的data上已经有了该对象，就不添加了
        if(!dataScope[dataKey]){
            dataScope[dataKey] = this;
        }
    }

    // 合并聚合的组件
    _eachObj(fragments, (key, val) => {
        if(val instanceof MsuiFragment)
            val.mergeScope(this, vueScopeIns, needBindData);
    });

    // console.log('%ccurScopeIns -> %o','color:red;', this);
};

export default class MsuiFragment{

    /**
     *
     * @this _fragScope { Object }
     *
     * **/
    constructor(){
        Object.defineProperty(this, '_fragScope', {
            value:{
                scopePath: null,
                dataPathStr: '',
                methodPathStr: '',
                scopeIns: {
                    methods: {},
                    watch: {},
                    computed: {}
                },
                // template: '',
                refKey: '',
                fragments: {}
            },
            enumerable: false
        });
    }

    /**
     * 添加Fragment
     * **/
    addFragment(fragName, fragment){
        if(fragName && (fragment instanceof MsuiFragment))
            this._fragScope.fragments[fragName] = fragment;
        return fragment;
    }

    deleteFragment(fragName){
        if(fragName && this._fragScope.fragments[fragName])
            delete this._fragScope.fragments[fragName]
    }

    set$EleRef($refs){
        const {
            fragments,
            refKey
        } = this._fragScope;

        // console.log('$refs: %o', $refs);

        if($refs[refKey])
            this.$eleRef = $refs[refKey];

        // if(refKey === '$msuiFragRef3'){
        //     debugger;
        // }

        _eachObj(fragments, (k, v) => {
            if(v.set$EleRef)
                v.set$EleRef($refs);
        });
    }

    /**
     * 设置作用路径
     * **/
    setScopePath(rootPathName){

        if(_.isString(rootPathName))
            rootPathName = [rootPathName];

        this._fragScope.scopePath = rootPathName;

        // 渲染之前回调
        if(this.beforeMount){
            this.beforeMount();
        }

        _eachObj(this._fragScope.fragments, (key, val) => {
            val.setScopePath(rootPathName.concat(key));
        });
    }

    getDataPath(){
        if(this._fragScope.dataPathStr) return this._fragScope.dataPathStr;
        else return _setPath.call(this,true);
    }

    getMethodPath(){
        if(this._fragScope.methodPathStr) return this._fragScope.methodPathStr;
        else return _setPath.call(this);
    }

    beforeMount(needPromise = false){
        // if(needPromise){
        //     return new Promise();
        // }
    }

    render(template){

        if(!template)
            return '';

        let fragScope = this._fragScope;

        // 如果该模板加入了msuiRef标识，则生成组件ref
        if(REF_REG.test(template)){
            const curRefKey = REF_FLAG + REF_FLAG_INDEX++;
            template = template.replace(REF_REG, ` ref='${curRefKey}'`);
            fragScope.refKey = curRefKey;
        }

        return template;
    }

    /**
     * 合并Scope
     * **/
    mergeScope(dataScope, vueScopeIns, needBindData = true){
        if(vueScopeIns && this._fragScope.scopePath){
            _mergeVueScope.call(this, dataScope, vueScopeIns, this._fragScope, needBindData);
        }else{
            console.error(MSUI_FRAGMENT_ERROR.NO_SCOPE_ERROR)
        }
        return this;
    }
}
