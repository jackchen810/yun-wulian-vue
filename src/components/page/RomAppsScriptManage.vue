<template>
    <div class="table">
        <el-radio-group v-model="curRadio" @change="changeTab">
            <el-radio-button label="firmware">ROM管理</el-radio-button>
            <el-radio-button label="apps">插件管理</el-radio-button>
            <el-radio-button label="script">脚本管理</el-radio-button>
        </el-radio-group>
        <div class="handle-box2" v-if="isShow">
            <el-button type="primary" icon="plus" class="handle-del mr10" @click="dialogUpdataVisible=true">创建版本</el-button>
        </div>


        <el-tabs v-model="tabs_tbl">
            <el-tab-pane label="" name="1">
                <el-table :data="listData1" border style="width: 100%" ref="multipleTable" v-loading="loading">
                    <el-table-column prop="create_date" label="创建时间" width="170"></el-table-column>
                    <el-table-column prop="file_name" label="文件名" width="300"></el-table-column>
                    <el-table-column prop="rom_version" label="ROM版本号" width="170"></el-table-column>
                    <el-table-column prop="ver_type" label="版本类型" width="160" :filters="[{ text: '测试版本', value: '测试版本' }, { text: '正式版本', value: '正式版本' }]" :filter-method="filterTag">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.ver_type == '测试版本' ? 'warning' : 'success'"  size="small" close-transition>{{scope.row.ver_type}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="dev_type" label="设备型号" width="160"></el-table-column>
                    <el-table-column prop="comment" label="更新说明"></el-table-column>
                    <el-table-column label="操作" v-if="isShow" width="160">
                        <template slot-scope="scope">
                            <el-button class="btn1" type="text" size="small" @click="downloadRom(scope.row._id,scope.row.file_name,scope.row.rom_status)">下载</el-button>
                            <el-button class="btn1" type="text" size="small" @click="delRom(scope.row._id,scope.row.file_name,scope.$index)">删除</el-button>
                            <el-button class="btn1" type="danger" size="small" v-if="scope.row.rom_status =='normal'" @click="revokeRom(scope.row._id,scope.row.file_name)">下架</el-button>
                            <el-button class="btn1" type="success" size="small" v-else @click="releaseRom(scope.row._id,scope.row.file_name)">上架</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>



            <el-tab-pane label="" name="2">
                <el-table :data="listData2" border style="width: 100%" ref="multipleTable" v-loading="loading">
                    <el-table-column prop="create_date" label="上传时间" width="200"></el-table-column>
                    <el-table-column prop="pkg_name" label="插件名称" width="360"></el-table-column>
                    <el-table-column prop="pkg_version" label="版本号"></el-table-column>
                    <!--<el-table-column prop="pkg_developer" label="开发者"></el-table-column>-->
                    <el-table-column prop="pkg_info" label="插件说明"></el-table-column>
                    <el-table-column label="操作" v-if="isShow">
                        <template slot-scope="scope" width="120">
                            <el-button type="success" size="small" @click="downloadPlugin(scope.row.pkg_name)">下载</el-button>
                            <el-button type="danger" size="small" @click="delPlugin(scope.row._id, scope.row.pkg_name)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>



            <el-tab-pane label="" name="3">
                <el-table :data="listData3" border style="width: 100%" ref="multipleTable" v-loading="loading">
                    <el-table-column prop="script_create_time" label="上传时间" width="200"></el-table-column>
                    <el-table-column prop="script_name" label="脚本名称"></el-table-column>
                    <!--<el-table-column prop="script_version" label="版本号" width="150"></el-table-column>-->
                    <!--<el-table-column prop="script_developer" label="开发者" width="110"></el-table-column>-->
                    <el-table-column prop="script_info" label="脚本说明"></el-table-column>
                    <el-table-column label="操作" v-if="isShow">
                        <template slot-scope="scope" width="120">
                            <el-button type="success" size="small" @click="downloadScript(scope.row.script_name)">下载</el-button>
                            <el-button type="danger" size="small" @click="delScript(scope.row.script_name)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
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
        <el-dialog title="设备版本管理" :visible.sync="dialogUpdataVisible" custom-class="diagcontpush">
            <div>
                <manageSub v-bind:typeListData="typeListData" v-on:listenUploadEvent="thenUploadEvent"></manageSub>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    //import global_ from 'components/common/Global';;
    import  manageSub from 'components/page/RomAppsScriptManageSub';
    //var crypto = require('crypto');
    export default {
        data: function(){
            return {
                isShow:localStorage.getItem('userMsg') =='1'?false:true,
                dialogFormVisible:false,
                curRadio:'firmware',
                dialogUpdataVisible:false,
                tabs_tbl: '1',


                loading:false,
                fullscreenLoading: false,
                typeListData:[],
                listData1:[],
                listData2:[],
                listData3:[],

                pageTotal:1,
                currentPage:1,
                page_size:10

            }
        },
        components:{
            'manageSub':manageSub
        },
        created: function(){
            this.getFirmwareData({});
            this.getTypes();
        },
        methods: {
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

            thenUploadEvent:function(data){
                var self = this;

                if (data == "cancle"){
                    self.dialogUpdataVisible = false;
                }
                else if(data == "form1"){
                    self.curRadio = 'firmware';
                    self.getFirmwareData({});
                }
                else if(data == "form2"){
                    self.curRadio = 'apps';
                    self.getAppsData({});
                }
                else if(data == "form3"){
                    self.curRadio = 'script';
                    self.getScriptData({});
                }
                self.dialogUpdataVisible = false;
            },
            getFirmwareData: function(params){//获取rom列表
                var self = this;
                self.loading = true;
                self.$axios.post('api/rom/list',params).then(function(res){
//                    console.log(res);
                    self.loading = false;
                    if(res.data.ret_code == '1001'){
                        self.$message({message:res.data.ret_msg,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == 0){
                        if(JSON.stringify(params) == '{}'){
                            self.pageTotal = res.data.extra.length;
                            self.listData1 = res.data.extra.slice(0,10);
                        }else{
                            self.listData1 = res.data.extra;
                        }

                    }else{
                        self.$message.error(res.data.extra)
                    }
                })
            },

            getAppsData: function(params){
                var self = this;
                self.$axios.post('/api/apps/list',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == '1001'){
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == 0){
                        if(JSON.stringify(params) == '{}'){
                            self.pageTotal = res.data.extra.length;
                            self.listData2 = res.data.extra.slice(0,10);
                        }else{
                            self.listData2 = res.data.extra;
                        }

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
                self.$axios.post('/api/script/list',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == '1001'){
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == 0){
                        if(JSON.stringify(params) == '{}'){
                            self.pageTotal = res.data.extra.length;
                            self.listData3 = res.data.extra.slice(0,10);
                        }else{
                            self.listData3 = res.data.extra;
                        }
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
                    self.tabs_tbl = '1';
                }
                if(self.curRadio == 'apps'){
                    self.getAppsData({});
                    self.tabs_tbl = '2';
                }
                if(self.curRadio == 'script'){
                    self.getScriptData({});
                    self.tabs_tbl = '3';
                }
            },
            handleCurrentChange:function(val){
                this.currentPage = val;
                this.getData({page_size:10,current_page:this.currentPage});
            },
            cancelDialog:function() {
                this.dialogUpdataVisible = false;
            },

            downloadRom: function(id,fileName,status){//下载
                var self = this;
                if(status == 'revoke'){
                    self.$message({message:'固件已下架',type:'warning'});
                    return false;
                }
                var params = {
                    _id: id,
                    file_name:fileName
                };
                self.loading = true;
                self.$axios.post('api/rom/download/check',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        const aLink = document.createElement('a');
                        const evt = document.createEvent('MouseEvents');
                        // var evt = document.createEvent("HTMLEvents")
                        evt.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                        aLink.download = fileName;
                        aLink.href = res.data.extra.access_path;
                        aLink.dispatchEvent(evt)

                    }else{
                        self.$message.error(res.data.ret_msg);
                    }
                },function(err){
                    self.$message.error('下载失败');
                    self.loading = false;
                    console.log(err);
                })
                /*self.$axios.post('api/rom/download',params).then(function(res){
                    self.loading = false;
                    // console.log(res);
                    var blob = new Blob([res.data]);
                    var reader = new FileReader();
                    reader.readAsDataURL(blob);  // 转换为base64，可以直接放入a表情href
                    reader.onload = function (e) {
                        // 转换完成，创建一个a标签用于下载
                        var a = document.createElement('a');
                        a.download = fileName;
                        a.href = e.target.result;
                        console.log(e.target.result);
                        document.body.appendChild(a);  // 修复firefox中无法触发click
                        a.click();
                        document.body.removeChild(a);
                    }
                    if(res.data.ret_code == '1001'){
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }else{
                        self.$message.error(res.data.extra);
                    }

                },function(err){
                    self.$message.error('下载失败');
                    self.loading = false;
                    console.log(err);
                })*/
            },
            delRom: function(id,fileName,i){//删除
                var self = this;
                var params = {
                    _id: id,
                    file_name:fileName
                };
                self.loading = true;
                self.$axios.post('api/rom/del',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == '1001'){
                        self.$message({message:res.data.ret_msg,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == 0){
                        self.$message({message:'删除成功',type:'success'});
                        self.getFirmwareData({});
                    }
                    else{
                        self.$message.error(res.data.extra)
                    }

                },function(err){
                    self.$message.error('删除失败');
                    self.loading = false;
                    console.log(err);
                })
            },
            releaseRom: function(id,fileName){//上架操作
                var self = this;
                var params = {
                    _id: id,
                    file_name:fileName
                };
                self.loading = true;
                self.$axios.post('api/rom/release',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == '1001'){
                        self.$message({message:res.data.ret_msg,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == 0){
                        self.$message({message:'操作成功',type:'success'});
                        self.getData();
                    }else{
                        self.$message.error(res.data.ret_msg)
                    }

                },function(err){
                    self.$message.error('操作失败');
                    self.loading = false;
                })
            },
            revokeRom: function(id,fileName){//下架操作
                var self = this;
                var params = {
                    _id: id,
                    file_name:fileName
                };
                self.loading = true;
                self.$axios.post('api/rom/revoke',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == '1001'){
                        self.$message({message:res.data.ret_msg,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == 0){
                        self.$message({message:'操作成功',type:'success'});
                        self.getData();
                    }else{
                        self.$message.error(res.data.ret_msg)
                    }

                },function(err){
                    self.$message.error('操作失败');
                    self.loading = false;
                })
            },

            downloadPlugin: function(fileName){//下载
                var self = this;
                var params = {
                    pkg_name:fileName
                };
                self.loading = true;
                self.$axios.post('/api/apps/download',params).then(function(res){
                    self.loading = false;

                    if(res.data.ret_code == 0){
                        const aLink = document.createElement('a');
                        const evt = document.createEvent('MouseEvents');
                        // var evt = document.createEvent("HTMLEvents")
                        evt.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                        aLink.download = fileName;
                        aLink.href = global_.baseUrl+res.data.extra;
                        aLink.dispatchEvent(evt)
                    }else{
                        self.$message.error(res.data.extra);
                    }

                    if(res.data.ret_code == '1001'){
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }

                },function(err){
                    self.$message.error('下载失败');
                    self.loading = false;
                    console.log(err);
                })
            },
            delPlugin: function(id, fileName){//删除
                var self = this;
                var params = {
                    _id: id,
                    pkg_name:fileName
                };
                self.loading = true;
                self.$axios.post('/api/apps/del',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.$message({message:'删除成功',type:'success'});
                        self.isShowDetail = false;
                        self.getAppsData({});
                    }else{
                        self.$message.error(res.data.ret_msg)
                    }

                },function(err){
                    self.$message.error('删除失败');
                    self.loading = false;
                    // console.log(err);
                })
            },

            downloadScript: function(fileName){//下载
                var self = this;
                var params = {
                    script_name:fileName
                };
                self.loading = true;
                self.$axios.defaults.timeout = 25000;
                self.$axios.post('/api/script/download',params).then(function(res){
                    self.loading = false;
                    if(res.status == 200){
                        var blob = new Blob([res.data]);
                        var reader = new FileReader();
                        reader.readAsDataURL(blob);  // 转换为base64，可以直接放入a表情href
                        reader.onload = function (e) {
                            // 转换完成，创建一个a标签用于下载
                            var a = document.createElement('a');
                            a.download = fileName;
                            a.href = e.target.result;
                            // $("body").append(a);
                            // a.click();
                            // $(a).remove();
                            document.body.appendChild(a);  // 修复firefox中无法触发click
                            a.click();
                            document.body.removeChild(a);

                        }
                    }

                    if(res.data.ret_code == '1001'){
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == 0){
                        self.$message({message:'下载成功',type:'success'});
                        self.getData();
                    }else{
                        self.$message.error(res.data.extra)
                    }

                },function(err){
                    self.$message.error(res);
                    self.loading = false;
                    console.log(err);
                })
            },
            delScript: function(fileName){//删除
                var self = this;
                var params = {
                    script_name:fileName
                };
                self.loading = true;
                self.$axios.post('/api/script/del',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == '1001'){
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == 0){
                        self.$message({message:'删除成功',type:'success'});
                        self.getScriptData({});
                    }else{
                        self.$message.error(res.data.extra)
                    }

                },function(err){
                    self.$message.error('删除失败');
                    self.loading = false;
                    // console.log(err);
                })
            },


            filterTag:function(value, row) {
                return row.ver_type === value;
            },
            changePage:function(values) {
                this.information.pagination.per_page = values.perpage;
                this.information.data = this.information.data;
            },
        },
        computed:{

        }
    }
</script>

<style>
    .rad-group{margin-bottom:20px;}
    .handle-box2{display:inline-block;float:right;}
    .orange{color:#eb9e05;background-color:unset;}
    .btn2{margin-bottom:5px;margin-left:0;}
    .diainp{width:217px;}
    .diainp2{width:400px;}
    .upload-demo .el-upload {cursor: pointer;position: relative;overflow: hidden;}
    .upload-demo .el-upload:hover {border-color: #409EFF;}
</style>
