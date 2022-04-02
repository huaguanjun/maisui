<template>
  <el-form
    ref="form"
    :model="options.formModel"
    :disabled="options.disabled"
    :size="options.size"
    :labelPosition="options.labelPosition"
    :label-width="options.labelWidth"
    :inline="options.inline"
  >
    <template v-for="(item, key) in options.formModel">
      <!-- 普通表格 -->
      <el-col v-if="!options.inline" :span="item.getSpan() || options.span" :key="key">
        <el-form-item :prop="key + '.value'" :rules="item.rules" :label="item.label">
          <!-- 插槽使用 -->
          <slot v-if="$scopedSlots[key]" :name="key" :item="item" :keys="key" />
          <!-- 默认使用 -->
          <component
            v-else
            v-model="item.value"
            :ref="key"
            :is="item.render()"
            :attrs="item.getAttrs()"
          />
        </el-form-item>
      </el-col>

      <!-- 表格inline使用 -->
      <el-form-item
        v-else
        :key="key"
        :prop="key + '.value'"
        :rules="item.rules"
        :label="item.label"
      >
        <!-- 插槽使用 -->
        <slot v-if="$scopedSlots[key]" :name="key" :item="item" :keys="key" />
        <!-- 默认使用 -->
        <component
          v-else
          v-model="item.value"
          :ref="key"
          :is="item.render()"
          :attrs="item.getAttrs()"
        />
      </el-form-item>
    </template>

    <!-- 保存按钮设置 -->
    <slot v-if="$scopedSlots['save']" name="save" :formModel="options.formModel"></slot>
    <el-col v-else :span="24" style="text-align: center">
      <el-form-item>
        <el-button @click="resetForm">重置</el-button>
        <el-button @click="submitForm" type="primary">保存</el-button>
      </el-form-item>
    </el-col>
  </el-form>
</template>

<script>
export default {
  name: "MsuiForm",
  props: {
    options: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  methods: {
    //   保存表单
    submitForm() {
      return this.$refs.form.validate((valid) => {
        if (valid) {
          const formModel = this.options.formModel;
          const formData = {};
          for (let key in formModel) {
            formData[key] = formModel[key].value;
          }

          // 执行保存逻辑，向外抛出表单数据
          this.$emit("saveForm", formData);
          if (this.options.save instanceof Function) {
            this.options.save(formData);
          }
          return formData;
        } else {
          return false;
        }
      });
    },
    // 重置表单
    resetForm() {
      this.$refs.form.resetFields();
        if (this.options.reset instanceof Function) {
          this.options.reset();
        }
    },
  },
};
</script>
