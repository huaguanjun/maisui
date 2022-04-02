import _ from 'lodash'

const _lazyTemplate = Symbol('_lazyTemplate');

class MsuiAsyncTemplate{

    static [_lazyTemplate] = {
        component: null,
        loading: {template: '<h1>加载中</h1>'},
        error: {template: '<h1>加载失败</h1>'},
        delay: 200,
        timeout: 3000
    };

    constructor({ loading, error, delay, timeout }){
        this.loading = loading;
        this.error = error;
        this.delay = delay;
        this.timeout = timeout;
    }

    static createAsyncTemplate(vue){
        return () => (_.merge(this[_lazyTemplate],{component: vue}))
    }

    static setDefaultTemplate(){

    }

}

class MsuiAsyncLoader{

    static createAsyncComponent(vue, useLazyTemplate = false){

        let asyncVue = new Promise(resolve => resolve(vue));

        if(useLazyTemplate){

            let vueComponent = MsuiAsyncTemplate.createAsyncTemplate(asyncVue);

            return function(){ return new Promise((resolve) => {
                console.log(vueComponent);
                resolve({
                    functional: true,
                    render(h){
                        return h(vueComponent);
                    }
                })
            })};

        }else{
            return function(){
                return asyncVue };
        }
    }
}

export { MsuiAsyncLoader, MsuiAsyncTemplate }