export default class MsuiSubcribe {
    constructor() {
        this.listeners = {}
    }
    /**
     * 
     * @param {*} name 订阅的事件名称
     * @param {*} callback 订阅事件的回调函数
     */
    subscribe(name, callback) {
        if(!this.listeners[name]) {
            this.listeners[name] = []
        }
        this.listeners[name].push(callback)
    }

    /**
     * 
     * @param {*} name 发布事件的名称
     * @param {*} object 发布事件的需要传递的参数
     */
    publish(name, object) {
        this.listeners[name].forEach(callback => {
            callback(object)
        });
    }
}