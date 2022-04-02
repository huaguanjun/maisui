
/**
 * msui-interval msui-ui定时轮询
 * Created by hgj on 2020-08-12
 *
 *
 * MsuiInterval
 * @author hgj
 *
 * TODO: 定时轮询类的使用
 *
 * @example
 *
 * let obj = {
 *     load() {
 *        this.bar = 'bar'
 *     }
 * }
 *
 * let interval = new MsuiInterval(3000,obj.load,obj)
 *
 *开启
 * interval.open()
 *
 * 关闭
 * interval.close()
 */


class MsuiInterval {
    /**
     * @param time { Number } 定时轮询间隔
     * @param cb { Function } 定时轮询的回调函数
     * @param _this { Object } 回调函数中的this指向指定
     */
    constructor(time, cb, _this, closeCB) {
        this.time = time;
        this.cb = cb;
        this.closeCB = closeCB;
        this._this = _this;
        this.state = false;
        this.interval = null;
    }
    /**
     * 关闭定时器
     */
    close() {
        if(this.state) {
            clearInterval(this.interval);
            if(this.closeCB instanceof Function){
                this.closeCB();
            }
            this.state = false;
        }
    }

    /**
     * 开启定时器
     */
    open() {
        if(!this.state) {
            this.state = true;
            this.interval = setInterval(() => {
                this.cb.call(this._this);
            }, this.time)
        }
    }

    /**
     * 获取定时器状态
     * @returns { boolean } 状态：true：开启，false：关闭
     */
    getState() {
        return this.state;
    }

    /**
     * 销毁当前定时器
     */
    destory() {
        this.close();
    }
}

export default MsuiInterval