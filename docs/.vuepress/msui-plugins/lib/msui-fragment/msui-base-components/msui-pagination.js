import MsuiFragment from "./../msui-fragment-new";
import _ from 'lodash'

export default class MsuiPagination extends MsuiFragment {

    constructor({
                    pageSize = 10,
                    pageSizes = [5, 10, 20, 30, 40],
                    handleChange = null
                } = {}) {

        super();

        this.currentPage = 1;
        this.pageSize = pageSize;
        this.pageSizes = pageSizes;
        this.totalSize = 0;

        let {
            scopeIns: {
                methods: curMethod = {}
            }
        } = this._fragScope;

        // 当前页变更时触发
        curMethod.currentChange = currentPage => {
            this.currentPage = currentPage;
            if (handleChange instanceof Function)
                handleChange(this.currentPage, this.pageSize)
        };

        // 数据量变更时触发
        curMethod.sizeChange = pageSize => {
            this.pageSize = pageSize;
            if (handleChange instanceof Function)
                handleChange(this.currentPage, this.pageSize);
        };
    }

    setPagination(totalSize) {
        this.totalSize = totalSize;
    }

    /**
     * 递增总数量
     *
     * @param incr { Number } 递增量
     *
     * **/
    incrementTotal(incr){
        if(_.isNumber(incr) && incr > 0)
            this.totalSize += incr;
    }

    /**
     * 递减总数量
     *
     * @param decr { Number } 递减量
     *
     * **/
    decreaseTotal(decr){
        if(_.isNumber(decr) && decr > 0)
            this.totalSize -= decr;
    }

    setCurrentPage(page) {
        this.currentPage = page;
    }

    render() {

        const dataPath = super.getDataPath(),
            methodPath = super.getMethodPath();

        let template = `
            <el-pagination
                    :current-page="${dataPath}.currentPage"
                    layout="total, sizes, prev, pager, next, jumper"
                    :page-sizes="${dataPath}.pageSizes"
                    :page-size="${dataPath}.pageSize"
                    :total="${dataPath}.totalSize"
                    prev-text="上一页"
                    next-text="下一页"
                    @size-change="${methodPath}_sizeChange"
                    @current-change="${methodPath}_currentChange"
                    msuiRef
            />
        `;

        return super.render(template);
    }

}