export default class MsuiObserver{

    constructor(){
        this.listeners = {};
    }

    subscribe(listenName, callback){
        if(typeof listenName === 'string'
            && listenName !== '' && callback instanceof Function){

            if(!this.listeners[listenName]){
                this.listeners[listenName] = [];
            }

            this.listeners[listenName].push(callback);

        }else{
            console.warn('订阅方法参数不符合规范！，订阅名称: %o', listenName);
        }
    }

    remove(listenName, callback){
        if(typeof listenName === 'string'
            && listenName !== '' && callback instanceof Function){

            if(this.listeners[listenName]){
                const funcIndex = this.listeners[listenName].indexOf(callback);
                if(funcIndex !== -1){
                    this.listeners[listenName].splice(funcIndex,1);
                }
            }
        }else{
            console.warn('移除订阅方法参数不符合规范！，订阅名称: %o', listenName);
        }
    }

    publish(listenName, ...args){
        if(typeof listenName === 'string'
            && listenName !== '' && this.listeners[listenName]){
            this.listeners[listenName].forEach( callback => {
                // callback.apply(null, ...args);
                callback(...args);
            });
        }
    }

}