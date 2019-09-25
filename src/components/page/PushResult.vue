<template>
    <div class="table">
        <div style="overflow: hidden;">
            <div class="crumbs" style="float:left;">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-upload"></i> 版本升级</el-breadcrumb-item>
                    <!--<el-breadcrumb-item>推送结果</el-breadcrumb-item>-->
                </el-breadcrumb>
            </div>
            <div style="float:right;">
                <el-button icon="icon iconfont icon-zhifeiji" type="primary" @click="dialogUpdataVisible=true">升级设备</el-button>
            </div>
        </div>
        <hr style="border:none;border-top:1px solid #efefef;margin-top:10px;margin-bottom:20px;"/>
        <div class='rad-group'>
            <el-radio-group v-model="curRadio" @change="changeTab">
                <el-radio-button label="firmware">ROM升级</el-radio-button>
                <el-radio-button label="apps">插件升级</el-radio-button>
                <el-radio-button label="script">脚本推送</el-radio-button>
            </el-radio-group>
            <el-form :inline="true" class="handle-box2">
                <el-form-item label="">
                    <el-input v-model="search_word" placeholder="请输入设备MAC"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-table :data="listData" border style="width: 100%" ref="multipleTable" v-loading="loading">
            <el-table-column prop="request_msg" label="操作" width="120">
                <template slot-scope="scope">
                    <!--<el-tag>{{JSON.parse(scope.row.request_msg).item == 'sysinfo'?'ROM升级':'其他'}}</el-tag>-->
                    <el-tag type="primary">{{curRadio == 'firmware'?'ROM升级':(curRadio == 'apps'?'插件升级':'脚本升级')}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="request_timestamp" sortable label="时间" width="170"></el-table-column>
            <el-table-column prop="_id" label="任务ID" width="320"></el-table-column>
            <el-table-column prop="mac" label="指定MAC" width="160">
                <template slot-scope="scope">{{scope.row.mac.length>1?scope.row.mac[0] + ' ···':scope.row.mac.toString()}}</template>
            </el-table-column>
            <el-table-column prop="upgrade_mode" label="升级方式" width="100">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.upgrade_mode == '1' ? 'warning' : (scope.row.upgrade_mode=='2'?'success':'primary')" close-transition>{{scope.row.upgrade_mode == '1'?'实时自动':(scope.row.upgrade_mode == '2'?'用户自动':'定时自动')}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="结果" width="150">
                <el-table-column prop="success_count" label="成功">
                    <template slot-scope="scope">
                        <el-tag type="success">{{scope.row.success_count}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="fail_count" label="失败">
                    <template slot-scope="scope">
                        <el-tag type="danger">{{scope.row.fail_count}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="running_count" label="执行中">
                    <template slot-scope="scope">
                        <el-tag type="warning">{{scope.row.running_count}}</el-tag>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column prop="operator_name" label="操作人" width="120"></el-table-column>
            <el-table-column label="详情">
                <template slot-scope="scope">
                    <el-button class="btn1" type="info" size="small" @click="goDetail(scope.row._id)">详情</el-button>
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

        <el-dialog title="升级设备" :visible.sync="dialogUpdataVisible" custom-class="diagcontpush">
            <div>
                <setpushnew v-bind:typeListData="typeListData" v-on:listenAppsEvent="thenPushApps" v-on:listenScriptEvent="thenPushScript" v-on:listenFirmwareEvent="thenPushFirmware"></setpushnew>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import global_ from 'components/common/Global';
    import  SetpushNew from 'components/page/SetPushNew';
    export default {
        data: function(){
            const self = this;
            return {
                curRadio:'firmware',
                search_word:'',
                listData:[],
                pageTotal:0,
                currentPage:1,
                loading:true,

                dialogUpdataVisible:false,
                typeListData:[],


            }
        },
        // props:['typeListData'],
        created:function(){
            this.getParams();
            // this.getFirmwareData({});
            this.getTypes();
        },
        components:{
            'setpushnew':SetpushNew
        },
        methods: {
            thenPushFirmware:function(data){
                var self = this;
                self.dialogUpdataVisible = false;
                self.curRadio = 'firmware';
                self.getFirmwareData({});
            },
            thenPushApps:function(data){
                var self = this;
                self.dialogUpdataVisible = false;
                // console.log(data);
                self.curRadio = 'apps';
                self.getAppsData({});
            },
            thenPushScript:function(data){
                var self = this;
                self.dialogUpdataVisible = false;
                self.curRadio = 'script';
                self.getScriptData({});
            },
            getParams: function(){
                var self = this;
                self.curRadio = self.$route.query.curRadio || 'firmware';
                var userName = localStorage.getItem('userMsg')=='0'?'':localStorage.getItem('ms_username');
                var params = userName==''?{}:{filter:{user_name:userName}};
                if(self.curRadio == 'firmware'){//rom升级
                    self.getFirmwareData(params);
                }
                if(self.curRadio == 'apps'){//插件升级
                    self.getAppsData({});
                }
                if(self.curRadio == 'script'){//脚本升级
                    self.getScriptData({});
                }
            },
            getTypes: function(){//获取设备型号
                var self = this;
                self.$axios.post('/api/devtype/types').then(function(res){
                    if(res.data.ret_code == '1001'){
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == 0){
                        self.typeListData = res.data.extra;
                    }
                })
            },
            getFirmwareData: function(params){
                var self = this;
                self.$axios.post('/api/rom/task/list/sysupgrade',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == '1001'){
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == 0){
                        self.pageTotal = res.data.extra.count || self.pageTotal;
                        self.listData = res.data.extra.resultList;
                        // if(!params.hasOwnProperty('current_page')){
                        // // if(JSON.stringify(params) == '{}'){
                        //     self.pageTotal = res.data.extra.length;
                        //     self.listData = res.data.extra.slice(0,10);
                        // }else{
                        //     self.listData = res.data.extra;
                        // }
                    }else{
                        self.$message.error(res.data.extra);
                    }
                },function(err){
                    self.loading = false;
                    console.log(err);
                });
            },
            getAppsData: function(params){
                var self = this;
                self.$axios.post('/api/apps/task/apps_result',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == '1001'){
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == 0){
                        self.pageTotal = res.data.extra.count || self.pageTotal;
                        // if(!params.hasOwnProperty('current_page')){
                            // self.pageTotal = res.data.extra.length;
                            // self.listData = res.data.extra.slice(0,10);
                            self.listData = res.data.extra.apps_task;
                        // }else{
                        //     self.listData = res.data.extra;
                        // }
                    }else{
                        self.$message.error(res.data.extra)
                    }
                },function(err){
                    self.loading = false;
                    console.log(err);
                });
            },
            getScriptData: function(params){
                var self = this;
                self.$axios.post('/api/apps/task/script_result',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == '1001'){
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == 0){
                        self.pageTotal = res.data.extra.count || self.pageTotal;
                        // if(JSON.stringify(params) == '{}'){
                        //     self.pageTotal = res.data.extra.length;
                        //     self.listData = res.data.extra.slice(0,10);
                        // }else{
                        //     self.listData = res.data.extra;
                        // }
                        self.listData = res.data.extra.script_task;
                    }else{
                        self.$message.error(res.data.extra)
                    }
                },function(err){
                    self.loading = false;
                    console.log(err);
                });
            },
            changeTab: function(){
                var self = this;
                self.currentPage = 1;
                if(self.curRadio == 'firmware'){
                    self.getFirmwareData({});
                }
                if(self.curRadio == 'apps'){
                    self.getAppsData({});
                }
                if(self.curRadio == 'script'){
                    self.getScriptData({});
                }
            },
            handleCurrentChange:function(val){
                var self = this;
                self.currentPage = val;
                var params = {
                    page_size:10,current_page:this.currentPage
                };
                if(self.search_word!=''){
                    if(!self.validateSearchWord(self.search_word)){
                        return false;
                    }else{
                        var filter = {'mac':(self.search_word.indexOf(':')>=0?self.search_word.replace(/:/g,''):self.search_word).toUpperCase()};
                        params['filter'] = filter;
                    }
                }
                if(self.curRadio == 'firmware'){
                    self.getFirmwareData(params);
                }
                if(self.curRadio == 'apps'){
                    self.getAppsData(params);
                }
                if(self.curRadio == 'script'){
                    self.getScriptData(params);
                }

            },
            validateSearchWord: function(macstr){
                var self = this;
                var reg_name = /^[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}$/;
                var reg_name2 = /^[A-Fa-f\d]{2}[A-Fa-f\d]{2}[A-Fa-f\d]{2}[A-Fa-f\d]{2}[A-Fa-f\d]{2}[A-Fa-f\d]{2}$/;
                if(macstr == ''){
                    self.$message({message:'输入不能为空',type:'warning'});
                    return false;
                }
                if(!reg_name.test(macstr) && !reg_name2.test(macstr)){
                    self.$message({message:'设备MAC输入有误',type:'warning'});
                    return false;
                }
                return true;
            },
            search: function(){
                var self = this;
                self.currentPage = 1;
                if(!self.validateSearchWord(self.search_word)){
                    return false;
                }
                self.loading = true;
                var mac = self.search_word;
                var str = (mac.indexOf(':')>=0?mac.replace(/:/g,''):mac).toUpperCase();
                var params = {
                    filter:{"mac":str}
                };
                var urlStr = self.curRadio=='firmware'?'/api/rom/task/list/sysupgrade':(self.curRadio=='apps'?'/api/apps/apps_query':'/api/apps/script_query');
                self.$axios.post(urlStr,params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == '1001'){
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == 0){
                        self.pageTotal = res.data.extra.length;
                        self.listData = res.data.extra.slice(0,10);
                    }
                })

            },
            goDetail: function(id){
                this.$router.push({path:'/pushresultdetail',query:{curid:id,curRadio:this.curRadio}});
            }
        },
    }
</script>
<style scoped>
    .crumbs{margin-bottom:0;margin-top:10px;}
    .demo-table-expand {  font-size: 0;  }
    .demo-table-expand label {  width: 90px;  color: #99a9bf;}
    .demo-table-expand .el-form-item {  margin-right: 0;  margin-bottom: 0;  width: 33%;  }
    .rad-group{margin-bottom:20px;}
    .handle-input{  width: 300px;  display: inline-block;  }
    .handle-box2{display:inline-block;float:right;}
    .pagecont{margin-top:30px;}
</style>
<style>
    .diagcontpush{min-width:850px;}
</style>
