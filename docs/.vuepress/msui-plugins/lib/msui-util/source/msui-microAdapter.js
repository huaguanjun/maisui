const checkEnv = function(){
    // 乾坤
    if(window.microMasterCommon
        && window.microMasterCommon.ob){
        return 'qiankun';
    }else{
        return 'normal';
    }
};

export default class MsuiMicroAdapter{

    constructor(props) {}

    static use(MicroAdapter){
        if(MicroAdapter.hasOwnProperty('adapterName')){
            this[MicroAdapter.adapterName] = MicroAdapter;
        }
    }

    static openPortal(...args){
        const env = checkEnv();
        if(this[env]){
            this[env].openPortal(...args);
        }
    }

    static openMicro(...args){
        const env = checkEnv();
        if(this[env]){
            this[env].openMicro(...args);
        }
    }

}
