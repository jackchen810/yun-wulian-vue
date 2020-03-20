<template>
    <div class="table">
        <h2>触发器配置信息:</h2>
        <el-table :data="triggerList" border style="width: 100%" ref="multipleTable" v-loading="loading">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="device_name" label="设备名称" width="120"></el-table-column>
            <el-table-column prop="devunit_name" label="设备元名称"></el-table-column>
            <el-table-column prop="varName" label="变量名字" width="120"></el-table-column>
            <el-table-column prop="if_symbol" label="符号" width="40"></el-table-column>
            <el-table-column prop="if_number" label="值" width="40"></el-table-column>
            <el-table-column prop="if_true_comment" label="判断正确输出"></el-table-column>
            <el-table-column prop="if_false_comment" label="判断错误输出"></el-table-column>
            <el-table-column prop="logs_type" label="日志类型"></el-table-column>
            <el-table-column label="操作" width="80">
            <template slot-scope="scope">
                <el-button class="btn1" type="primary" size="small" @click="trigger_delete(scope.row.index, scope.row._id)">删除</el-button>
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
                user_type:1,  //0:管理员, 1:用户
                user_account:'',
                radio3:'all',
                formLabelWidth: '120px',
                loading:false,
                fullscreenLoading: false,
                showDialogExport: false,


                triggerList:[],
                device_name:'',
                devunit_name:'',

                pageTotal:1,
                currentPage:1,
                page_size:10,


                data_range: '',

            }
        },
        created: function(){
            //console.log('2222', this.$route.query);
            this.user_type = localStorage.getItem('user_type');  //管理员或用户
            this.user_account = localStorage.getItem('user_account');  //管理员或用户

            this.getRountPush;
            this.getTriggerListData(1, this.page_size);
        },
        beforeDestroy:function () {

        },
        methods: {
            getTriggerListData: function(current_page, page_size){//获取rom列表
                let self = this;
                let params = {
                    page_size: page_size,
                    current_page: current_page,
                    filter: {devunit_name: self.devunit_name}
                };
                self.loading = true;
                self.$axios.post('/api/trigger/page/list', params).then(function(res){
                    self.loading = false;
                    console.log('[ShowTriggerConfig] get trigger data, params:', params);
                    if(res.data.ret_code == 0){
                        self.triggerList = res.data.extra;
                        //self.pageTotal = res.data.total;
                    }else{
                        self.$message.error(res.data.ret_msg);
                    }

                });
            },
            handleCurrentChange:function(val){
                this.currentPage = val;
                this.getTriggerListData(this.currentPage, this.page_size);
            },
            trigger_delete: function(index, _id){
                let self = this;
                let params = {_id: _id};
                self.loading = true;
                self.$axios.post('/api/trigger/del', params).then(function(res){
                    self.loading = false;
                    console.log('[ShowTriggerConfig] get trigger data, params:', params);
                    if(res.data.ret_code == 0){
                        self.triggerList.splice(index, 1);
                        self.$message.success(res.data.ret_msg);
                    }else{
                        self.$message.error(res.data.ret_msg);
                    }
                });
            },
        },
        computed:{
            getRountPush: function() {
                console.log('[ShowTriggerConfig] route push into device!');

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
    .title_box{margin-top:50px;}
    .btn_box{margin-top: 20px;margin-right: 50px;}
    .upload-demo .el-upload {cursor: pointer;position: relative;overflow: hidden;}
    .upload-demo .el-upload:hover {border-color: #409EFF;}
</style>
