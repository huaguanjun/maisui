export const checkText = function(rule, value, callback, source, options){
    const maxLen = 120;
    let len = 0;
    if(typeof value === 'number'){
      len = value.toString().length;
    } else {
        len = value.length
    }
    if(len <= maxLen) {
        callback()
    } else {
        callback(new Error('输入框最长输入120个字符'));
    }
}

export const checkTextArea = function(rule, value, callback, source, options){
    const maxLen = 500;
    let len = 0;
    if(typeof value === 'number'){
      len = value.toString().length;
    } else {
        len = value.length
    }
    if(len <= maxLen) {
        callback()
    } else {
        callback(new Error('文本框最长输入500个字符'));
    }
}