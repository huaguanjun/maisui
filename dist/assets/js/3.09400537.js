(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{510:function(t,e,i){},539:function(t,e,i){"use strict";i(510)},549:function(t,e,i){"use strict";i.r(e);var a=i(39),s=(i(48),i(7),i(154),i(110),i(254),{name:"myForm",data:function(){return{loading:!1,form1:this.initForm2({imgUrl:"应用图标"}),form2:this.initForm1({manufacturer:"开发厂商",version:"当前版本",group:"所属集群",deploymentName:"部署名称",appName:"应用名称",appCode:"应用编码",kind:"所属专业",type:"所属类别",url:"URL",desc:"应用描述"}),form3:this.initForm3({img:"",manifest:"",jingxiang:"",actor:""}),result:{}}},mounted:function(){var t=this;this.postForm=function(e){return t.$http.post("".concat(t.$api.PRE,"/appRegister/addApp"),e)},this.imgUrlPost=function(e){return t.$http.post("".concat(t.$api.PRE,"/appRegister/addAppImgUrl"),e)}},methods:{resetForm:function(){var t=this;["form1","form3","form2"].forEach((function(e){t.$refs[e].resetForm()})),this.result={}},submitForm:function(){var t=this;["form1","form3","form2"].forEach((function(e){t.$refs[e].submitForm()}));var e=Object.assign({},this.form1.formModel,this.form2.formModel,this.form3.formModel);if(Object.keys(e).length===Object.keys(this.result).length-2){this.loading=!0;var i=this.MsuiUtils.cloneDeep(this.result);i.imgUrl=i.imgUrl.map((function(t){return t.url}))[0],i.img=i.img.map((function(t){return{img:t.url,tenantCode:i.appCode}})),this.postForm(i).then((function(){return t.imgUrlPost(Object(a.a)(i.img))})).finally((function(){t.loading=!1}))}},initForm1:function(t){var e=this;return(t=new this.MsuiFormModel(t)).addRules([{required:!0,message:"必填字段不能为空",trigger:"blur"}]),t.desc.type({type:"textarea",span:24,rows:8}),t.type.type({options:[{label:"基础管理",value:"基础管理"},{label:"分析决策",value:"分析决策"},{label:"作业管理",value:"作业管理"},{label:"设备管理",value:"设备管理"}]},"Msui-SelectBox"),t.kind.type({options:[{label:"输电专业",value:"ts"},{label:"变电专业",value:"t"},{label:"直流专业",value:"dc"},{label:"配电专业",value:"ds"},{label:"技术专业",value:"tc"},{label:"计划专业",value:"pl"},{label:"综合专业",value:"im"}]},"Msui-SelectBox"),{labelWidth:"200px",labelPosition:"right",size:"small",disabled:!1,formModel:t,inline:!1,save:function(t){t.userId=e.$store.getters.userId,t.userName=e.$store.getters.username,e.result=Object.assign({},e.result,t)},span:8}},initForm2:function(t){var e=this;return(t=new this.MsuiFormModel(t)).addRules([{required:!0,message:"必填字段不能为空",trigger:"blur"}]),t.imgUrl.type({limit:1,beforeUpload:function(t){return!(t.size/1024>50||t.raw.type.indexOf("image")<0)||(e.$message({type:"error",message:"上传的图标大小要小于50KB"}),!1)}},"msui-upload"),{labelWidth:"1",labelPosition:"right",size:"small",disabled:!1,formModel:t,inline:!0,save:function(t){e.result=Object.assign({},e.result,t)},span:24}},initForm3:function(t){var e=this;return(t=new this.MsuiFormModel(t)).manifest.type({limit:2},"msui-upload"),t.img.type({limit:2,beforeUpload:function(t){return!(t.size/1024>400||t.raw.type.indexOf("image")<0)||(e.$message({type:"error",message:"上传的预览图大小要小于400KB"}),!1)}},"msui-upload"),t.jingxiang.type({data:[],index:!0,datagridModel:this.initFormDataGrid({name:"名称",jingxing:"镜像",version:"版本号"}),globalButton:[{type:"text",title:"新增",icon:"el-icon-folder-add",clickHandler:function(){console.log("cc")}}],attrs:{}},"msui-datagrid"),t.actor.type({limit:2},"msui-upload"),{labelWidth:"0",labelPosition:"right",size:"small",disabled:!1,formModel:t,inline:!1,save:function(t){e.result=Object.assign({},e.result,t)},span:12}},initFormDataGrid:function(t){return new this.MsuiDataGridModel({dataModel:t,align:"left"})}}}),n=(i(539),i(9)),r=Object(n.a)(s,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticStyle:{height:"100%",overflow:"auto"}},[i("el-col",{attrs:{span:1}},[i("msui-form",{ref:"form1",attrs:{options:t.form1},scopedSlots:t._u([{key:"save",fn:function(){},proxy:!0}])})],1),t._v(" "),i("el-col",{staticStyle:{"margin-bottom":"30px"},attrs:{span:23}},[i("msui-form",{ref:"form2",attrs:{options:t.form2},scopedSlots:t._u([{key:"save",fn:function(){},proxy:!0}])})],1),t._v(" "),i("msui-form",{ref:"form3",attrs:{options:t.form3},scopedSlots:t._u([{key:"manifest",fn:function(e){var a=e.item;return[i("div",{staticClass:"special-form-box"},[i("div",{staticClass:"title"},[i("div",{staticClass:"main-title"},[t._v("manifest文件")]),t._v(" "),i("span",[i("span",{staticStyle:{color:"red"}},[t._v("*")]),t._v("限两张")])]),t._v(" "),i("div",{staticStyle:{"padding-left":"10px"}},[t._v("\n          应用配置文件(不超过1MB),包含应用及模块组件配置信息\n        ")]),t._v(" "),i("div",{staticStyle:{"padding-left":"10px"}},[i(a.render(),{tag:"component",attrs:{attrs:a.getAttrs()},model:{value:a.value,callback:function(e){t.$set(a,"value",e)},expression:"item.value"}})],1)])]}},{key:"img",fn:function(e){var a=e.item;return[i("div",{staticClass:"special-form-box"},[i("div",{staticClass:"title"},[i("div",{staticClass:"main-title"},[t._v("应用预览图")]),t._v(" "),i("span",[i("span",{staticStyle:{color:"red"}},[t._v("*")]),t._v("限两张")])]),t._v(" "),i("div",{staticStyle:{"padding-left":"10px"}},[t._v("\n          应用预览图(不超过1MB),包含应用及模块组件配置信息\n        ")]),t._v(" "),i("div",{staticStyle:{"padding-left":"10px"}},[i(a.render(),{tag:"component",attrs:{attrs:a.getAttrs()},model:{value:a.value,callback:function(e){t.$set(a,"value",e)},expression:"item.value"}})],1)])]}},{key:"jingxiang",fn:function(e){var a=e.item;return[i("div",{staticClass:"special-form-box jingxiang"},[i("div",{staticClass:"title"},[i("div",{staticClass:"main-title"},[t._v("镜像列表")])]),t._v(" "),i("div",{staticStyle:{margin:"0 10px"}},[i(a.render(),{tag:"component",attrs:{options:a.getAttrs()},model:{value:a.value,callback:function(e){t.$set(a,"value",e)},expression:"item.value"}})],1)])]}},{key:"actor",fn:function(e){var a=e.item;return[i("div",{staticClass:"special-form-box jingxiang"},[i("div",{staticClass:"title"},[i("div",{staticClass:"main-title"},[t._v("角色授权")])]),t._v(" "),i("div",{staticStyle:{"padding-left":"10px",margin:"0 auto"}},[i("el-transfer",{attrs:{data:t.transferData},model:{value:a.value,callback:function(e){t.$set(a,"value",e)},expression:"item.value"}})],1)])]}},{key:"save",fn:function(){return[i("el-col",{staticStyle:{"text-align":"center"},attrs:{span:24}},[i("el-form-item",[i("el-button",{on:{click:t.resetForm}},[t._v("重置")]),t._v(" "),i("el-button",{attrs:{type:"primary",loading:t.loading},on:{click:t.submitForm}},[t._v("保存")])],1)],1)]},proxy:!0}])})],1)}),[],!1,null,"3429c83e",null);e.default=r.exports}}]);