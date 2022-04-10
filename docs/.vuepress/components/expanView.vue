<template>
    <el-form class="demo-table-expand">
          <el-form-item
               v-for="item in options"
               :key="item.prop"
               :label="item.label">
            <span>{{ row[item.prop] }}</span>
          </el-form-item>
        </el-form>
</template>

<script>
export default {
    name: 'tableInstance',
    props: {
        row: {
            type: Object,
            default: () => {return {}}
        },
        options: {
            type: Array,
            default: () => {return []}
        }
    }
}
</script>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

</style>