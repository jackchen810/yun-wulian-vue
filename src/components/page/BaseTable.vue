<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-star-on"></i> 数据管理</el-breadcrumb-item>
                <el-breadcrumb-item>数据列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <h4>基本信息:</h4>
        <el-table :data="system_setup_list" border style="width: 100%;margin:20px 0 20px;" ref="multileTable" v-loading="setup_loading">
            <el-table-column prop="project_name" label="项目名称"></el-table-column>
            <el-table-column prop="device_local" label="装备地点"></el-table-column>
            <el-table-column prop="device_name" label="设备名称"></el-table-column>
            <el-table-column prop="device_run_status" label="设备运行状态"></el-table-column>
            <el-table-column prop="device_link_status" label="设备链路状态"></el-table-column>
        </el-table>
        <el-table :data="listData" border style="width: 100%" ref="multipleTable" v-loading="loading">
            <el-table-column prop="index" label="序号" width="80"></el-table-column>
            <el-table-column prop="id" label="名称" width="180"></el-table-column>
            <el-table-column prop="desc" label="描述" width="240"></el-table-column>
            <el-table-column prop="quality" label="质量" width="100"></el-table-column>
            <el-table-column prop="value" label="值"></el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                @current-change ="handleCurrentChange"
                :current-page="currentPage"
                layout="prev, pager, next"
                :total="pageTotal">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    //import global_ from 'components/common/Global';
    var crypto = require('crypto');
    export default {
        data: function(){
            return {
                radio3:'all',
                formLabelWidth: '120px',
                loading:false,
                fullscreenLoading: false,

                system_setup_list:[{"project_name":"津西钢铁脱销项目","device_local":"津西","device_name":"津西1#高级氧化设备","device_run_status":"运行","device_link_status":"正常"}],
                listData:[],

                pageTotal:1,
                currentPage:1,
                page_size:10

            }
        },
        created: function(){
            this.getData(1, this.page_size);
            //this.getDataLength();
        },
        methods: {
            /*
            getDataLength: function(){//获取task列表
                var self = this;
                self.loading = true;
                self.$axios.post('/api/log/list/length').then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.pageTotal = res.data.extra;
                    }
                });
            },
            */
            getData: function(current_page, page_size){//获取rom列表
                var self = this;
                var params = {
                    page_size: page_size,
                    current_page: current_page,
                    filter: {device_name: 'jinxi_1'}
                };
                self.loading = true;
                self.$axios.post('/api/gateway/data/list', params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        if(JSON.stringify(params) == '{}'){
                            self.listData = res.data.extra.slice(0,10);
                            self.pageTotal = res.data.total;
                        }else{
                            self.listData = res.data.extra;
                            self.pageTotal = res.data.total;
                        }
                    }
                });
            },
            handleCurrentChange:function(val){
                this.currentPage = val;
                this.getData(this.currentPage, this.page_size);
            },
            filterTag:function(value, row) {
                return row.comment === value;
            },
        },
        computed:{

        }
    }
</script>

<style>
    .rad-group{margin-bottom:20px;}
    .handle-input{  width: 300px;  display: inline-block;  }
    .handle-box2{display:inline-block;float:right;}
    .orange{color:#eb9e05;background-color:inherit;}
    .btn2{margin-bottom:5px;margin-left:0;}
    .diainp{width:217px;}
    .diainp2{width:400px;}
    .upload-demo .el-upload {cursor: pointer;position: relative;overflow: hidden;}
    .upload-demo .el-upload:hover {border-color: #409EFF;}
</style>
