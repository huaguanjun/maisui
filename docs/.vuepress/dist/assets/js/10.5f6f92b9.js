(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{496:function(t,e,n){"use strict";var a=n(3),i=n(57).find,o=n(155),r=!0;"find"in[]&&Array(1).find((function(){r=!1})),a({target:"Array",proto:!0,forced:r},{find:function(t){return i(this,t,arguments.length>1?arguments[1]:void 0)}}),o("find")},552:function(t,e,n){"use strict";n.r(e);n(7),n(269),n(496);var a={name:"easyTable1",data:function(){return{datagridOptions:this.initDatagridModel({name:"姓名",sex:"性别",hobbies:"爱好",job:"工作"})}},methods:{initDatagridModel:function(t){var e=new this.MsuiDataGridModel({dataModel:t,align:"center"});return e.sex.formatterData({data:new Promise((function(t){setTimeout((function(){t([{label:"男",value:1},{label:"女",value:0}])}),1e3)}))}).formatter((function(t){var n;return null===(n=e.sex.data.find((function(e){return e.value===t})))||void 0===n?void 0:n.label})),{datagridModel:e,data:[{sex:1,name:"小明",hobbies:"唱歌",job:"程序员"},{sex:0,name:"小红",hobbies:"跳舞",job:"文员"},{sex:1,name:"小明",hobbies:"唱歌",job:"程序员"},{sex:0,name:"小红",hobbies:"跳舞",job:"文员"}]}}}},i=n(9),o=Object(i.a)(a,(function(){var t=this.$createElement;return(this._self._c||t)("msui-datagrid",{attrs:{options:this.datagridOptions}})}),[],!1,null,null,null);e.default=o.exports}}]);