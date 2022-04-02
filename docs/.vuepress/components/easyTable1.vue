<template>
    <msui-datagrid :options="datagridOptions"/>
</template>
<script>
    export default {
    name: 'easyTable1',
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
            datagridModel.sex
            .formatterData({
                data: new Promise((reslove) => {
                setTimeout(() => {
                    reslove([
                    {
                        label: "男",
                        value: 1,
                    },
                    {
                        label: "女",
                        value: 0,
                    },
                    ]);
                }, 1000);
                }),
            })
            .formatter((value) => {
                return datagridModel.sex.data.find((item) => item.value === value)?.label;
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