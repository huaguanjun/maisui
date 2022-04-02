<template>
    <msui-datagrid :options="datagridOptions"/>
</template>
<script>
    export default {
    name: 'easyTable',
    data() {
        return {
        datagridOptions: this.initDatagridModel({
            name: "姓名",
            sex: "性别",
            hobbies: "爱好",
            job: "工作",
        }),
        };
    },
    methods: {
        initDatagridModel(model) {
        const datagridModel = new this.MsuiDataGridModel({
            dataModel: model,
            align: "center",
        });
        return {
            datagridModel,
            data: [
                {sex: 1,name: "小明",hobbies: "唱歌",job: "程序员",},
                { sex: 0, name: "小红", hobbies: "跳舞", job: "文员"},
                {sex: 1,name: "小明",hobbies: "唱歌",job: "程序员",},
                { sex: 0, name: "小红", hobbies: "跳舞", job: "文员" }
            ]
        };
        },
    },
    };
</script>