export default class MsuiUtils {
  /**
   * 防抖工厂
   * @param {*} callback
   * @param {*} delay
   * @param {*} immediate
   * @returns Function
   */
  static debounce(callback, delay, immediate = true) {
    let timer;
    return function () {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        callback.call(this, ...arguments);
      }, delay);
      if (immediate) {
        callback.call(this, ...arguments);
        immediate = false;
        setTimeout(() => {
          immediate = true;
        }, delay * 30);
      }
    };
  }

  /**
   * 节流工厂
   * @param {*} callback
   * @param {*} delay
   * @param {*} immediate
   * @returns
   */
  static throttle(callback, delay, immediate = true) {
    let timer;
    let flag = true;
    return function () {
      if (flag) {
        flag = false;
        timer = setTimeout(() => {
          flag = true;
          callback.call(this, ...arguments);
        }, delay);

        if (immediate) {
          clearTimeout(timer);
          callback.call(this, ...arguments);
          flag = true;
          immediate = false;
          setTimeout(() => {
            immediate = true;
          }, delay * 30);
        }
      }
    };
  }

  /**
   * 对象深层拷贝
   * @param {*} object
   * @returns 拷贝完成的对象
   */
  static cloneDeep(object) {
    let newObj = {};
    if (object instanceof Array) {
      newObj = [];
    }
    for (let key in object) {
      if (object[key] instanceof Object) {
        newObj[key] = MsuiUtils.cloneDeep(object[key]);
      } else {
        newObj[key] = object[key];
      }
    }
    return newObj;
  }
  /**
   * 中国标准时间转标准时间
   * @param {*} object
   * @returns 标准时间
   */
  static timestampToTime(value) {
    var Y = value.getFullYear() + "-";
    var M =
      (value.getMonth() + 1 < 10
        ? "0" + (value.getMonth() + 1)
        : value.getMonth() + 1) + "-";
    var D = (value.getDate() < 10 ? "0" + value.getDate() : value.getDate()) + " " ;
    var h =
      (value.getHours() < 10 ? "0" + value.getHours() : value.getHours()) + ":";
    var m =
      (value.getMinutes() < 10
        ? "0" + value.getMinutes()
        : value.getMinutes()) + ":";
    var s =
      value.getSeconds() < 10 ? "0" + value.getSeconds() : value.getSeconds();
    return Y + M + D + h + m + s;
  }
}

// 时间格式化
Date.prototype.format = function(fmt) { 
  var o = { 
     "M+" : this.getMonth()+1,                 //月份 
     "d+" : this.getDate(),                    //日 
     "h+" : this.getHours(),                   //小时 
     "m+" : this.getMinutes(),                 //分 
     "s+" : this.getSeconds(),                 //秒 
     "q+" : Math.floor((this.getMonth()+3)/3), //季度 
     "S"  : this.getMilliseconds()             //毫秒 
 }; 
 if(/(y+)/.test(fmt)) {
         fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
 }
  for(var k in o) {
     if(new RegExp("("+ k +")").test(fmt)){
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
      }
  }
 return fmt; 
}