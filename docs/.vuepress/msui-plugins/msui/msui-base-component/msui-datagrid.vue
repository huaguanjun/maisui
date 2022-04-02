<template>
  <div>
    <!-- globalButton -->
    <slot v-if="!globalButton.length" name="globalButton"></slot>
    <div v-else style="margin-bottom: 10px">
      <el-button
        v-for="(item, index) in globalButton"
        :key="index"
        @click="item.clickHandler(selection)"
        :icon="item.icon"
        :size="item.size"
        :type="item.type"
      >
        {{ item.title }}
      </el-button>
    </div>

    <!-- 表格核心 -->
    <el-table
      ref="msuiDatagrid"
      :size="attrs.size || 'small'"
      :empty-text="attrs.emptyText || '暂无数据'"
      :sum-text="attrs.sumText || '合计'"
      :tooltip-effect="attrs.tooltipEffect || 'dark'"
      :data="data"
      :border="attrs.border || true"
      :stripe="attrs.stripe || true"
      :height="attrs.height"
      :max-height="attrs.maxHeight || null"
      :fit="attrs.fit || true"
      :show-header="attrs.showHeader || true"
      :highlight-current-row="attrs.highlightCurrentRow || false"
      :default-expand-all="attrs.defaultExpandAll || false"
      :show-summary="attrs.showSummary || false"
      :select-on-indeterminate="attrs.selectOnIndeterminate || true"
      :indent="attrs.indent || 16"
      :summary-method="attrs.summaryMethod"
      :span-method="attrs.spanMethod"
      :row-class-name="attrs.rowClassName"
      :row-style="attrs.rowSyle"
      :cell-class-name="attrs.cellClassName"
      :header-row-class-name="attrs.headerRowClassName"
      :header-cell-style=" attrs.headerCellStyle || { background: '#e5e5e5', color: '#333333' }"
      :row-key="attrs.rowKey"
      v-loading="attrs.loading || false"
      @select="select"
      @select-all="selectAll"
      @selection-change="selectionChange"
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave"
      @cell-click="cellClick"
      @cell-dblclick="cellDblclick"
      @row-click="rowClick"
      @row-contextmenu="rowContextmenu"
      @row-dblclick="rowDblclick"
      @header-click="headerClick"
      @header-contextmenu="headerContextmenu"
      @sort-change="sortChange"
      @filter-change="filterChange"
      @current-change="currentChange"
      @header-dragend="headerDragend"
      @expand-change="expandChange"
    >
      <!-- 多选框 -->
      <slot v-if="!selection"></slot>
      <el-table-column
        v-else
        type="selection"
        :align="selection.align || 'center'"
        :width="selection.width || 50"
      />

      <!-- 展开 -->
      <el-table-column
        v-if="expand"
        type="expand"
        label="展开"
        :align="expand.align || 'center'"
        :width="expand.width || 50"
      >
        <template slot-scope="{ row }">
          <slot
            name="expandView"
            :row="row"
            :options="datagridModel._options"
          />
        </template>
      </el-table-column>

      <!-- 序号 -->
      <slot v-if="!index" name="index"></slot>
      <el-table-column
        v-else
        :label="index.label || '序号'"
        :width="index.width || 50"
        :align="index.align || 'center'"
        type="index"
      />
      <!-- 表格列 -->
      <template v-for="item in datagridModel">
        <el-table-column
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :align="item.align"
          :show-overflow-tooltip="item.shwoTip || true"
          v-if="item.show"
        >
          <!-- 表格插槽 插槽使用 -->
          <template
            v-if="$scopedSlots[item.prop]"
            #default="{ row, column, $index }"
          >
            <slot
              :name="item.prop"
              :row="row"
              :column="column"
              :dom="$index"
              :currentModel="item"
            >
            </slot>
          </template>

          <!-- 表格字段 formatters -->
          <template v-else-if="item.formatters" #default="{ row }">
            <span>{{ item.formatters(row[item.prop]) }}</span>
          </template>
        </el-table-column>
      </template>

      <!-- inlineButton -->
      <slot v-if="!inlineButton.length" name="inlineButton"></slot>
      <el-table-column
        align="center"
        v-else
        fixed="right"
        label="操作"
        width="50"
      >
        <template slot-scope="scope">
          <template v-for="(item, index) in inlineButton">
            <el-button
              :key="index"
              :title="item.title"
              :icon="item.icon"
              v-if="inlineButtonViable(item, scope.row)"
              :size="item.size || 'mini'"
              :type="item.type || 'text'"
              @click="item.clickHandler(scope, data, attrs)"
            />
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "MsuiDatagrid",
  props: {
    options: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  watch: {
    //   attrs: {
    //   handler(options) {
    //     console.log(attrs)
    //  },
    //  deep:true
    // }
  },
  computed: {
    attrs() {
      return this.options.attrs ? this.options.attrs : {};
    },
    globalButton() {
      return this.options.globalButton ? this.options.globalButton : [];
    },
    inlineButton() {
      return this.options.inlineButton ? this.options.inlineButton : [];
    },
    datagridFunction() {
      return this.options.datagridFunction ? this.options.datagridFunction : {};
    },
    datagridModel() {
      return this.options.datagridModel;
    },
    index() {
      return this.options.index || false;
    },
    selection() {
      return this.options.selection || false;
    },
    expand() {
      return this.options.expand || false;
    },
    expandView() {
      return this.options.expandView || false;
    },
    data() {
      return this.options.data;
    },
  },
  methods: {
    inlineButtonViable(item, row) {
      if (item.visable instanceof Function) {
        return item.visable(row);
      } else {
        return true;
      }
    },
    setSelection(selection) {
        selection.forEach(row => {
            this.$refs.msuiDatagrid.toggleRowSelection(row);
        });
    },
    select() {
      this.$emit("select", ...arguments);
      if (this.datagridFunction.select instanceof Function) {
        this.datagridFunction.select(...arguments);
      }
    },
    selectAll() {
      this.$emit("selectAll", ...arguments, this.data);
      if (this.datagridFunction.selectAll instanceof Function) {
        this.datagridFunction.selectAll(...arguments, this.data);
      }
    },
    selectionChange(val) {
      this.options.selection = val
      this.$emit("selectionChange", val);
      if (this.datagridFunction.selectionChange instanceof Function) {
        this.datagridFunction.selectionChange(val);
      }
    },
    cellMouseEnter() {
      this.$emit("cellMouseEnter", ...arguments);
      if (this.datagridFunction.cellMouseEnter instanceof Function) {
        this.datagridFunction.cellMouseEnter(...arguments);
      }
    },
    cellMouseLeave() {
      this.$emit("cellMouseLeave", ...arguments);
      if (this.datagridFunction.cellMouseLeave instanceof Function) {
        this.datagridFunction.cellMouseLeave(...arguments);
      }
    },
    cellClick() {
      this.$emit("cellClick", ...arguments);
      if (this.datagridFunction.cellClick instanceof Function) {
        this.datagridFunction.cellClick(...arguments);
      }
    },
    cellDblclick() {
      this.$emit("cellDblclick", ...arguments);
      if (this.datagridFunction.cellDblclick instanceof Function) {
        this.datagridFunction.cellDblclick(...arguments);
      }
    },
    rowClick() {
      this.$emit("rowClick", ...arguments);
      if (this.datagridFunction.rowClick instanceof Function) {
        this.datagridFunction.rowClick(...arguments);
      }
    },
    rowContextmenu() {
      this.$emit("rowContextmenu", ...arguments);
      if (this.datagridFunction.rowContextmenu instanceof Function) {
        this.datagridFunction.rowContextmenu(...arguments);
      }
    },
    rowDblclick() {
      this.$emit("rowDblclick", ...arguments);
      if (this.datagridFunction.rowDblclick instanceof Function) {
        this.datagridFunction.rowDblclick(...arguments);
      }
    },
    headerClick() {
      this.$emit("headerClick", ...arguments);
      if (this.datagridFunction.headerClick instanceof Function) {
        this.datagridFunction.headerClick(...arguments);
      }
    },
    headerContextmenu() {
      this.$emit("headerContextmenu", ...arguments);
      if (this.datagridFunction.headerContextmenu instanceof Function) {
        this.datagridFunction.headerContextmenu(...arguments);
      }
    },
    sortChange() {
      this.$emit("sortChange", ...arguments);
      if (this.datagridFunction.sortChange instanceof Function) {
        this.datagridFunction.sortChange(...arguments);
      }
    },
    filterChange() {
      this.$emit("filterChange", ...arguments);
      if (this.datagridFunction.filterChange instanceof Function) {
        this.datagridFunction.filterChange(...arguments);
      }
    },
    currentChange() {
      this.$emit("currentChange", ...arguments);
      if (this.datagridFunction.currentChange instanceof Function) {
        this.datagridFunction.currentChange(...arguments);
      }
    },
    headerDragend() {
      this.$emit("headerDragend", ...arguments);
      if (this.datagridFunction.headerDragend instanceof Function) {
        this.datagridFunction.headerDragend(...arguments);
      }
    },
    expandChange() {
      this.$emit("expandChange", ...arguments);
      if (this.datagridFunction.expandChange instanceof Function) {
        this.datagridFunction.expandChange(...arguments);
      }
    },
  },
};
</script>
<style>

</style>