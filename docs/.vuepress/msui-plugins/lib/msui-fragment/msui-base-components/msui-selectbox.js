import MsuiFragment from "./../msui-fragment-new";
import {_addAxios, _error} from '../../msui-common/source/_self-util'
import {MSUI_SELECTBOX_CONSTANT} from "../../msui-common/source/msui-constant";


const _defaultProps = {
    text: 'text',
    value: 'value',
    disabled: 'disabled'
};

export default class MsuiSelectBox extends MsuiFragment {
    /**
     *
     * 特殊说明一下load参数：
     * load参数接受2种参数，分别是String、Object
     *
     * 当类型为String时：值默认作为url来构造get请求的MsuiAxios
     * 当类型为Object时：必填参数为：url，可选参数为：params、remote、success、error根据这4个参数来构造MsuiAxios
     *
     * 特殊说明下Object.remote参数：
     * remote为一个Boolean类型的参数，当值为true时，将启用远程搜索、加载功能。
     *
     * 该功能与普通的远程加载数据的区别是：
     *
     * TODO: 普通远程加载数据 会在初始化选择器时将请求的数据加载至本地，并且在后续的生命周期中也不会再进行加载数据。除非主动调用load方法
     *
     * TODO: 如果后台数据刷新变动快，请配置 remote 参数
     *
     * TODO: 当remote被设置为true时，选择器将会在 输入值发生变化时 重新加载请求数据，并且将请求回调后的数据 与 当前输入值 进行 模糊匹配，最后返回匹配成功的数据，保存在本地。
     *
     * @param loader { String ||
     *      {
     *          url: String!,
     *          data: Object,
     *          remote: Boolean
     *          success: Function(data:Object):void,
     *          error: Function(err:Object):void
     *      }
     * =}
     *
     * @param data { Array } 本地数据集
     * @param size { String } 选择器大小：默认medium、可选：mini、small
     * @param fullLine { Boolean } 是否与父元素宽度对其
     * @param value { String } 初始值
     * @param immediate { Boolean } 是否立即加载远程数据
     * @param props { Object } 选项字段映射
     * @param multiple { Boolean } 是否启用多选
     * @param splitReg { String } 多选时的分隔符
     * @param filterable { Boolean } 是否启用搜索
     * @param disabled { Boolean } 是否禁用
     * @param placeholder { String } 当选择器的值为空时，显示的文本
     * @param changeHandler { Function } 内容发生变化监听
     *
     * **/
    constructor({
                    props,
                    loader = '',
                    fullLine = false,
                    data = [],
                    size = 'medium',
                    value = '',
                    immediate = true,
                    pageSize = 20,
                    multiple = false,
                    splitReg = ',',
                    disabled = false,
                    filterable = true,
                    changeHandler = null,
                    clickHandler = null,
                    placeholder = '请选择数据'
                } = {}) {

        super();

        let {
            scopeIns: {
                methods: curMethod = {}
            }
        } = this._fragScope;

        // 对属性的赋值
        this.value = value;
        this.fullLine = fullLine;
        this.data = [];
        this.size = size;
        this.loading = false;
        this.loadingData = true;
        this.multiple = multiple;
        this.describeText = '正在加载中......'
        this.splitReg = splitReg;
        this.disabled = disabled;
        this.filterable = filterable;
        this.placeholder = placeholder;
        this.props = props ? _.merge({}, _defaultProps, props) : _defaultProps;
        this.page = 1;

        this.allDataLength = 0;
        this.showPagination = true;
        this.currentWidth = 301;

        Object.defineProperty(this, '_dict', {
            enumerable: false,
            value: {}
        });

        Object.defineProperty(this, '_allData', {
            enumerable: false,
            writable: true,
            value: []
        });

        if (pageSize <= 20) {
            this.pageSize = 20
        } else if (pageSize >= 100) {
            this.pageSize = 100
        }

        if (loader) {
            _addAxios.call(this, loader, data => {
                this.describeText = '无数据';
                if (_.isFunction(loader.filterResData)) {
                    data = loader.filterResData(data);
                }

                if (data instanceof Array) {
                    this._allData = data;
                } else {
                    this._allData = []
                }

                this.allDataLength = data.length;
                this.loadingData = false;

                return data;
            }, () => {
                _error(MSUI_SELECTBOX_CONSTANT.MODEL_NAME,
                    MSUI_SELECTBOX_CONSTANT.REQUEST_DATA_ERROR)
            });

            if (immediate) {
                this.load();
            }

        } else if (data instanceof Array && data.length > 0) {
            this.describeText = '无数据';
            this._allData = data;
            this.allDataLength = data.length;
        }

        // 如果设置了远程过滤，则将请求后的逻辑处理交由remoteHanlder来处理
        if (this.remote) {
            this.filterable = true;
            curMethod.remoteHandler = (query) => {
                if (query !== '') {
                    this.loading = true;
                    this.axiosIns
                        .sender()
                        .then(data => {
                            this.loading = false;
                            if (data instanceof Array) {
                                this.data = data.filter(item => {
                                    this.showPagination = false
                                    return item[this.props['text']].includes(query);
                                });
                            }
                            loader.success && loader.success(this.data);
                        })
                        .catch(err => {
                            _error(MSUI_SELECTBOX_CONSTANT.MODEL_NAME,
                                MSUI_SELECTBOX_CONSTANT.REQUEST_DATA_ERROR);
                            this.loading = false;
                            loader.error && loader.error(err);
                        });
                }
            }
        }

        if (this.filterable) {
            curMethod.filterHandler = (query) => {
                if (query.trim() === "") {
                    this.setData()
                    this.showPagination = true
                    return
                } else {
                    this.data = this._allData.filter(item => {
                        this.showPagination = false
                        return item[this.props['text']].includes(query);
                    })
                }
            }
        }
        // 对方法的赋值
        if (_.isFunction(changeHandler))
            curMethod.changeHandler = changeHandler;

        if (_.isFunction(clickHandler))
            curMethod.clickHandler = clickHandler;

        curMethod.focusHandler = () => {
            if(loader) {
                this._result.then(() => {
                    this.setData();
                    if (this.$eleRef)
                        this.currentWidth = this.$eleRef.$el.clientWidth;
                })
            } else {
                this.setData();
                if (this.$eleRef)
                    this.currentWidth = this.$eleRef.$el.clientWidth;
            }
        };

        // 缓存scroll元素地址
        this.scrollAdress = null;
        curMethod.currentChange = (page) => {
            this.page = page;
            this.setData();
            if (this.scrollAdress) {
                this.scrollAdress.scrollTop = 0;
            } else if (this.$eleRef) {
                this.scrollAdress = this.$eleRef.$refs.popper.$children[0].$refs.wrap;
                this.scrollAdress.scrollTop = 0;
            }
        };

        curMethod.defaultChange = () => {
            if (!this.multiple) {
                this._allData.forEach((item, index) => {
                    if (item[this.props.value] === this.value) {
                        this.page = Math.ceil((index + 1) / this.pageSize)
                    }
                })
            }
        }

    }

