<template>
  <el-select
    style="width: 100%"
    ref="select"
    v-model="val"
    :multiple="attrs.multiple || false"
    :disabled="attrs.disabled || false"
    :size="attrs.size || null"
    :clearable="attrs.clearable || true"
    :collapseTags="attrs.collapseTags || true"
    :multipleLimit="attrs.multipleLimit || 0"
    :placeholder="attrs.placeholder || '请输入'"
    :filterable="attrs.filterable || false"
    :allowCreate="attrs.allowCreate || false"
    :remote="attrs.remote || false"
    :loadingText="attrs.loadingText || '加载中'"
    :noMatchText="attrs.noMatchText || '无匹配数据'"
    :noDataText="attrs.noDataText || '无数据'"
    :popperClass="attrs.popperClass || null"
    :reserveKeyword="attrs.reserveKeyword || false"
    :defaultFirstOption="attrs.defaultFirstOption || false"
    :popperAppendToBody="attrs.popperAppendToBody || true"
    :automaticDropdown="attrs.automaticDropdown || false"
    :filterMethod="attrs.filterMethod || function () {}"
    :remoteMethod="attrs.remoteMethod || function () {}"
    @change="change"
    @blur="blur"
  >
    <el-option
      v-for="item in attrs.options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>
<script>
export default {
  name:"MsuiSelectBox",
  props: {
    attrs:{
      type: Object,
      default: () => {
        return {};
      },
    },
    value: {
      type: String || Array,
      default:() => {
        return []
      }
    }
  },
  computed: {
      val: {
        get() {
          return  this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      }
  },
  methods: {
    change(value) {
      this.$emit('change', value)
      if(this.attrs.change instanceof Function) {
        this.attrs.change(value)
      }
    },
    blur() {
      this.$emit('blur', this.attrs.value)
      if(this.attrs.blur instanceof Function) {
        this.attrs.blur(this.attrs.value)
      }
    }
  }
};
</script>
