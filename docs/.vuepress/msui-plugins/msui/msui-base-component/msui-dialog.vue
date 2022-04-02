<template>
  <el-dialog
    :title="attrs.title || '弹窗'"
    :top="attrs.top || '15vh'"
    :visible.sync="dialogVisible"
    :width="attrs.width || '30%'"
    :custom-class="attrs.customClass || ''"
    :fullscreen="attrs.fullscreen || false"
    :close-on-click-modal="attrs.closeOnClickModal || true"
    :close-on-press-escape="attrs.closeOnPressEscape || true"
    :modal="attrs.modal || false"
    :show-close="attrs.showClose || true"
    :center="attrs.center || true"
    :destroy-on-close="attrs.destroyOnlose || true"
    :before-close="attrs.beforeClose"
    @open="open"
    @opened="opened"
    @close="close"
    @closed="closed"
  >
    <slot name="content"></slot>
    <span v-if="attrs.showFoot || true" slot="footer" class="dialog-footer">
      <el-button :size="attrs.size || 'mini'" @click="dialogVisible = false"> 取消 </el-button>
      <el-button :size="attrs.size || 'mini'" type="primary" @click="confirm"> 确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "MsuiDialog",
  props: {
    options: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisible: false
    };
  },
  computed: {
    attrs() {
      return this.options.attrs || {}
    },
    dialogFunction() {
      return this.options.dialogFunction || {};
    }
  },
  methods: {
    open() {
      this.dialogVisible = true;
      this.$emit("open");
      if(this.dialogFunction.open instanceof Function) {
        this.dialogFunction.open()
      }
    },
    opened() {
      this.$emit("opened");
      if(this.dialogFunction.opened instanceof Function) {
        this.dialogFunction.opened()
      }
    },
    close() {
      this.dialogVisible = false;
      this.$emit("close");
      if(this.dialogFunction.close instanceof Function) {
        this.dialogFunction.close()
      }
    },
    closed() {
      this.$emit("closed");
      if(this.dialogFunction.closed instanceof Function) {
        this.dialogFunction.closed()
      }
    },
    confirm() {
      this.$emit("confirm");
      if(this.dialogFunction.confirm instanceof Function) {
        this.dialogFunction.confirm()
      }
      this.dialogVisible = false;
    }
  },
};
</script>