    setData = (data) => {
        if (data) {
            this._allData = data;
        }
        this.showPagination = true;
        // 对数据集进行分页处理
        if (this._allData.length > this.pageSize) {
            this.data = this._allData.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
        }
        // 数据集无需分页
        else {
            this.data = this._allData;
        }
        return this;
    };

    getData() {
        return _.cloneDeep(this.data);
    }

    /**
     *
     * 选择器的 formatter 逻辑：
     *
     * 根据配置的props，将props.value 作为 唯一值进行匹配其 props.text
     *
     * **/
    formatter(val) {
        if (val == null || val === void 0 || val === '') return '其他';
        val = val.toString();
        if (val.includes(this.splitReg)) {
            const vals = val.split(this.splitReg);
            return vals.map(curVal => {
                return this.formatVal(curVal);
            }).join(this.splitReg);
        } else
            return this.formatVal(val);
    }

    formatVal(val) {
        if (this._dict[val]) return this._dict[val];

        const {
            text,
            value
        } = this.props;

        const result = this._allData.find((o) => {
            return o[value] === val;
        });

        if (result) {
            this._dict[result[value]] = result[text];
            return result[text];
        } else return val;
    }

    getValue() {
        return this.value.toString();
        // return this.multiple ? this.value.toString() : this.value;
    }

    select(idx = 0){
        if(this._result && this.loadingData){
            this._result.then((data) => {
                // 给 vue 数组赋值
                this._allData.forEach((item, index) => {
                    if (idx === index) {
                        this.data.push(this._allData[idx]);
                        this.page = Math.max(Math.ceil(index / this.pageSize), 1);
                    }
                });
            });
        }
        else {
            this._allData.forEach((item, index) => {
                if (idx === index) {
                    this.data.push(this._allData[idx]);
                    this.page = Math.max(Math.ceil(index / this.pageSize), 1);
                }
            });
        }
        this.value =  this._allData[idx][this.props.value];
        return this;
    }

