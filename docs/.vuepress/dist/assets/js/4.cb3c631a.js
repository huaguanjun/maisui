(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{516:function(t,e,i){},545:function(t,e,i){"use strict";i(516)},556:function(t,e,i){"use strict";i.r(e);i(48),i(7),i(154),i(258);var a={name:"myForm",data:function(){return{transferData:function(t){var e=[],i=["shanghai","beijing","guangzhou","shenzhen","nanjing","xian","chengdu"];return["上海","北京","广州","深圳","南京","西安","成都"].forEach((function(t,a){e.push({label:t,key:a,pinyin:i[a]})})),e}(),loading:!1,form1:this.initForm1({manufacturer:"开发厂商",version:"当前版本",group:"所属集群",deploymentName:"部署名称",appName:"应用名称",appCode:"应用编码",kind:"所属专业",type:"所属类别",url:"URL",desc:"应用描述"}),form2:this.initForm2({img:"",jingxiang:"",actor:""}),result:{}}},methods:{resetForm:function(){var t=this;["form1","form2"].forEach((function(e){t.$refs[e].resetForm()})),this.result={}},submitForm:function(){var t=this;["form1","form2"].forEach((function(e){t.$refs[e].submitForm()}));var e=Object.assign({},this.form1.formModel,this.form2.formModel);if(Object.keys(e).length===Object.keys(this.result).length){this.loading=!0;var i=this.MsuiUtils.cloneDeep(this.result);alert(i)}},initForm1:function(t){var e=this;return(t=new this.MsuiFormModel(t)).addRules([{required:!0,message:"必填字段不能为空",trigger:"blur"}]),t.desc.type({type:"textarea",span:24,rows:8}),t.type.type({options:[{label:"基础管理",value:"基础管理"},{label:"分析决策",value:"分析决策"},{label:"作业管理",value:"作业管理"}]},"Msui-SelectBox"),t.kind.type({options:[{label:"输电专业",value:"ts"},{label:"变电专业",value:"t"},{label:"直流专业",value:"dc"}]},"Msui-SelectBox"),{labelWidth:"100px",labelPosition:"right",size:"small",disabled:!1,formModel:t,inline:!1,save:function(t){e.result=Object.assign({},e.result,t)},showButton:!1,span:8}},initForm2:function(t){var e=this;return(t=new this.MsuiFormModel(t)).img.type({limit:2,beforeUpload:function(t){return!(t.size/1024>400||t.raw.type.indexOf("image")<0)||(e.$message({type:"error",message:"上传的预览图大小要小于400KB"}),!1)}},"msui-upload"),t.jingxiang.type({data:[],index:!0,datagridModel:this.initFormDataGrid({name:"名称",jingxing:"镜像",version:"版本号"}),globalButton:[{type:"text",title:"新增",icon:"el-icon-folder-add",clickHandler:function(){console.log("cc")}}],attrs:{}},"msui-datagrid"),t.actor.type({limit:2,span:24}),{labelWidth:"0",labelPosition:"right",size:"small",disabled:!1,formModel:t,inline:!1,save:function(t){e.result=Object.assign({},e.result,t)},showButton:!1,span:12}},initFormDataGrid:function(t){return new this.MsuiDataGridModel({dataModel:t,align:"left"})}}},n=(i(545),i(9)),s=Object(n.a)(a,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticStyle:{"margin-top":"30px"}},[i("msui-form",{ref:"form1",attrs:{options:t.form1}}),t._v(" "),i("msui-form",{ref:"form2",attrs:{options:t.form2},scopedSlots:t._u([{key:"img",fn:function(e){var a=e.item;return[i("div",{staticClass:"special-form-box"},[i("div",{staticClass:"title"},[i("div",{staticClass:"main-title"},[t._v("应用预览图")]),t._v(" "),i("span",{staticStyle:{color:"black"}},[i("span",{staticStyle:{color:"red"}},[t._v("*")]),t._v("限两张")])]),t._v(" "),i("div",{staticStyle:{"padding-left":"10px"}},[t._v("\n          应用预览图(不超过1MB),包含应用及模块组件配置信息\n        ")]),t._v(" "),i("div",{staticStyle:{"padding-left":"10px"}},[i(a.render(),{tag:"component",attrs:{attrs:a.getAttrs()},model:{value:a.value,callback:function(e){t.$set(a,"value",e)},expression:"item.value"}})],1)])]}},{key:"jingxiang",fn:function(e){var a=e.item;return[i("div",{staticClass:"special-form-box"},[i("div",{staticClass:"title"},[i("div",{staticClass:"main-title"},[t._v("镜像列表")])]),t._v(" "),i("div",{staticStyle:{margin:"0 10px"}},[i(a.render(),{tag:"component",attrs:{options:a.getAttrs()},model:{value:a.value,callback:function(e){t.$set(a,"value",e)},expression:"item.value"}})],1)])]}},{key:"actor",fn:function(e){var a=e.item;return[i("div",{staticClass:"special-form-box jingxiang"},[i("div",{staticClass:"title"},[i("div",{staticClass:"main-title"},[t._v("角色授权")])]),t._v(" "),i("div",{staticStyle:{"padding-left":"10px",margin:"0 auto"}},[i("el-transfer",{attrs:{data:t.transferData},model:{value:a.value,callback:function(e){t.$set(a,"value",e)},expression:"item.value"}})],1)])]}},{key:"save",fn:function(){return[i("el-col",{staticStyle:{"text-align":"center"},attrs:{span:24}},[i("el-form-item",[i("el-button",{on:{click:t.resetForm}},[t._v("重置")]),t._v(" "),i("el-button",{attrs:{type:"primary",loading:t.loading},on:{click:t.submitForm}},[t._v("保存")])],1)],1)]},proxy:!0}])})],1)}),[],!1,null,"6d130a6c",null);e.default=s.exports}}]);