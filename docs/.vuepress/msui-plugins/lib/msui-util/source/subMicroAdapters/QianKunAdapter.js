import MsuiMicroAdapter from "../msui-microAdapter";

export default class QianKunAdapter extends MsuiMicroAdapter{

    static adapterName = 'qiankun';

    static openPortal(title, params){

        if(!(params instanceof Object)){
            return;
        }

        const ob = window['microMasterCommon']['ob'];

        if(params.appName
            && params.url){

            ob.publish('open-micro-dialog', title, params.appName, params.url, params.elementArgs);
        }

        else if(params.component instanceof Function){
            ob.publish('open-component-dialog', title, params.component, params.elementArgs);
        }

        else{
            ob.publish('open-res-portal', params, title);
        }
    }
}
