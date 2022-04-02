 function MsuiMessage({
     text = "请确定是否要进行此操作",
     title = "提示",
     type = "warning",
     successCallBack,
     center = false,
     errorCallBack = () => {},
     errorMessage = "取消操作",
     errorType = 'info'
    } = {}) {
    return this.$confirm(text, title, {cancelButtonText: '取消', confirmButtonText: '确定', center, type: type || 'warning'})
       .then(() => {
            successCallBack()
        })
        .catch(() => {
            if(errorCallBack instanceof Function) {
                errorCallBack()
            }
            this.$message({
                type: errorType,
                message: errorMessage
            });  
    });
}
export default MsuiMessage