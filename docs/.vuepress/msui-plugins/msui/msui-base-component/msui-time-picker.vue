<template>
  <el-date-picker
    ref="time"
    v-model="val"
    :readonly="readonly"
    :disabled="disabled"
    :editable="editable"
    :clearable="clearable"
    :size="size"
    :placeholder="placeholder"
    :startPlaceholder="startPlaceholder"
    :endPlaceholder="endPlaceholder"
    :timeArrowControl="timeArrowControl"
    :type="type"
    :format="format"
    :align="align"
    :pickerOptions="pickerOptions"
    :rangeSeparator="rangeSeparator"
    :defaultValue="defaultValue"
    :name="name"
    :unlinkPanels="unlinkPanels"
    :prefixIcon="prefixIcon"
    :clearIcon="clearIcon"
    @blur="blur"
    @change="change"
    @focus="focus"
  >
  </el-date-picker>
</template>

<script>
export default {
  name: "MsuiTimePicker",
  props: {
    attrs: {
      type: Object,
      default: () => {
        return {};
      },
    },
    value: {
      type: Array | String,
      default: () => {
        return []
      }
    }
  },
  computed: {
    val: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  data() {
    return {
      readonly: this.attrs.readonly || false,
      disabled: this.attrs.disabled || false,
      editable: this.attrs.editable || true,
      clearable: this.attrs.clearable || true,
      size: this.attrs.size || "mini",
      placeholder: this.attrs.placeholder || "请选择时间日期",
      startPlaceholder: this.attrs.startPlaceholder || null,
      endPlaceholder: this.attrs.endPlaceholder || null,
      timeArrowControl: this.attrs.timeArrowControl || false,
      type: this.attrs.type || "datetime",
      format: this.attrs.format || "yyyy-MM-dd HH:mm:ss",
      align: this.attrs.align || "left",
      pickerOptions: this.attrs.pickerOptions || {},
      rangeSeparator: this.attrs.rangeSeparator || "-",
      defaultValue: this.attrs.defaultValue || null,
      defaultTime: this.attrs.defaultTime || new Date(),
      valueFormat: this.attrs.valueFormat || null,
      name: this.attrs.name || null,
      unlinkPanels: this.attrs.unlinkPanels || false,
      prefixIcon: this.attrs.prefixIcon || "el-icon-date",
      clearIcon: this.attrs.clearIcon || "el-icon-circle-close",
      blur: this.attrs.blur || function () {},
      change: this.attrs.change || function () {},
      focus: this.attrs.focus || function () {},
    };
  }
};
</script>
<style lang="less" scoped>
</style>