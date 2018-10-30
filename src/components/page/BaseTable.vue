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
            <el-table-column prop="project_local" label="装备地点" width="100"></el-table-column>
            <el-table-column prop="device_name_cn" label="设备名称" width="180"></el-table-column>
            <el-table-column prop="device_run_status" label="设备运行状态" width="120"></el-table-column>
            <el-table-column prop="device_link_status" label="设备链路状态" width="120"></el-table-column>
            <el-table-column prop="update_time" label="数据更新时间" width="200"></el-table-column>
        </el-table>
        <el-button class="btn_box" type="primary" icon="el-icon-view" @click="page_forward_module_status">查看模块状态</el-button>
        <h4 class="title_box">详细数据:</h4>
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
    let crypto = require('crypto');
    export default {
        data: function(){
            return {
                radio3:'all',
                formLabelWidth: '120px',
                loading:false,
                fullscreenLoading: false,

                updateTimer: '',
                //device_name: 'jinxi_1',
                //channel_name: 'C1_D1',

                system_setup_list:[{
                    "channel_name":"C1_D1",
                    "project_name":"津西钢铁脱销项目",
                    "project_local":"津西",
                    "device_name":"jinxi_1",
                    "device_name_cn":"高级氧化1#设备",
                    "device_run_status":"运行",
                    "device_link_status":"正常",
                    "update_time":"" }],
                listData:[],

                pageTotal:1,
                currentPage:1,
                page_size:10

            }
        },
        created: function(){
            //console.log('2222', this.$route.query);
            if (typeof(this.$route.query.device_name) != "undefined") {
                this.system_setup_list[0].project_name = this.$route.query.project_name;
                this.system_setup_list[0].project_local = this.$route.query.project_local;
                this.system_setup_list[0].device_name = this.$route.query.device_name;
                this.system_setup_list[0].channel_name = this.$route.query.channel_name;
                this.system_setup_list[0].device_name_cn = this.$route.query.display_name;
            }
            this.getData(1, this.page_size);
        },
        watch: {
            '$route' (to, from) {
                console.log('路由参数变化，刷新数据', this.$route.path);

                if (typeof(this.$route.query.device_name) != "undefined") {
                    this.system_setup_list[0].project_name = this.$route.query.project_name;
                    this.system_setup_list[0].project_local = this.$route.query.project_local;
                    this.system_setup_list[0].device_name = this.$route.query.device_name;
                    this.system_setup_list[0].channel_name = this.$route.query.channel_name;
                    this.system_setup_list[0].device_name_cn = this.$route.query.display_name;
                }
                //console.log(this.getStatus(this.$route.path))
                this.getData(1, this.page_size);
            }
        },
        methods: {
            getData: function(current_page, page_size){//获取rom列表
                let self = this;
                let params = {
                    filter: {
                        device_name: self.system_setup_list[0].device_name ,
                    }
                };
                self.loading = true;
                self.$axios.post('/api/gateway/real/data', params).then(function(res){
                    self.loading = false;
                    let channel_name = self.system_setup_list[0].channel_name;
                    console.log('extra:', res.data.extra);
                    console.log('params:', params);
                    console.log('channel_name:', channel_name);
                    if(res.data.ret_code == 0){
                        self.listData = res.data.extra.data[channel_name];
                        self.system_setup_list[0].update_time = res.data.extra.update_time;
                        //self.pageTotal = res.data.total;
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
                let params = {
                    device_name: this.system_setup_list[0].device_name,
                    channel_name: this.system_setup_list[0].channel_name,
                    tag_name: tag_name,
                    tag_desc: tag_desc,
                };

                //this.$message({message: params,type:'warning'});
                this.$router.push({name: '/charts', params :params});
            },
            page_forward_module_status() {
                console.log('page_forward_module_status!');
                let params = {
                    device_name: this.system_setup_list[0].device_name,
                    channel_name: this.system_setup_list[0].channel_name,
                };
                this.$router.push({name: '/devicemodule', params :params});
            }
        },
        computed:{

        }
    }
</script>

<style>
    .rad-group{margin-bottom:20px;}
    .orange{color:#eb9e05;background-color:inherit;}
    .title_box{margin-top:50px;}
    .btn_box{margin-top: 20px;margin-right: 50px;}
    .diainp2{width:400px;}
    .upload-demo .el-upload {cursor: pointer;position: relative;overflow: hidden;}
    .upload-demo .el-upload:hover {border-color: #409EFF;}
</style>
