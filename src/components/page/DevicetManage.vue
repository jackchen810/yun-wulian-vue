<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-star-on"></i> 项目信息管理</el-breadcrumb-item>
                <el-breadcrumb-item>设备管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box rad-group" v-if="isShow">
            <el-button type="primary" icon="plus" class="handle-del mr10" @click="clickDialogBtn">添加设备</el-button>
        </div>
        <el-table :data="listData" border style="width: 100%" ref="multipleTable" v-loading="loading">
            <el-table-column prop="update_time" label="创建时间" width="170"></el-table-column>
            <el-table-column prop="device_name" label="设备名称" width="300"></el-table-column>
            <el-table-column prop="prject_name" label="所属项目" width="160"></el-table-column>
            <el-table-column prop="device_status" label="设备状态" width="160"></el-table-column>
            <el-table-column prop="device_image" label="设备图片" width="160"></el-table-column>
            <el-table-column prop="comment" label="备注说明"></el-table-column>
            <el-table-column label="操作" v-if="isShow" width="160">
                <template slot-scope="scope">
                    <el-button class="btn1" type="text" size="small" @click="delProject(scope.row._id,scope.row.device_name,scope.$index)">删除</el-button>
                    <el-button class="btn1" type="danger" size="small" v-if="scope.row.device_status =='normal'" @click="freezeDevice(scope.row._id,scope.row.device_name)">冻结</el-button>
                    <el-button class="btn1" type="success" size="small" v-else @click="releaseDevice(scope.row._id,scope.row.device_name)">解冻</el-button>
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

        <el-dialog title="添加设备" :visible.sync="dialogFormVisible" class="digcont">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="上传" :label-width="formLabelWidth">
                    <el-upload
                            class="upload-demo"
                            ref="upload"
                            name="file_name"
                            with-credentials
                            :limit="1"
                            :action="uploadUrl"
                            :data="form"
                            :beforeUpload="beforeUpload"
                            :on-change="handleChange"
                            :on-success="handleSuccess"
                            :on-error="handleError"
                            :file-list="fileList"
                            :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取设备图片</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="设备名称" prop=device_name :label-width="formLabelWidth">
                    <el-input v-model="form.device_name" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="设备所属项目" prop="prject_name" :label-width="formLabelWidth">
                    <el-select v-model="form.prject_name" placeholder="请选择设备所属项目">
                        <el-option
                                v-for="item in prjOwnerList"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注说明" prop="comment" :label-width="formLabelWidth">
                    <el-input v-model="form.comment" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitUpload('form')">添 加</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    //import global_ from 'components/common/Global';
    //var crypto = require('crypto');
    export default {
        data: function(){
            return {
                user_type:1,  //0:管理员, 1:用户
                user_account:'',
                uploadUrl:"api/device/add",
                isShow:localStorage.getItem('userMsg') =='1'?false:true,
                dialogFormVisible:false,
                radio3:'全部',
                form: {
                    file_name:'',
                    device_name:'',
                    prject_name:'',
                    device_image:'',
                    comment:''
                },
                rules: {
                    device_name:[
                        {required: true, message: '请输入设备名称', trigger: 'blur'}
                    ],
                    prject_name:[
                        {required: true, message: '请输入所属项目', trigger: 'blur'}
                    ],
                },
                formLabelWidth: '120px',
                fileList: [],
                loading:false,
                listData:[],
                prjOwnerList:[],

                pageTotal:1,
                currentPage:1,
                page_size:10
            }
        },
        created: function(){
            this.user_type = localStorage.getItem('user_type');  //管理员或用户
            this.user_account = localStorage.getItem('user_account');  //管理员或用户
            this.getDeviceList({user_account: this.user_account});
            this.getProjectList({user_account: this.user_account});
        },
        methods: {
            getDeviceList: function(params){//获取项目列表
                var self = this;
                self.loading = true;
                self.$axios.post('/api/device/list',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.listData = res.data.extra.slice(0, self.page_size);
                        self.pageTotal = res.data.total;
                    }else{
                        self.listData = [];
                        self.$message.error(res.data.ret_msg)
                    }
                })
            },
            getProjectList: function(params){//获取项目列表
                var self = this;
                self.loading = true;
                self.$axios.post('/api/project/array',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.prjOwnerList = res.data.extra;
                    }else{
                        self.prjOwnerList = [];
                        self.$message.error(res.data.ret_msg)
                    }
                })
            },
            handleCurrentChange:function(val){
                this.currentPage = val;
                this.getDeviceList({page_size:10,current_page:this.currentPage});
            },
            clickDialogBtn: function(){
                var self = this;
                self.form.device_name = '';
                this.dialogFormVisible=true;
            },
            delProject: function(id,fileName,i){//删除
                var self = this;
                var params = {
                    _id: id,
                    device_name:fileName
                };
                self.loading = true;
                self.$axios.post('api/rom/del',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.$message({message:'删除成功',type:'success'});
                        // self.getDeviceList({});
                        self.listData.splice(i,1);
                    }else{
                        self.$message.error(res.data.ret_msg)
                    }

                },function(err){
                    self.$message.error('删除失败');
                    self.loading = false;
                    console.log(err);
                })
            },
            releaseDevice: function(id,fileName){//上架操作
                var self = this;
                var params = {
                    _id: id,
                    device_name:fileName
                };
                self.loading = true;
                self.$axios.post('api/project/release',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.$message({message:'操作成功',type:'success'});
                        self.getDeviceList({user_account: self.user_account});
                    }else{
                        self.$message.error(res.data.ret_msg)
                    }

                },function(err){
                    self.$message.error('操作失败');
                    self.loading = false;
                })
            },
            freezeDevice: function(id,fileName){//下架操作
                var self = this;
                var params = {
                    _id: id,
                    device_name:fileName
                };
                self.loading = true;
                self.$axios.post('api/project/hide',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.$message({message:'操作成功',type:'success'});
                        self.getDeviceList({user_account: self.user_account});
                    }else{
                        self.$message.error(res.data.extra)
                    }

                },function(err){
                    self.$message.error('操作失败');
                    self.loading = false;
                })
            },
            submitUpload: function(formName){
                console.log("submitUpload", formName);
                var self = this;
                self.$refs[formName].validate(function(valid){
                    if(valid){
                        self.$refs.upload.submit();
                    }else{
                        return false;
                        console.log('验证失败');
                    }
                });
            },
            beforeUpload: function(file){
                console.log("beforeUpload", file.name);
                //this.form.file_name = file.name;
                return true;
            },
            handleSuccess: function(response,file,fileList){
                console.log("handleSuccess", file.name);
                var self = this;
                if(response.ret_code == 0){
                    this.$message({message:'创建成功',type:'success'});
                }else{
                    this.$message.error('创建失败');
                }
                self.fileList = [];
                self.form.device_name = '';
                self.form.prject_name = '';
                self.form.comment = '';
                //this.fullscreenLoading  = false;

                self.dialogFormVisible = false;
                self.$refs.upload.clearFiles();
                self.getDeviceList({user_account: self.user_account});
            },
            handleError: function(err,file,fileList){
                console.log("handleError", file.name);
                this.$message('操作失败');
                this.$refs.upload.clearFiles();
            },
            handleChange:function(file, fileList) {
                console.log("handleChange", file.name);

                var reader=new FileReader();
                reader.onload=function(f){ };
                //reader.readAsBinaryString(fileList[0]);
                reader.readAsBinaryString(file.raw);
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
    .orange{color:#eb9e05;background-color:transparent;}
    .btn2{margin-bottom:5px;margin-left:0;}
    .diainp{width:217px;}
    .upload-demo .el-upload:hover {border-color: #409EFF;}
</style>
