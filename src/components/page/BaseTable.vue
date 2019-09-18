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
            <el-table-column prop="device_name" label="设备名称" width="180"></el-table-column>
            <el-table-column prop="device_run_status" label="设备运行状态" width="120"></el-table-column>
            <el-table-column prop="device_link_status" label="设备链路状态" width="120"></el-table-column>
            <el-table-column prop="update_time" label="数据更新时间" width="200"></el-table-column>
        </el-table>
        <el-button class="btn_box" type="primary" icon="el-icon-view" @click="page_forward_module_status">查看模块状态</el-button>
        <el-button class="btn_box" type="primary" icon="el-icon-view" @click="showDialogExport = true">导出数据记录</el-button>
        <h4 class="title_box">详细数据:</h4>
        <el-table :data="listData" border style="width: 100%" ref="multipleTable" v-loading="loading">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="varName" label="描述" width="240"></el-table-column>
            <el-table-column prop="varValue" label="值"></el-table-column>
            <el-table-column label="操作" width="250">
            <template slot-scope="scope">
                <el-button class="btn1" type="primary" size="small" @click="page_forward_chart(scope.row.varName, scope.row.varId)">查看历史曲线</el-button>
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
        <el-dialog title="选择日期" :visible.sync="showDialogExport" class="digcont">
            <div class="block">
                <span class="demonstration">请选择导出范围：</span>
                <el-date-picker
                    v-model="data_range"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions2">
                </el-date-picker>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showDialogExport = false">取 消</el-button>
                <el-button @click="exportData(data_range)">导 出</el-button>
            </div>
        </el-dialog>
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


                updateTimer: '',

                system_setup_list:[{
                    "project_name":"津西钢铁脱销项目",
                    "project_local":"津西",
                    "devunit_name":"jinxi_1",
                    "device_name":"高级氧化1#设备",
                    "device_run_status":"运行",
                    "device_link_status":"正常",
                    "update_time":"" }],
                listData:[],

                pageTotal:1,
                currentPage:1,
                page_size:10,


                data_range: '',
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一年',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },

            }
        },
        created: function(){
            //console.log('2222', this.$route.query);
            this.user_type = localStorage.getItem('user_type');  //管理员或用户
            this.user_account = localStorage.getItem('user_account');  //管理员或用户
            if (typeof(this.$route.query.device_name) != "undefined") {
                this.system_setup_list[0].project_name = this.$route.query.project_name;
                this.system_setup_list[0].project_local = '';
                this.system_setup_list[0].device_name = this.$route.query.device_name;
                this.system_setup_list[0].devunit_name = this.$route.query.devunit_name;
            }
            this.getProjectData();
            this.getDeviceRealData(1, this.page_size);
        },
        beforeDestroy:function () {
            if(this.updateTimer != ''){
                clearInterval(this.updateTimer);
                console.log('[basetable] clear timer,' + this.updateTimer);
                this.updateTimer = '';
            }
        },
        watch: {
            '$route' (to, from) {
                console.log('[basetable] 路由参数变化，刷新数据', this.$route.path);

                if (typeof(this.$route.query.device_name) != "undefined") {
                    this.system_setup_list[0].project_name = this.$route.query.project_name;
                    this.system_setup_list[0].project_local = '';
                    this.system_setup_list[0].device_name = this.$route.query.device_name;
                    this.system_setup_list[0].devunit_name = this.$route.query.devunit_name;
                }
                //console.log(this.getStatus(this.$route.path))
                this.getProjectData();
                this.getDeviceRealData(1, this.page_size);
            }
        },
        methods: {

            getProjectData: function() {//获取rom列表
                let self = this;
                let params = {
                    filter: {
                        project_name: self.system_setup_list[0].project_name,
                    }
                };
                self.loading = true;
                self.$axios.post('/api/project/manage/list',params).then(function(res){
                    self.loading = false;
                    if (res.data.ret_code == 0 && res.data.extra.length > 0) {
                        self.system_setup_list[0].project_local = res.data.extra[0].project_local;
                        //self.pageTotal = res.data.total;
                    } else {
                        self.$message.error(res.data.ret_msg);
                    }
                })
            },
            getDeviceRealData: function(current_page, page_size){//获取rom列表
                let self = this;
                let params = {
                    filter: {
                        devunit_name: self.system_setup_list[0].devunit_name ,
                    }
                };
                self.loading = true;
                self.$axios.post('/api/gateway/real/data', params).then(function(res){
                    self.loading = false;
                    console.log('[basetable] get real data, params:', params);
                    console.log('[basetable] get real data, return:', res.data);
                    if(res.data.ret_code == 0){
                        self.listData = res.data.extra.data;
                        self.system_setup_list[0].update_time = res.data.extra.update_time;
                        //self.pageTotal = res.data.total;
                    }else{
                        self.listData = [];
                        self.$message.error(res.data.ret_msg);
                    }

                    //如果timer存在就直接返回
                    if (self.updateTimer != ''){
                        console.log('[basetable] timer exist, return');
                        return;
                    }
                    self.updateTimer = setInterval(function(){
                        //self.updateTimer = setTimeout(function(){
                        //self.getData(self.currentPage, self.page_size);
                        //window.location.reload();
                        //history.go(0);//可以换成上一篇博客的任何一种方法。
                        let params = {
                            filter: {
                                devunit_name: self.system_setup_list[0].devunit_name ,
                            }
                        };
                        self.$axios.post('/api/gateway/real/data', params).then(function(rett) {
                            //console.log('[basetable timer] get real data, params:', params);
                            console.log('[basetable timer] get real data, return:', rett.data);
                            if (rett.data.ret_code == 0) {
                                self.listData = rett.data.extra.data;
                                self.system_setup_list[0].update_time = rett.data.extra.update_time;
                            } else {
                                self.listData = [];
                                self.$message.error(rett.data.ret_msg);
                            }
                        });
                    },60000);
                    //当前页面切换后，定时器也可以关掉
                });
            },
            exportData: function(data_range){
                let self = this;
                let params = {
                    data_range: data_range,
                    devunit_name: self.system_setup_list[0].devunit_name ,
                };

                console.log('[basetable] range:', data_range);


                self.loading  = true;
                //self.$axios.post('/api/gateway/real/data', params).then(function(res){
                self.$axios.post('/api/device/manage/export/history', params).then(function(res){
                    if(res.data.ret_code == 0){
                        const aLink = document.createElement('a');
                        const evt = document.createEvent('MouseEvents');
                        // var evt = document.createEvent("HTMLEvents")
                        evt.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                        var str = res.data.extra;
                        var index = str.lastIndexOf("\/");
                        str  = str .substring(index + 1, str .length);
                        aLink.download = str;
                        aLink.href = res.data.extra;
                        aLink.dispatchEvent(evt);
                        self.$message({message:'导出成功',type:'success'})
                    }else{
                        self.$message.error(res.data.extra);
                    }
                },function(err){
                    self.loading  = false;
                    self.$message.error(err);
                })
                //*/
            },
            handleCurrentChange:function(val){
                this.currentPage = val;
                this.getDeviceRealData(this.currentPage, this.page_size);
            },
            filterTag:function(value, row) {
                return row.comment === value;
            },
            page_forward_chart: function(var_name, var_id){
                let params = {
                    devunit_name: this.system_setup_list[0].devunit_name,
                    var_name: var_name,
                    var_id: var_id,
                };

                //this.$message({message: params,type:'warning'});
                this.$router.push({name: '/charts', params :params});
            },
            page_forward_module_status() {
                console.log('[basetable] page_forward_module_status!');
                let params = {
                    devunit_name: this.system_setup_list[0].devunit_name,
                };
                console.log('[basetable] push params:', params);
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
    .upload-demo .el-upload {cursor: pointer;position: relative;overflow: hidden;}
    .upload-demo .el-upload:hover {border-color: #409EFF;}
</style>