    setValue(val) {
        // 正在查询axios中
        if(this._result && this.loadingData){
            this._result.then((data) => {
                // 给 vue 数组赋值
                this.setRealValue(val);
            });
        }
        else {
            this.setRealValue(val);
        }

        return this;
    }

    setRealValue(val) {

        if ((val !== ''&& typeof val === 'string') || typeof val === 'number') {
            // 多选逻辑
            if (this.multiple && _.isString(val)) {
                val = val.split(this.splitReg);
                this._allData.forEach(item => {
                    val.forEach(value => {
                        if (item[this.props.value] === value) {
                            this.data.push(item);
                        }
                    })
                })
            }
            // 单选逻辑
            else {

                if (this.data.filter(cur => cur[this.props.value] === val).length === 0) {
                    // 设置数据时，如果存在分页且当前设置的数据不在当前页，则为了显示字典值，将该数据暂时放入数据集中
                    this._allData.forEach((item, index) => {
                        if (item[this.props.value] === val) {
                            this.data.push(item);
                            this.page = Math.max(Math.ceil(index / this.pageSize), 1);
                        }
                    });
                }
            }
        } else if(typeof val === 'object'){
            if(val.index) {

                let idx = val.index;

                this._allData.forEach((item, index) => {
                    if (idx === index) {
                        this.data.push(this._allData[idx]);
                        this.page = Math.max(Math.ceil(index / this.pageSize), 1);
                    }
                });

                val =  this._allData[idx][this.props.value];
            }
        }

        this.value = val;
    }

    /**
     * 加载数据
     * **/
    load(params) {
        this.loadingData = true;
        this._result = this.axiosIns && this.axiosIns.sender(params);
        return this;
    }

    disable(disabled = true) {
        this.disabled = disabled;
        return this;
    }

    setPlaceHolder(value) {
        this.placeholder = value
    }

    render() {

        let {
            scopeIns: {
                methods: curMethod = {}
            }
        } = this._fragScope;

        // 当前该组件碎片所在的路径
        const dataPath = super.getDataPath(),
            methodPath = super.getMethodPath();

        let template = `
            <el-select v-model="${dataPath}.value" 
                style="${this.fullLine ? `width: 100%;` : ''}"
                msuiRef
                clearable
                :no-data-text="${dataPath}.describeText"
                size="${this.size}"
                v-loading="${dataPath}.loading"
                :placeholder="${dataPath}.placeholder"
                :disabled="${dataPath}.disabled"
                ${this.filterable ? `filterable :filter-method=${methodPath}_filterHandler` : ''}
                ${this.multiple ? `multiple` : ''}
                ${curMethod.clickHandler ? `@focus="(value) => {${methodPath}_focusHandler(value);${methodPath}_clickHandler(value)}"` : `@focus="${methodPath}_focusHandler"`}
                ${curMethod.changeHandler ? `@change="(value) =>{${methodPath}_changeHandler(value.toString());${methodPath}_defaultChange()}"` : `@change="${methodPath}_defaultChange"`}
                ${this.remote ? `remote :remote-method="${methodPath}_remoteHandler"` : ''}
                >
               <div v-if="${dataPath}.allDataLength > ${dataPath}.pageSize && ${dataPath}.showPagination" style="padding-bottom: 50px;">
                    <el-option
                      v-for="item in ${dataPath}.data"
                          :key="item.${this.props.value}"
                          :label="item.${this.props.text}"
                          :value="item.${this.props.value}"
                          :disabled="item.${this.props.disabled}"
                      >
                    </el-option>
                    <div style="position: absolute;bottom: 0; background: white;display: flex;width: 100%;padding: 10px 10px;box-sizing: border-box;">
                        <el-pagination
                          small
                          background
                          style="margin: 0 auto;"
                          :layout= "${dataPath}.currentWidth > 300 ? 'slot,prev, pager, next,total' : 'prev, next'"
                          :current-page.sync="${dataPath}.page"
                          :pager-count="5"
                          :page-size="${this.pageSize}"
                          @current-change="${methodPath}_currentChange"
                          :total="${dataPath}.allDataLength">
                          <span style="font-size: 13px;font-weight: normal;">{{${dataPath}.pageSize}}条/页</span>
                        </el-pagination>
                    </div>
                </div>
                <div v-else>
                    <el-option
                      v-for="item in ${dataPath}.data"
                          :key="item.${this.props.value}"
                          :label="item.${this.props.text}"
                          :value="item.${this.props.value}"
                          :disabled="item.${this.props.disabled}"
                      >
                    </el-option>
                </div>
                
            </el-select>
        `;

        return super.render(template);
    }
}
