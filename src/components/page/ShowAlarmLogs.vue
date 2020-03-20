<template>
    <div class="table">
        <div class="title_box">
            <h2>{{logs_type}}</h2>
        </div>
        <el-radio-group v-model="curRadio" @change="changeTab">
            <el-radio-button label="devlog">设备日志</el-radio-button>
            <el-radio-button label="oplog">操作日志</el-radio-button>
        </el-radio-group>
        <el-tabs v-model="tabs_tbl">
            <el-tab-pane label="" name="1">
                <el-table :data="alarmLogList" border style="width: 100%" ref="multipleTable" v-loading="loading">
                    <el-table-column type="index" label="序号" width="50"></el-table-column>
                    <el-table-column prop="update_time" label="时间" width="180"></el-table-column>
                    <el-table-column prop="device_name" label="设备名称" width="250"></el-table-column>
                    <el-table-column prop="comment" label="设备日志"></el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="" name="2">

            </el-tab-pane>
        </el-tabs>
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
                user_type:1,  //0:管理员, 1:用户
                user_account:'',
                logs_type:'设备日志',
                curRadio:'devlog',
                tabs_tbl: '1',

                formLabelWidth: '120px',
                loading:false,
                fullscreenLoading: false,
                showDialogExport: false,


                alarmLogList:[],
                device_name:'',
                devunit_name:'',



                pageTotal_dev: 1,
                pageTotal_op: 1,

                pageTotal:1,
                currentPage:1,
                page_size:10,
            }
        },
        created: function(){
            //console.log('2222', this.$route.query);
            this.user_type = localStorage.getItem('user_type');  //管理员或用户
            this.user_account = localStorage.getItem('user_account');  //管理员或用户

            this.getRountPush;
            this.getAlarmLogsData(1, this.page_size);
        },
        beforeDestroy:function () {

        },
        methods: {
            getAlarmLogsData: function(current_page, page_size){//获取rom列表
                let self = this;
                let params = {
                    page_size: page_size,
                    current_page: current_page,
                    filter: {devunit_name: self.devunit_name}
                };
                self.loading = true;
                self.$axios.post('/api/alarm/logs/page/list', params).then(function(res){
                    self.loading = false;
                    console.log('[ShowAlarmLogs] get alarm data, list:', res.data);
                    if(res.data.ret_code == 0){
                        self.alarmLogList = res.data.extra;
                        self.pageTotal = res.data.total;
                        self.pageTotal_dev = res.data.total;
                    }else{
                        self.$message.error(res.data.ret_msg);
                    }

                });
            },
            handleCurrentChange:function(val){
                this.currentPage = val;
                this.getAlarmLogsData(this.currentPage, this.page_size);
            },
            trigger_delete: function(index, _id){
                let self = this;
                let params = {_id: _id};
                self.loading = true;
                self.$axios.post('/api/trigger/del', params).then(function(res){
                    self.loading = false;
                    console.log('[ShowAlarmLogs] del alarm data, params:', params);
                    if(res.data.ret_code == 0){
                        self.alarmLogList.splice(index, 1);
                        self.$message.success(res.data.ret_msg);
                    }else{
                        self.$message.error(res.data.ret_msg);
                    }
                });
            },

            changeTab: function(){
                var self = this;
                self.currentPage = 1;
                if(self.curRadio == 'devlog'){
                    //self.getFirmwareData({});
                    self.logs_type = '设备日志';
                    self.tabs_tbl = '1';
                    self.pageTotal = self.pageTotal_dev;
                }
                if(self.curRadio == 'oplog'){
                    //self.getAppsData({});
                    self.logs_type = '操作日志';
                    self.tabs_tbl = '2';
                    self.pageTotal = self.pageTotal_op;
                }
            },
        },
        computed:{
            getRountPush: function() {
                console.log('[ShowAlarmLogs] route push into device!');

                if (typeof(this.$route.params.devunit_name) === "undefined") {
                    this.devunit_name = localStorage.getItem('devunit_name');
                    console.log('devunit_name:', this.devunit_name);
                }
                else{
                    this.devunit_name = this.$route.params.devunit_name;
                    localStorage.setItem('devunit_name', this.devunit_name);
                }

                console.log('get $route.params:', this.$route.params);
                //因为在main.js中已经全局注册了store，所以这里直接用this.$直接使用。
                //return task_id;
            }
        }
    }
</script>

<style>
    .rad-group{margin-bottom:20px;}
    .orange{color:#eb9e05;background-color:inherit;}
    .title_box{margin-top: 1px;margin-bottom:20px;}
    .btn_box{margin-top: 20px;margin-right: 50px;}
    .upload-demo .el-upload {cursor: pointer;position: relative;overflow: hidden;}
    .upload-demo .el-upload:hover {border-color: #409EFF;}
</style>
