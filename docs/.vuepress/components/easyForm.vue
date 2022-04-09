<template>
    <msui-form :options="form"></msui-form>
</template>

<script>
export default {
  name: "easyForm",
  data() {
    return {
      form: this.initForm({
        name: "姓名",
        sex: "性别",
        birthday: "生日",
        age: "年龄",
        hobby: "爱好",
        gongzuo: "工作",
      })
    };
  },
  methods: {
    initForm(formModel) {
      formModel = new this.MsuiFormModel(formModel);
      return {
        labelWidth: "80px",
        labelPosition: "right",
        size: "small",
        disabled: false,
        formModel: formModel,
        inline: true
      };
    },
  },
};
</script>
