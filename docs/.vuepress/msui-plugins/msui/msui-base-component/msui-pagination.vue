<template>
  <el-pagination
    style="text-align: right"
    @size-change="handlerSizeChange"
    @current-change="handlerCurrentChange"
    @prev-click="prevClick"
    @next-click="nextClick"
    :current-page="currentPage"
    :total="total"
    :page-size="pageSize"
    :pageSizes="pageSizes"
    :layout="layout"
    :small="small"
    :background="background"
    :pager-count="pagerCount"
    :prev-text="prevText"
    :next-text="nextText"
    :disabled="disabled"
    :hide-on-single-page="hideOnSinglePage"
  >
  </el-pagination>
</template>
<script>
export default {
  name: "MsuiPagination",
  props: {
    attrs: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      currentPage: this.attrs.currentPage,
      pageSize: this.attrs.pageSize || 10,
      total: this.attrs.total || 0,
      pageSizes: this.attrs.pageSizes || [10, 20, 30],
      layout: this.attrs.layout || "sizes, prev, pager, next, total, jumper", //"total, sizes, prve, pager, next, jumper",
      small: this.attrs.small || false,
      background: this.attrs.background || false,
      pagerCount: this.attrs.pagerCount || 5,
      prevText: this.attrs.prevtext || null,
      nextText: this.attrs.nextText || null,
      disabled: this.attrs.disabled || false,
      hideOnSinglePage: this.attrs.hideOnSinglePage || false,
    };
  },
  watch: {
      pageSize() {
        this.$emit('change', this.currentPage, this.pageSize)
      },
      currentPage() {
        this.$emit('change', this.currentPage, this.pageSize)
      }
  },
  // mounted() {
  //     console.log(this.pageSize)
  // },
  methods: {
    handlerSizeChange(size) {
      this.pageSize = size
      console.log(this.pageSize)
    },
    handlerCurrentChange(current) {
        this.currentPage = current
    },
    prevClick(page) {
        this.currentPage = page
    },
    nextClick(page) {
        this.currentPage = page
    }
  }
};
</script>
