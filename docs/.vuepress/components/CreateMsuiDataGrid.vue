<template>
    <div class="demo-block">
        <div id="dataGrid"></div>
    </div>
</template>

<script>
    import {MsuiModelTemplate, MsuiDataGrid} from '../msui-plugins/export'

    export default {
        name: 'CreateMsuiDataGrid',

        methods: {
            initModel(){
                const gridModel = new MsuiModelTemplate({
                    name: '名称',
                    age: '年龄',
                    sex: '性别',
                    address: '地址'
                }).isDataGridModel();

                return gridModel;
            },

            initGrid(){
                const gridModel = this.initModel();
                const grid = new MsuiDataGrid({
                    dataModel: gridModel,
                    modularProxy: {
                        loader: {
                            url: 'http://localhost:2334/dataApi/grid.json'
                        }
                    }
                });

                grid.render('#dataGrid');
                grid.load();
            }
        },

        mounted() {
            this.initGrid();
        }

    }
</script>

<style>
    .demo-block{
        height: 500px;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 3px;
    }
</style>
