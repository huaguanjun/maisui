import MsuiFragment from "./../msui-fragment-new";
// import {_error} from "../msui-common/source/_self-util";
// import {MSUI_UPLOAD_CONSTANT} from "../msui-common/source/msui-constant";

export default class MsuiInput extends MsuiFragment{

    constructor({
                    inline = false,
                    text = '',
                    name = '',
                    limit = 3,
                    action = '',
                    accept = null,
                    multiple = true,
                    headers = null,
                    data = null,
                    onExceed = null,
                    onSuccess = null,
                    beforeUpload = null,
                    filterResData = null,
                    tip = ''
                } = {}){

        super();

        let {
            scopeIns: {
                methods: curMethod = {}
            }
        } = this._fragScope;

        this.text = text;
        this.accept = accept;
        this.name = name;
        this.inline = inline;
        this.limit = limit;
        this.action = action;
        this.multiple = multiple;
        this.headers = headers;
        this.tip = tip;
        this.data = data;
        this.fileList = [];

        this.fileValue = '';

        if(onExceed instanceof Function)
            curMethod.onExceed = onExceed;

        if(beforeUpload instanceof Function)
            curMethod.beforeUpload = beforeUpload;

        if(onSuccess instanceof Function){
            curMethod.onSuccess = (response, file, fileList) => {
                onSuccess(response, file, fileList);
                if(filterResData instanceof Function){
                    this.setValue(filterResData(response, file, fileList));
                }
            }
        }
        curMethod.onChange = (file , fileList) => {
            if(fileList.length > 1) {
                fileList.splice(0,1)
            }
        }
    }

    setValue(val = ''){
        if(typeof val === 'string' || typeof val === 'boolean' || typeof val === 'number')
            this.fileValue = val;

        return this;
    }

    getValue(){
        return this.fileValue;
    }


    render(){

        let {
            scopeIns: {
                methods: curMethod = {}
            }
        } = this._fragScope;

        const dataPath = super.getDataPath(),
            methodPath = super.getMethodPath();

        let template = `
            <el-upload
                style="display: inline-block;"
                action="${this.action}"
                accept="${this.accept}"
                name="${this.name !== '' ? this.name : 'file'}"
                ${this.multiple ? 'multiple' : ''}
                ${this.limit > 0 ? `:limit="${this.limit}"` : ''}
                ${this.headers ? `:headers="${dataPath}.headers"` : ''}
                ${this.data ? `:data="${dataPath}.data"` : ''}
                ${curMethod.onExceed instanceof Function ? `:on-exceed="${methodPath}_onExceed"` : ''}
                ${curMethod.onSuccess instanceof Function ? `:on-success="${methodPath}_onSuccess"` : ''}
                ${curMethod.beforeUpload instanceof Function ? `:before-upload="${methodPath}_beforeUpload"` : ''}
                :on-change="${methodPath}_onChange"
                :file-list="${dataPath}.fileList">
                <el-button size="mini" type="" icon="el-icon-upload2">${this.text !== '' ? this.text : '上传'}</el-button>
                ${
                    this.tip !== '' ? `<div slot="tip" class="el-upload__tip">${this.tip}</div>` : ''
                }
            </el-upload>
        `;


        return super.render(template);
    }

}