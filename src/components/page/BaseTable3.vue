<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-star-on"></i> 数据管理</el-breadcrumb-item>
                <el-breadcrumb-item>数据列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <h4>基本信息:</h4>
        <el-table :data="system_setup_list" style="width: 100%" ref="multileTable">
            <el-table-column prop="project_name" label="项目名称" width="180"></el-table-column>
            <el-table-column prop="device_local" label="装备地点" width="100"></el-table-column>
            <el-table-column prop="device_name" label="设备名称" width="180"></el-table-column>
            <el-table-column prop="device_run_status" label="设备运行状态" width="120"></el-table-column>
            <el-table-column prop="device_link_status" label="设备链路状态" width="120"></el-table-column>
        </el-table>
        <el-table :data="listData" border style="width: 100%" ref="multipleTable" v-loading="loading">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="id" label="名称" width="180"></el-table-column>
            <el-table-column prop="desc" label="描述" width="240"></el-table-column>
            <el-table-column prop="quality" label="质量" width="100"></el-table-column>
            <el-table-column prop="value" label="值"></el-table-column>
            <el-table-column label="操作" width="250">
            <template slot-scope="scope">
                <el-button class="btn1" type="primary" size="small" @click="page_forward_chart(scope.row.id, scope.row.desc)">查看历史曲线</el-button>
            </template>
        </el-table-column>
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

                updateTimer: '',
                device_name: 'jinxi_1',
                channel_name: 'C1_D1',

                system_setup_list:[{
                    "project_name":"津西钢铁脱销项目",
                    "device_local":"津西",
                    "device_name":"1号高级氧化设备",
                    "device_run_status":"运行",
                    "device_link_status":"正常"}],
                listData:[],

                pageTotal:1,
                currentPage:1,
                page_size:10

            }
        },
        created: function(){
            //console.log('2222', this.$route.query);
            if (typeof(this.$route.query.device_name) != "undefined") {
                this.device_name = this.$route.query.device_name;
                this.channel_name = this.$route.query.channel_name;
                this.system_setup_list[0].device_name = this.$route.query.display_name;
            }
            this.getData(1, this.page_size);
        },
        methods: {
            getData: function(current_page, page_size){//获取rom列表
                var self = this;
                var params = {
                    channel_name: self.channel_name,
                    page_size: page_size,
                    current_page: current_page,
                    filter: {
                        device_name: self.device_name,
                    }
                };
                self.loading = true;
                self.$axios.post('/api/gateway/page/list', params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.listData = res.data.extra.slice(0, page_size);
                        self.pageTotal = res.data.total;
                    }else{
                        self.listData = [];
                        self.$message.error(res.data.ret_msg);
                    }


                    self.updateTimer = setTimeout(function(){
                        //self.getData(self.currentPage, self.page_size);
                        //window.location.reload();
                        history.go(0);//可以换成上一篇博客的任何一种方法。
                    },60000);
                });
            },
            handleCurrentChange:function(val){
                this.currentPage = val;
                this.getData(this.currentPage, this.page_size);
            },
            filterTag:function(value, row) {
                return row.comment === value;
            },
            page_forward_chart: function(tag_name, tag_desc){
                var params = {
                    device_name: this.device_name,
                    channel_name: this.channel_name,
                    tag_name: tag_name,
                    tag_desc: tag_desc,
                };

                //this.$message({message: params,type:'warning'});
                this.$router.push({name: '/charts', params :params});
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
