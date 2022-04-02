import MsuiMicroAdapter from "../msui-microAdapter";
import MsuiOpenComponentsUtil from './../msui-opencomponent-util'

const PORTAL_PATH = 'view/portal/resourcePortal';

export default class NormalAdapter extends MsuiMicroAdapter{

    static adapterName = 'normal';

    static openPortal(title, params){
        if(!(params instanceof Object)){
            return;
        }

        // 正常打开页面
        if(params.hasOwnProperty('appName')
            && params.hasOwnProperty('url')){

            MsuiOpenComponentsUtil.openTab({
                title,
                path: params.url + '?' + JSON.stringify(params.elementArgs)
            });

        }

        // 打开Portal
        else{
            MsuiOpenComponentsUtil.openTab({
                title,
                path: PORTAL_PATH + '?' + JSON.stringify(params)
            });
        }
    }

}
