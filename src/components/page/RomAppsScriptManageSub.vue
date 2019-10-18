<template>
    <div v-loading="loading">
        <div class='rad-group mb40'>
            <el-tabs v-model="task_type" type="card" @tab-click="handleClick">




                <el-tab-pane label="上传ROM版本" name="1">
                    <div class="form-box tab-cont form-box2">
                        <el-form :model="form1" :rules="rules1" ref="form1">
                            <el-form-item label="上传固件" :label-width="formLabelWidth">
                                <el-upload
                                    class="upload-demo"
                                    ref="upload1"
                                    name="file_name"
                                    :action="uploadUrl1"
                                    :with-credentials=true
                                    :multiple=false
                                    :data="form1"
                                    :beforeUpload="beforeUpload1"
                                    :on-change="handleChange1"
                                    :on-success="handleSuccess1"
                                    :file-list="fileList1"
                                    :auto-upload="false">
                                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="ROM版本号" prop=rom_version :label-width="formLabelWidth">
                                <el-input v-model="form1.rom_version" class="diainp" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="设备型号" prop="dev_type" :label-width="formLabelWidth">
                                <el-select v-model="form1.dev_type" placeholder="请选择对应设备型号">
                                    <el-option
                                        v-for="item in typeListData"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="版本类型" prop="ver_type" :label-width="formLabelWidth">
                                <el-select v-model="form1.ver_type" placeholder="请选择版本类型">
                                    <el-option label="正式版本" value="正式版本"></el-option>
                                    <el-option label="测试版本" value="测试版本"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="MD5串码" prop="md5_value" :label-width="formLabelWidth">
                                <el-input v-model="form1.md5_value" class="diainp" :disabled="true" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="备注说明" prop="comment" :label-width="formLabelWidth">
                                <el-input v-model="form1.comment" class="diainp" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="cancelAdd">取 消</el-button>
                            <el-button type="primary" @click="saveAdd('form1')">添 加</el-button>
                        </div>
                    </div>
                </el-tab-pane>



                <el-tab-pane label="上传插件版本" name="2">
                    <div class="form-box tab-cont form-box2">
                        <el-form :model="form2" :rules="rules2" ref="form2">
                            <el-form-item label="上传ipk文件" :label-width="formLabelWidth">
                                <el-upload
                                    class="upload-demo"
                                    ref="upload2"
                                    name="file_name"
                                    :action="uploadUrl2"
                                    :with-credentials=true
                                    :data="form2"
                                    :before-upload="beforeUpload2"
                                    :on-change="handleChange2"
                                    :on-success="handleSuccess2"
                                    :file-list="fileList2"
                                    :auto-upload="false">
                                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="插件名称" prop="pkg_str_name" :label-width="formLabelWidth">
                                <el-input v-model="form2.pkg_str_name" class="diainp" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="版本号" prop="pkg_version" :label-width="formLabelWidth">
                                <el-input v-model="form2.pkg_version" class="diainp" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="插件说明" prop="pkg_info" :label-width="formLabelWidth">
                                <el-input v-model="form2.pkg_info" class="diainp" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="cancelAdd">取 消</el-button>
                            <el-button type="primary" @click="saveAdd('form2')">添 加</el-button>
                        </div>
                    </div>

                </el-tab-pane>
                <el-tab-pane label="上传脚本文件" name="3">
                    <div class="form-box tab-cont form-box2">
                        <el-form :model="form3" :rules="rules3" ref="form3">
                            <el-form-item label="上传脚本" :label-width="formLabelWidth">
                                <el-upload
                                    class="upload-demo"
                                    ref="upload3"
                                    name="file_name"
                                    :action="uploadUrl3"
                                    :with-credentials=true
                                    :data="form3"
                                    :beforeUpload="beforeUpload3"
                                    :on-change="handleChange3"
                                    :on-success="handleSuccess3"
                                    :file-list="fileList3"
                                    :auto-upload="false">
                                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="脚本名称" :label-width="formLabelWidth">
                                <el-input v-model="form3.script_name" class="diainp" :disabled="true" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="MD5串码" prop="script_md5" :label-width="formLabelWidth">
                                <el-input v-model="form3.script_md5" class="diainp" :disabled="true" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="脚本说明" prop="script_info" :label-width="formLabelWidth">
                                <el-input v-model="form3.script_info" class="diainp" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="cancelAdd">取 消</el-button>
                            <el-button type="primary" @click="saveAdd('form3')">添 加</el-button>
                        </div>
                    </div>
                </el-tab-pane>




            </el-tabs>
        </div>

    </div>
