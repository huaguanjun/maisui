<template>
    <el-upload
        ref="ElUpload"
        :action="attrs.action || 'http://xxxx' "
        :headers="attrs.headers || {}"
        :list-type="attrs.listType || 'picture-card'"
        :on-remove="handleRemove"
        :http-request='request'
        :auto-upload="false"
        :multiple="false"
        :limit="attrs.limit || 3"
        :on-exceed="handleExceed"
        :on-change="onChange"
        :file-list="fileList">
         <i class="el-icon-upload" style="color: rgb(13, 134, 127);font-size: 70px;line-height: 148px"></i>
    </el-upload>
</template>
<script>
  export default {
    name: 'MsuiUpload',
    data() {
      return {
        fileList: [],
        cloneList: []
      };
    },
    props: {
        attrs: {
            type: Object,
            default: () => {
                return {}
            }
        },
        value: {
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
    watch: {
      val() {
        if(this.val == '') {
          this.fileList = []
        } else if (typeof this.val == 'string') {
          this.fileList = [{url: 'data:image/webp;base64,'+ this.val}]
          this.$emit('input', this.fileList )
        }
      }
    },
    methods: {
      onChange(file, fileList){
        let confirmUpload = true
        if(this.attrs.beforeUpload instanceof Function) {
          confirmUpload = this.attrs.beforeUpload(file)
        }
        if(confirmUpload) {
            this.fileList = fileList
            let reader = new FileReader();
            reader.readAsDataURL(file.raw);
            reader.onload = (e) =>{
              const cloneData = this.MsuiUtils.cloneDeep(this.fileList[this.fileList.length -1])
              cloneData.url = e.target.result.split(',')[1]
              this.cloneList.push(cloneData)
              this.$emit('input', this.cloneList)
            };
        } else {
            fileList.splice(fileList.length -1, 1)
        }
      },
      handleRemove(file, fileList){
        this.fileList = fileList
      },
      request() {
         return true
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 ${this.attrs.limit || 3} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      }
    }
  }
</script>
<style scoped>
.msui-upload {
    width: 150px;
    height: 150px;
    display: inline-block;
    border: 1px dashed #ccc;
}
.msui-upload i {
    line-height: 150px;
}
</style>