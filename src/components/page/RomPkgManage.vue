<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-star-on"></i> 版本信息管理</el-breadcrumb-item>
                <!--<el-breadcrumb-item>ROM列表</el-breadcrumb-item>-->
                <el-breadcrumb-item>ROM管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box rad-group" v-if="isShow">
            <el-button type="primary" icon="plus" class="handle-del mr10" @click="clickDialogBtn">创建版本</el-button>
        </div>
        <el-table :data="listData" border style="width: 100%" ref="multipleTable" v-loading="loading">
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
        <div class="pagination">
            <el-pagination
                @current-change ="handleCurrentChange"
                :current-page="currentPage"
                layout="prev, pager, next"
                :total="pageTotal">
            </el-pagination>
        </div>

        <el-dialog title="添加ROM版本" :visible.sync="dialogFormVisible" class="digcont">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="上传" :label-width="formLabelWidth">
                    <el-upload
                        class="upload-demo"
                        ref="upload"
                        name="file_name"
                        :action="uploadUrl"
                        :with-credentials="true"
                        :data="form"
                        :beforeUpload="beforeUpload"
                        :on-change="handleChange"
                        :on-success="handleSuccess"
                        :file-list="fileList3"
                        :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="ROM版本号" prop=rom_version :label-width="formLabelWidth">
                    <el-input v-model="form.rom_version" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="设备型号" prop="dev_type" :label-width="formLabelWidth">
                    <el-select v-model="form.dev_type" placeholder="请选择对应设备型号">
                        <el-option
                            v-for="item in typeListData"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="版本类型" prop="ver_type" :label-width="formLabelWidth">
                    <el-select v-model="form.ver_type" placeholder="请选择版本类型">
                        <el-option label="正式版本" value="正式版本"></el-option>
                        <el-option label="测试版本" value="测试版本"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="MD5串码" prop="md5_value" :label-width="formLabelWidth">
                    <el-input v-model="form.md5_value" class="diainp" :disabled="true" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注说明" prop="comment" :label-width="formLabelWidth">
                    <el-input v-model="form.comment" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd('form')">添 加</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    //import global_ from 'components/common/Global';
    var crypto = require('crypto');
    export default {
        data: function(){
            return {
                uploadUrl:'api/rom/upload',
                isShow:localStorage.getItem('userMsg') =='1'?false:true,
                dialogFormVisible:false,
                radio3:'全部',
                form: {
                    file_name:'',
                    rom_version:'',
                    dev_type:'',
                    ver_type: '',
                    md5_value:'',
                    comment:''
                },
                rules: {
                    rom_version:[
                        {required: true, message: '请输入ROM版本号', trigger: 'blur'}
                    ],
                    dev_type:[
                        {required: true, message: '请输入设备类型', trigger: 'blur'},
                    ],
                    ver_type:[
                        {required: true, message: '请输入版本类型', trigger: 'blur'}
                    ],
                    md5_value:[
                        {required: true, message: 'MD5串码不能为空', trigger: 'blur'}
                    ],
                },
                formLabelWidth: '120px',
                fileList3: [],
                loading:false,
                fullscreenLoading: false,
                listData:[],
                typeListData:[],
                pageTotal:0,
                currentPage:1

            }
        },
        created: function(){
            this.getData({});
            this.getTypes();
        },
        methods: {
            getTypes: function(){//获取设备类型
                var self = this;
                self.$axios.post('api/devtype/types').then(function(res){
                    if(res.data.ret_code == '1001'){
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == 0){
                        self.typeListData = res.data.extra;
                    }else{
                        self.$message.error(res.data.extra)
                    }
                })
            },
            getData: function(params){//获取rom列表
                var self = this;
                self.loading = true;
                self.$axios.post('api/rom/list',params).then(function(res){
//                    console.log(res);
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
                            self.listData = res.data.extra.slice(0,10);
                        }else{
                            self.listData = res.data.extra;
                        }

                    }else{
                        self.$message.error(res.data.extra)
                    }
                })
            },
            handleCurrentChange:function(val){
                this.currentPage = val;
                this.getData({page_size:10,current_page:this.currentPage});
            },
            clickDialogBtn: function(){
                var self = this;
                self.form.rom_version = '';
                self.form.md5_value = '';
                this.dialogFormVisible=true;
            },
            beforeUpload: function(file){
                // console.log(file);
                this.form.file_name = file.name;
                // this.form.md5_value = md5(file.name);
                return true;
            },
            handleSuccess: function(response,file,fileList){
                var self = this;
                if(response.ret_code == 0){
                    this.$message({message:'创建成功',type:'success'});
                }else{
                    this.$message.error(response.extra);
                }
                self.fileList3 = [];
                self.form.file_name = '';
                self.form.rom_version = '';
                self.form.dev_type = '';
                self.form.ver_type = '';
                self.form.md5_value = ' ';
                self.form.comment = '';
                this.fullscreenLoading  = false;

                this.dialogFormVisible = false;
                this.getData({});
            },
            handleError: function(response,file,fileList){
                var self = this;
                this.$message.error('操作失败');
                this.fullscreenLoading  = false;
            },
            saveAdd: function(formName){
                var self = this;
                self.$refs[formName].validate(function(valid){
                    if(valid){
                        self.fullscreenLoading  = true;
                        self.$refs.upload.submit();
                    }else{
                        return false;
                        console.log('验证失败');
                    }
                });
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
                        self.$message.error(res.data.extra);
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
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == 0){
                        self.$message({message:'删除成功',type:'success'});
                        // self.getData({});
                        self.listData.splice(i,1);
                    }else{
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
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == 0){
                        self.$message({message:'操作成功',type:'success'});
                        self.getData();
                    }else{
                        self.$message.error(res.data.extra)
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
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == 0){
                        self.$message({message:'操作成功',type:'success'});
                        self.getData();
                    }else{
                        self.$message.error(res.data.extra)
                    }

                },function(err){
                    self.$message.error('操作失败');
                    self.loading = false;
                })
            },
            handleChange:function(file) {
               var self = this;
                this.form.file_name = file.name;
                this.form.rom_version = file.name.split('-')[2] || '';

                var reader=new FileReader();
                reader.onload=function(f){
                    var md5sum = crypto.createHash('md5');
                    //md5sum.update(String.fromCharCode.apply(null, this.result));
                    md5sum.update(this.result, 'binary');
                    //console.log('dd:', this.result);
                    var str = md5sum.digest('hex');
                    self.form.md5_value = str;
                }
                //reader.readAsBinaryString(fileList[0]);
                reader.readAsBinaryString(file.raw);
                self.form.md5_value = self.form.rom_version ==''?' ': self.form.md5_value;

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
    .handle-input{  width: 300px;  display: inline-block;  }
    .handle-box2{display:inline-block;float:right;}
    .orange{color:#eb9e05;background-color:none;}
    .btn2{margin-bottom:5px;margin-left:0;}
    .diainp{width:217px;}
    .diainp2{width:400px;}
    .upload-demo .el-upload {cursor: pointer;position: relative;overflow: hidden;}
    .upload-demo .el-upload:hover {border-color: #409EFF;}
</style>