</template>

<script>
    //import global_ from 'components/common/Global';
    var crypto = require('crypto');
    export default {
        data: function () {
            return {
                form1: {
                    file_name:'',
                    rom_version:'',
                    dev_type:'',
                    ver_type: '',
                    md5_value:'',
                    comment:''
                },
                rules1: {
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
                uploadUrl1:'/api/rom/upload',
                fileList1: [],
                listData1:[],

                /////////pkg
                form2: {
                    pkg_name:'',
                    pkg_str_name:'',
                    pkg_version:'',
                    pkg_info:'',
                    pkg_developer:''
                },
                rules2: {
                    pkg_str_name:[
                        {required: true, message: '请选择插件', trigger: 'blur'}
                    ],
                    pkg_version:[
                        {required: true, message: '请输入插件版本', trigger: 'blur'},
                        {validator:this.validateSpace,trigger:'blur'}
                    ],
                    pkg_info:[
                        {required: true, message: '请输入插件相关信息', trigger: 'blur'},
                        {validator:this.validateSpace,trigger:'blur'}
                    ]
                },
                uploadUrl2:'/api/apps/upload',
                fileList2: [],
                listData2:[],


                ///////// script
                form3: {
                    file_name:'',
                    script_name:'',
                    script_developer:'',
                    script_info:'',
                    script_md5:''
                },
                rules3: {
                    script_name:[
                        {required: true, message: '请选择脚本', trigger: 'blur'}
                    ],
                    script_info:[
                        {required: true, message: '请输入脚本相关信息', trigger: 'blur'},
                        {validator:this.validateSpace,trigger:'blur'}
                    ]
                },
                uploadUrl3:'api/script/upload',
                fileList3: [],
                listData3:[],

                ///////// other
                task_type: '1',
                formLabelWidth: '120px',
                loading:false,
                fullscreenLoading: false,

                pageTotal:1,
                currentPage:1,
                page_size:10
            }
        },
        props:{
            typeListData:{
                type:Array,
                required:true
            }
        },
        created:function () {
            this.getRomList1();
        },
        methods: {

            beforeUpload1: function(file){
                console.log('beforeUpload1:'+file);
                this.form1.file_name = file.name;
                // this.form1.md5_value = md5(file.name);
                return true;
            },
            handleChange1:function(file) {
                var self = this;
                this.form1.file_name = file.name;
                //this.form1.rom_version = file.name.split('-')[2] || '';

                var reader=new FileReader();
                reader.onload=function(f){
                    var md5sum = crypto.createHash('md5');
                    //md5sum.update(String.fromCharCode.apply(null, this.result));
                    md5sum.update(this.result, 'binary');
                    //console.log('dd:', this.result);
                    var str = md5sum.digest('hex');
                    self.form1.md5_value = str;
                };
                //reader.readAsBinaryString(fileList[0]);
                reader.readAsBinaryString(file.raw);
                self.form1.md5_value = self.form1.rom_version ==''?' ': self.form1.md5_value;

            },
            handleSuccess1: function(response,file,fileList){
                var self = this;
                if(response.ret_code == 0){
                    this.$message({message:'创建成功',type:'success'});
                }else{
                    this.$message.error(response.ret_msg);
                }
                self.fileList1 = [];
                self.form1.file_name = '';
                self.form1.rom_version = '';
                self.form1.dev_type = '';
                self.form1.ver_type = '';
                self.form1.md5_value = ' ';
                self.form1.comment = '';
                this.fullscreenLoading  = false;
                this.getRomList1({});
            },

            handleError: function(response,file,fileList){
                var self = this;
                this.$message.error('操作失败');
            },
            getRomList1: function(){//获取rom版本
                var self = this;
                self.$axios.post('/api/rom/list').then(function(res){
                    if(res.data.ret_code == '1001'){
                        self.$message({message:res.data.ret_msg,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == 0){
                        self.listData1 = res.data.extra;
                    }
                })
            },



        //////////////////  apps   /////////////////////////
            beforeUpload2: function(file){
                return true;
            },

            handleChange2:function(file, fileList) {
                var self = this;
                self.form2.pkg_name = file.name;
                //解析文件名称
                var strName = self.form2.pkg_name;
                var arrName = strName.split('_');
                if(strName.indexOf('_')>0 && arrName.length >= 3){
                    if(/[0-9]/.test(arrName[1])){//通用插件名称如：base-files_157-r47727_ramips_24kec.ipk
                        self.form2.pkg_str_name = arrName[0];
                        self.form2.pkg_version = arrName[1]
                    }else if(/[0-9]/.test(arrName[2])){
                        self.form2.pkg_str_name = arrName[0] + '_' + arrName[1];
                        self.form2.pkg_version = arrName[2]
                    }else{
                        self.$message({message:'文件名称不符合标准',type:'warning'});
                        self.fileList2 = [];
                        return false;
                    }

                }else{
                    self.$message({message:'文件名称不符合标准',type:'warning'});
                    self.fileList2 = [];
                    return false;
                }
            },
            handleSuccess2: function(response,file,fileList){
                // console.log(response);
                this.fullscreenLoading  = false;
                this.fileList2 = [];
                this.form2.pkg_name = '';
                this.form2.pkg_str_name = '';
                this.form2.pkg_version = '';
                this.form2.pkg_info = '';
                this.form2.pkg_developer = '';
                this.$refs.upload.clearFiles();
                if(response.ret_code == 0){
                    this.$message({message:'创建成功',type:'success'});
                    this.getAppsData2({});
                }else{
                    this.$message.error(response.extra);
                }

            },
            getAppsData2: function(params){
                var self = this;
                self.listData2 = [];
                self.loading = true;
                self.$axios.post('api/apps/list',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == '1001'){
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == 0){
                        var result = [];
                        if(!params.hasOwnProperty('current_page')){
                            self.pageTotal = res.data.extra.length;
                            result = res.data.extra.slice(0,10);
                        }else{
                            result = res.data.extra;
                        }
                        for(var i in result){
                            self.listData2.push({pkg_str_name:result[i]._id.pkg_str_name,pkg_version:result[i]._id.pkg_version});
                        }
                    }else{
                        self.$message.error(res.data.extra)
                    }
                })
            },



            //////////////////  script   /////////////////////////
            beforeUpload3: function(file){
                // this.form3.script_name = file.name;
                // this.form3.file_name = file.name;
                return true;
            },
            handleChange3:function(file, fileList) {
                var self = this;
                this.form3.script_name = file.name;
                var reader=new FileReader();
                reader.onload=function(f){
                    var md5sum = crypto.createHash('md5');
                    //md5sum.update(String.fromCharCode.apply(null, this.result));
                    md5sum.update(this.result, 'binary');
                    //console.log('dd:', this.result);
                    var str = md5sum.digest('hex');
                    self.form3.script_md5 = str;
                };
                //reader.readAsBinaryString(fileList[0]);
                reader.readAsBinaryString(file.raw);
            },
            handleSuccess3: function(response,file,fileList){
                var self = this;
                this.fullscreenLoading  = false;
                self.form3.file_name = '';
                self.form3.script_name = '';
                self.form3.script_developer = '';
                self.form3.script_info = '';
                self.form3.script_md5 = '';
                self.fileList3 = [];
                if(response.ret_code == '1001'){
                    self.$message({message:response.extra,type:'warning'});
                    setTimeout(function(){
                        self.$router.replace('login');
                    },2000)
                }
                if(response.ret_code == 0){
                    this.$message({message:'创建成功',type:'success'});
                    this.getScriptData3({});
                }else{
                    this.$message.error('创建失败');
                }

            },
            getScriptData3: function(params){
                var self = this;
                self.loading = true;
                self.$axios.post('api/script/list',params).then(function(res){
                    if(res.data.ret_code == '1001'){
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    self.loading = false;
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
                })
            },



            //////////////////  other   /////////////////////////


            handleClick:function (tab,event) {
                var self = this;
                self.task_type = tab.name;
                if(tab.name == '1'){
                    self.getRomList1();
                }
                if(tab.name == '2'){
                    self.getAppsData2({});
                }
                if(tab.name == '3'){
                    self.getScriptData3();
                }
            },
            cancelAdd: function(formName){
                var self = this;
                self.$emit('listenUploadEvent','cancle');

            },
            saveAdd: function(formName){
                var self = this;
                console.log('验证开始...');
                if(formName == "form1"){
                    this.$refs.upload1.submit();
                }
                else if(formName == "form2"){
                    this.$refs.upload2.submit();
                }
                else if(formName == "form3"){
                    this.$refs.upload3.submit();
                }
                self.$emit('listenUploadEvent',formName);
            },
            validateSpace: function (rule, value, callback) {
                var self = this;
                if(value.indexOf(' ')>=0){
                    callback(new Error('输入有空格'));
                }else{
                    callback();
                }
            },
            validateTimeNum: function (rule, value, callback) {
                var self = this;
                var reg = /^\d+$/;
                if(!reg.test(value)){
                    callback(new  Error('输入必须是数字'));
                }
                // if(!self.form1.isTime || !self.form2.isTime){
                if((self.task_type == '1' && self.isValidTime0) || (self.task_type == '2' && self.isValidTime1) || (self.task_type == '3' && self.isValidTime2)){
                    if(!reg.test(value) || Number(value)<24){
                        callback(new Error('输入必须是数字,且不小于24'));
                    }else{
                        callback();
                    }
                }else{
                    callback();
                }

            },
            validateMac: function (rule, value, callback) {
                var self = this;
                var reg_name = /^[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}$/;
                var reg_name2 = /^[A-Fa-f\d]{2}[A-Fa-f\d]{2}[A-Fa-f\d]{2}[A-Fa-f\d]{2}[A-Fa-f\d]{2}[A-Fa-f\d]{2}$/;
                var macarr = self.splitStr(value);
                var len = macarr.length;
                for (var i = 0; i < len; i++) {
                    if (!reg_name.test(macarr[i]) && !reg_name2.test(macarr[i])) {
                        callback(new Error('输入有误，以逗号或回车分隔'));
                    } else {
                        callback();
                    }
                }
            },
            //按逗号和回车分隔字符串
            splitStr: function (str) {
                var temp = str.split(/[\n,]/g);
                for (var i = 0; i < temp.length; i++) {
                    if (temp[i] == "") {
                        temp.splice(i, 1);
                        //删除数组索引位置应保持不变
                        i--;
                    }
                }
                return temp;
            },
        }
    }
</script>
<style>
    .mb40 {margin-bottom: 40px;}
    .tab-cont {padding: 40px; /*border-top:1px solid #dfe6ec;*/}
    .diainp{width:217px;}
    .diainp2{width:550px;}
    .inp100{width:100px;}
    /*.textarea-mac{height:160px;}*/
    .form-box2{width:750px;}
    .daorubtn{vertical-align:top;display:inline-block; }
    .upload-demo .el-upload {cursor: pointer;position: relative;overflow: hidden;}
    .upload-demo .el-upload:hover {border-color: #409EFF;}
</style>
