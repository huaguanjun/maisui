<template>
  <div class="table-content">
    <msui-datagrid class="msui-datagrid" ref="msuiDatagrid" :options="datagridOptions"></msui-datagrid>
    <msui-pagination class="table-page" ref="msuiPagination" @change="pageChange" :attrs="pageAttrs"/>
  </div>
</template>
<script>
export default {
  name:'modelListCore',
  data() {
    return {
      pageAttrs: {
        currentPage: 1
      },
      datagridOptions: {}
    };
  },
  props: {
    url: {
      type: Object,
      default: () => {
        return {
          get: "",
          post: "",
        };
      },
    },
    model: {
      type: Object,
      default: () => {
        return {};
      },
    },
    params: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  mounted() {
      this.init();
      this.initDatagrid();
  },
  watch: {
    params: {
      handler: function() {
        this.load({
          currentPage: 1,
          pageSize: 10,
        });
        this.$refs.msuiPagination.currentPage = 1
      },
      deep: true
    },
    'model.data': {
      handler: function() {
        this.datagridOptions.data.unshift(this.model.data)
      },
    }
  },
  methods: {
    init() {
      this.initAxios();
    },
    initDatagrid() {
      this.datagridOptions = {
        data:  this.model.data,
        index: this.model.index || true,
        selection: this.model.selection || true,
        expand: this.model.expand || false,
        datagridModel: this.model.datagridModel,
        globalButton: this.model.globalButton || [],
        inlineButton: this.model.inlineButton || [],
        attrs: {
           height: 600,
           loading: false
        },
        datagridFunction: Object.assign(this.model.datagridFunction || {}, {
        }),
      };
    },
    initAxios() {
      //表格数据接口
      this.getList = (params) => {
        return this.$http.get(`${this.$api.PRE}${this.url.get}`, { params });
      };
      // 修改接口
      this.postList = (data) => {
        return this.$http.post(`${this.$api.PRE}${this.url.post}`, data)
      };
    },
    load(params) {
      if (params) {
        params = Object.assign(params, this.params);
      }
      this.datagridOptions.attrs.loading = true;
      this.getList(params).then(({data}) => {
        this.$emit('changeData', data, this.datagridOptions, this.$refs.msuiPagination)
        this.datagridOptions.attrs.loading = false;
      });
    },
    pageChange(currentPage = 1, pageSize) {
      this.load({ pageSize, currentPage });
    }
  },
};
</script>
<style scoped>
.table-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: auto;
  justify-content: center;
}
.table-content .msui-datagrid {
    flex: 1;
    overflow: auto;
  }
.table-content .table-page {
    flex: 0 0 30px;
    box-sizing: border-box;
  }
</style>
