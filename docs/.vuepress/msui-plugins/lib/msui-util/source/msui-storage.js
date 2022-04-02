export default class MsuiStorage{

    /**
     * 添加本地缓存数据
     *
     * @param name { String } 缓存名称
     * @param value { Any } 缓存数据
     * @param expries { Number } 缓存时间
     *
     * **/
    static setItem(name, value, expries){

        if(typeof name !== 'string' || name === '')
            return console.warn('[msui-storage]: 无效的缓存名称');

        if(value === void 0 || value == null)
            return console.warn('[msui-storage]: 请传入正确的数据类型');

        const obj = {
            name,
            value
        };

        if(typeof expries === 'number'){
            obj.expires = expries;
            obj.startTime = new Date().getTime();
        }

        localStorage.setItem(name, JSON.stringify(obj));
    }

    /**
     * 获取本地缓存数据
     * **/
    static getItem(name){
        let item = localStorage.getItem(name);

        if(item !== void 0 && item != null){

            try{
                item = JSON.parse(item);
            }catch(error){
                return item;
            }

            if(!(item instanceof Object))
                return item;

            // 没有设置有效时间，直接返回数据即可
            if(!item.startTime)
                return item.value;

            const date = new Date().getTime();

            // 设置了失效时间，判断下时间的合法性
            if(date - item.startTime > item.expires){
                localStorage.removeItem(name);
            }else{
                return item.value;
            }
        }

        return null;
    }

    //移出缓存
    static removeItem(name){
        localStorage.removeItem(name);
    }

    //移出全部缓存
    static clear(){
        localStorage.clear();
    }
}
