<template>
    <div class="table" v-loading="loading2">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 账号管理</el-breadcrumb-item>
                <el-breadcrumb-item>账号列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form :inline="true" class="handle-box">
            <el-form-item>
                <el-button type="primary" icon="plus" :disabled="user_type=='0'?false:true" class="handle-del mr10" @click="showDialogCreateUser=true">新建账号</el-button>
            </el-form-item>
            <el-form-item label="">
                <el-input v-model="search_word" placeholder="请输入渠道名称或账号查找" class="handle-input mr10"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="search" :disabled="user_type=='0'?false:true" @click="search">查询</el-button>
            </el-form-item>
        </el-form>
        <div class='rad-group' v-if="user_type =='0'?true:false">
            <el-radio-group v-model="radio3" @change="changeTab">
                <el-radio-button label="all">全部</el-radio-button>
                <el-radio-button label="0">未冻结</el-radio-button>
                <el-radio-button label="1">已冻结</el-radio-button>
            </el-radio-group>
        </div>
        <el-table :data="userData" border style="width: 100%" ref="multipleTable" :empty-text="emptyMsg" v-loading="loading">
            <el-table-column prop="user_account" label="账 号" width="150"></el-table-column>
            <el-table-column prop="user_region" label="公司名称"></el-table-column>
            <el-table-column prop="user_phone" label="联系电话" width="130"></el-table-column>
            <el-table-column prop="user_status" label="冻结状态" width="120">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.user_status == '1' ? 'warning' : 'success'" close-transition>{{scope.row.user_status=='1'?'已冻结':'未冻结'}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="渠道类型" width="150">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.user_type == '0' ? 'danger' : 'info'" close-transition>{{scope.row.user_type == '0'?'超级管理员':'管理员'}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="user_create_time" label="创建时间" width="150"></el-table-column>
            <el-table-column label="操作" width="450">
                <template slot-scope="scope">
                    <el-button class="btn1" size="small" type="success" @click="modifyPassword(scope.row.user_account, scope.row.user_password)">修改密码</el-button>
                    <!--<el-button class="btn1" size="small" type="warning" @click="resetPassword(scope.row.user_account)">重置密码</el-button>-->
                    <el-button class="btn1" size="small" v-if="scope.row.user_status =='0' && scope.row.user_type =='1'" @click="revoke(scope.row.user_account)" :type="scope.row.user_status == '1' ? 'warning' : 'danger'">冻结账户</el-button>
                    <el-button class="btn1" size="small" v-if="scope.row.user_status =='1' && scope.row.user_type =='1'" @click="restore(scope.row.user_account)" :type="scope.row.user_status == '1' ? 'warning' : 'danger'">解冻账户</el-button>
                    <el-button class="btn1" size="small" v-if="scope.row.user_type =='1'?true:false" type="danger" @click="deleteAccount(scope.row.user_account)">删除账户</el-button>
                    <el-button class="btn1" size="small" v-if="scope.row.user_type =='1'?true:false" type="success" @click="getOwnProject(scope.row.user_account)">添加项目</el-button>
                    <!--<el-button class="btn1" size="small" v-if="scope.row.user_type =='1'?true:false" type="success" @click="toEnter(scope.row.user_account)">点击进入</el-button>-->
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
        <el-dialog title="修改密码" :visible.sync="showDialogPwd" class="digcont">
            <el-form :model="formP" ref="formP" :rules="rulesP">
                <el-form-item label="密码" prop="user_password" :label-width="formLabelWidth">
                    <el-input v-model="formP.user_password" type="password" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="user_new_password" :label-width="formLabelWidth">
                    <el-input v-model="formP.user_new_password" type="password" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="user_validate_password" :label-width="formLabelWidth">
                    <el-input v-model="formP.user_validate_password" type="password" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showDialogPwd = false">取 消</el-button>
                <el-button type="primary" @click="savePwdChange('formP')" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="新建账号" :visible.sync="showDialogCreateUser" class="digcont">
            <el-form :model="formA" :rules="rulesA" ref="formA">
                <el-form-item label="账号" prop="user_account" :label-width="formLabelWidth">
                    <el-input v-model="formA.user_account" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
                    <el-input v-model="formA.user_password" type="password" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="账号归属" prop="name" :label-width="formLabelWidth">
                    <el-input v-model="formA.user_region" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="tel" :label-width="formLabelWidth">
                    <el-input v-model="formA.user_phone" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="地址" :label-width="formLabelWidth">
                    <el-select size="small" style="width: 110px"
                               v-model="formA.user_prov"
                               placeholder="请选择省份"
                               v-on:change="getProv($event)">
                        <el-option
                            v-for="item in provs"
                            :key="item.label"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select size="small" style="width: 104px"
                               v-if="formA.selectProv!=''"
                               v-model="formA.user_city"
                               placeholder="请选择城市"
                               v-on:change="getCity($event)">
                        <el-option
                            v-for="item in citys"
                            :key="item.label"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" :label-width="formLabelWidth">
                    <el-input v-model="formA.user_detail" class="diainp2" auto-complete="off" placeholder="请输入详细地址"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showDialogCreateUser = false">取 消</el-button>
                <el-button type="primary" @click="saveCreate('formA')">创 建</el-button>
            </div>
        </el-dialog>
        <el-dialog title="添加项目" :visible.sync="showDialogAddPrj" class="digcont">
            <el-form :model="formPrj" ref="formPrj" :rules="rulesP">
                <el-form-item label="">
                    <el-checkbox-group v-model="formPrj.select_list">
                        <el-checkbox
                            v-for="item in projectList"
                            :key="item"
                            :name="'type'"
                            :label="item">
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showDialogAddPrj = false">取 消</el-button>
                <el-button type="primary" @click="updateOwnProject(formPrj)" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import global_ from 'components/common/Global';
    //var crypto = require('crypto');
    export default {
        data: function() {
            return {
                user_type:1,  //0:管理员, 1:用户
                user_account:'',
                uploadUrl:global_.baseUrl+'/device/import/excel',
                radio3:'all',
                loading2:false,
                loading:false,
                showDialogCreateUser: false,
                formA: {
                    user_account:'',
                    user_password:'',
                    user_region: '',
                    user_phone:'',
                    user_prov: '',
                    user_city: '',
                    user_detail:'',
                },
                rulesA: {
                    user_account:[
                        {required: true, message: '请输入账号', trigger: 'blur'},
                        {validator:this.validateSpace,trigger:'blur'}
                    ],
                    user_password:[
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {validator:this.validateSpace,trigger:'blur'},
                        {min:3,max:32,message:'长度在3到32个字符',trigger:'blur'},
                        {validator:this.validatePwd,trigger:'blur'}
                    ],
                    user_region:[
                        {required: true, message: '请输入渠道名称', trigger: 'blur'},
                        {validator:this.validateSpace,trigger:'blur'},
                        {validator:this.validateSpace,trigger:'blur'}
                    ],
                    user_phone:[
                        {required: true, message: '请输入联系电话', trigger: 'blur'},
                        {validator:this.validateTel,trigger:'blur'}
                    ]
                },
                formLabelWidth: '120px',
                provs:global_.provs,
                citys: [],
                fileList:[],
                search_word:'',

                userData:[],
                projectList:[],
                emptyMsg:'暂无数据',
                formP:{
                    user_account:localStorage.getItem('ms_username'),
                    user_password:'',
                    user_new_password:'',
                    user_validate_password:''
                },
                rulesP: {
                    user_password:[
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    user_new_password:[
                        {required: true, message: '请输入新密码', trigger: 'blur'}
                    ],
                    user_validate_password:[
                        {required: true, message: '请输入确认密码', trigger: 'blur'},
                        {validator:this.validateRepwd,trigger:'blur'}
                    ]
                },
                formPrj:{
                    user_account:'',
                    project_name:'',
                    select_list:[],
                },
                showDialogPwd: false,
                showDialogAddPrj: false,
                fullscreenLoading: false,
                pageTotal:1,
                currentPage:1,
                page_size:10
            }
        },
        created: function(){
            this.user_type = localStorage.getItem('user_type');  //管理员或用户
            this.user_account = localStorage.getItem('user_account');  //管理员或用户
            if(this.user_type == '1'){//普通管理员
                // window.location.reload();
                console.log('普通管理员');
                this.$router.push('/basecharts')
            }
            this.getUsers({});
            this.getProjectList();
        },
        methods: {
            getUsers: function(params, type){//获取渠道列表
                var self = this;
                self.loading = true;
                self.$axios.post('api/admin/list', params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 2001){//权限不足
                        self.emptyMsg = res.data.extra;
                    }
                    if(res.data.ret_code == 0){
                        self.userData = res.data.extra.slice(0,10);
                        self.pageTotal = res.data.total;
                    }else{
                        self.userData = [];
                    }
                })
            },
            getProjectList: function(){//获取项目列表
                let self = this;
                self.loading = true;
                self.$axios.post('/api/project/manage/array').then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.projectList = res.data.extra;
                    }else{
                        self.projectList = [];
                        self.$message.error(res.data.ret_msg)
                    }
                })
            },
            changeTab: function(){
                var self = this;
                var params = {};
                self.currentPage = 1;
                if(self.radio3 == 'all'){
                    self.currentPage = 1;
                    self.getUsers(params,'all');
                }else{
                    self.getUsers({user_status:self.radio3},'status');
                }
            },
            revoke: function(account){//冻结操作
                var self = this;
                var params = {
                    user_account:account
                };
                self.loading = true;
                self.$axios.post('api/admin/revoke',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 1001){
                        self.$message({message:res.data.ret_msg, type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == 1){
                        self.$message({message:res.data.ret_msg, type:'warning'});
                    }
                    if(res.data.ret_code == 0){
                        self.$message({message:res.data.ret_msg, type:'success'});
                        if(self.radio3 == 'all'){
                            self.getUsers({page_size:10, current_page:self.currentPage}, 'all');
                        }else{
                            self.getUsers({user_status:self.radio3,page_size:10,current_page:self.currentPage},'status');
                        }
                    }

                },function(err){
                    self.$message.error('操作失败');
                    self.loading = false;
                    console.log(err);
                })

            },
            restore: function(account){//解冻操作
                var self = this;
                var params = {
                    user_account:account
                };
                self.loading = true;
                self.$axios.post('api/admin/restore',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 1001){
                        self.$message({message:res.data.ret_msg,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == 0){
                        self.$message({message:res.data.ret_msg,type:'success'});
                        var param = {};
                        if(self.radio3 == 'all'){
                            self.getUsers({page_size:10,current_page:self.currentPage},'all');
                        }else{
                            self.getUsers({user_status:self.radio3,page_size:10,current_page:self.currentPage},'status');
                        }
                    }

                },function(err){
                    self.$message.error('操作失败');
                    self.loading = false;
                    console.log(err);
                })

            },
            toEnter: function(user){
                var self = this;
                self.loading = true;
                var params = {
                    user_account:user
                };
                self.$axios.post('api/admin/switch',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 1001){
                        self.$message({message:res.data.ret_msg,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == 1003){
                        self.emptyMsg = res.data.extra;
                    }
                    if(res.data.ret_code == 0){
                        self.$message({message:res.data.ret_msg,type:'success'});
                        localStorage.setItem('ms_username',user);
                        localStorage.setItem('userMsg','1');
                        window.location.reload();
                        self.$router.push('/basecharts')
                    }else{
                        self.$message.error(res.data.extra);
                    }
                })
            },
            ///获取账号下面归属的项目列表
            getOwnProject: function(account){
                console.log('[AccountManage] get own project list', account);
                var self = this;
                self.showDialogAddPrj = true;
                self.formPrj.user_account = account;
                let params = {
                    user_account:account
                };
                self.loading  = true;
                self.$axios.post('api/admin/get/own/project', params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        console.log('[AccountManage] get result: ' + res.data.extra);
                        self.formPrj.select_list = res.data.extra;
                    }else{
                        self.$message.error(res.data.extra);
                    }
                })
            },
            updateOwnProject: function(formPrj){
                var self = this;
                self.showDialogAddPrj = false;
                console.log('[AccountManage] update own project list, user_account: ' + formPrj.user_account);
                console.log('[AccountManage] update own project list, select_list: ' + formPrj.select_list);
                let params = {
                    user_account:formPrj.user_account,
                    user_projects:formPrj.select_list
                };
                self.loading  = true;
                self.$axios.post('api/admin/update/own/project',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.$message({message:res.data.ret_msg,type:'success'});
                        self.formPrj.select_list = [];
                    }else{
                        self.$message.error(res.data.extra);
                    }
                })
            },
            saveCreate: function(formName){
                let self = this;
                self.$refs[formName].validate(function(valid){
                    if(valid){
                        console.log('验证成功')
                    }else{
                        console.log('验证失败');
                        return false;
                    }
                    let params = {
                        user_account:self.formA.user_account,
                        user_password:self.formA.user_password,
                        user_phone:self.formA.user_phone,
                        user_region:self.formA.user_region,

                        user_prov:self.formA.user_prov,
                        user_city:self.formA.user_city,
                        user_detail:self.formA.user_detail
                    };
                    self.$axios.post( 'api/admin/register',params).then(function(res){
                        if(res.data.ret_code == 1001){
                            self.$message({message:res.data.ret_msg,type:'warning'});
                            setTimeout(function(){
                                self.$router.replace('login');
                            },2000)
                        }
                        if(res.data.ret_code == 0){
                            self.$message('注册成功！');
                            self.formA.user_account = '';
                            self.formA.user_password = '';
                            self.formA.user_phone = '';
                            self.formA.user_region = '';
                            self.formA.user_prov = '';
                            self.formA.user_city = '';
                            self.formA.user_detail = '';
                            self.radio3 = 'all';
                            self.showDialogCreateUser = false;
                            self.getUsers({},'all');
                        }else{
                            self.$message(res.data.ret_msg);
                        }
                    })

                });

            },
            deleteAccount: function(account){
                let self = this;
                this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    self.$axios.post( 'api/admin/delete',{user_account: account}).then(function(res){
                        if(res.data.ret_code == 0){
                            for (let i=0; i<self.userData.length; i++){
                                if (self.userData[i].user_account == account){
                                    self.userData.splice(i,1);
                                    break;
                                }
                            }
                            self.$message({message:res.data.ret_msg,type:'success'});
                        }
                    });
                }).catch(() => {
                    self.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            search: function(){
                var self = this;
                if(self.search_word == ''){
                    self.$message({message:'输入不能为空',type:'warning'});
                    return false;
                }
                self.loading = true;
                var params = {
                    user:self.search_word
                };
                self.$axios.post('api/admin/query',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 1001){
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == 1003){
                        self.emptyMsg = res.data.extra;
                    }
                    if(res.data.ret_code == 0){
                        // if(JSON.stringify(params) == '{}'){
                            self.pageTotal = res.data.data.length;
                            self.userData = res.data.data.slice(0,10);
                            if(res.data.data.length<1){
                                self.radio3 = '';
                            }
                        // }else{
                        //     self.userData = res.data.data;
                        // }
                    }
                })

            },
            modifyPassword: function(account, password){
                var self = this;
                self.showDialogPwd = true;
                self.formP.user_account = account;
                //如果是管理员，更新到对话框的原密码位置，避免对原密码的验证
                if (self.user_type == 0){
                    self.formP.user_password = password;
                }
            },
            savePwdChange: function(formP){
                var self = this;
                self.$refs[formP].validate(function(valid){
                    if(valid){
                        var params = {
                            user_account: self.formP.user_account,
                            user_password: self.formP.user_password,
                            user_new_password: self.formP.user_new_password
                        };
                        console.log('savePwdChange:', params);
                        self.fullscreenLoading  = true;
                        self.$axios.post('api/admin/change',params).then(function(res){
                            self.fullscreenLoading  = false;
                            if(res.data.ret_code == 1001){
                                self.$message({message:res.data.ret_msg, type:'warning'});
                                setTimeout(function(){
                                    self.$router.replace('login');
                                },2000)
                            }
                            if(res.data.ret_code == 0){
                                self.showDialogPwd = false;
                                ///当前页面更新用户列表中默认存放的密码
                                for (let i=0; i<self.userData.length; i++){
                                    if (self.userData[i].user_account == self.formP.user_account){
                                        self.userData[i].user_password = self.formP.user_new_password;
                                        break;
                                    }
                                }
                                self.formP.user_password = '';
                                self.formP.user_new_password = '';
                                self.formP.user_validate_password = '';
                                self.$message({message:res.data.ret_msg, type:'success'})
                            }else{
                                self.$message.error(res.data.ret_msg);
                            }
                        },function(err){
                            self.fullscreenLoading  = false;
                            self.$message.error(err);
                        })
                    }else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            validateRepwd: function(rule,value,callback){
                if(value !== this.formP.user_new_password){
                    callback(new Error('两次输入密码不一致'));
                }else{
                    callback();
                }
            },
            validateUser: function(rule,value,callback){
                if(value === ''){
                    callback(new Error('请输入账号'))
                }else{
                    callback();
                }
            },
            validatePwd: function(rule,value,callback){
                if(value === ''){
                    callback(new Error('请输入密码'))
                }else{
                    callback();
                }
            },
            validateTel:function(rule,value,callback){
                var regTel3 = /(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(value);
                if(!regTel3){
                    callback(new Error('电话号码输入有误！'))
                }else{
                    callback();
                }
            },
            validateSpace: function (rule, value, callback) {
                var self = this;
                if(value.indexOf(' ')>=0){
                    callback(new Error('输入有空格'));
                }else{
                    callback();
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
            handleClick:function(tab,event){

            },
            getProv: function(prov){
                let tempCity=[];
                this.citys=[];
                this.selectCity='';
                let allCity=global_.allCity;
                for (var val of allCity){
                    if (prov == val.prov){
                        console.log(val);
                        tempCity.push({label: val.label, value: val.label})
                    }
                }
                this.citys = tempCity;
            },
            getCity: function (city) {
                console.log(city);
                console.log(this.selectCity)
            },
            handleCurrentChange:function(val){
                this.currentPage = val;
                var url = this.radio3=='all'?'all':'status';
                var params = {};
                if(this.radio3 == 'all'){
                    params = {page_size:10,current_page:this.currentPage};
                }else{
                    params = {page_size:10,current_page:this.currentPage,user_status:this.radio3};
                }
                this.getUsers(params,url);
            },
            filterTag:function(value, row) {
                return row.user_status == value;
            },
            fileAdd: function(formName){
                var self = this;
                self.$refs.upload.submit();
            },
            beforeUpload: function(file){
                var testmsg=file.name.substring(file.name.lastIndexOf('.')+1);
                const extension = testmsg === 'xls';
                const extension2 = testmsg === 'xlsx';
                const extension3 = testmsg === 'doc';
                const extension4 = testmsg === 'docx';
                const isLt2M = file.size / 1024 / 1024 < 10;
                if (!extension && !extension2 && !extension3 && !extension4) {
                    this.$message({message:'上传模板只能是 xls格式!',type:'warning'});
                    return false;
                }
                if (!isLt2M) {
                    this.$message({message:'上传模板大小不能超过 10MB!',type:'warning'});
                    return false;
                }
                // else{
                //     return extension || extension2 || extension3 || extension4 && isLt2M;
                // }
            },
            handleSuccess: function(response,file,fileList){
                if(response.ret_code == 1017){
                    var arr = response.extra;
                    var str = '';
                    if(arr.length > 3){
                        var newarr = arr.slice(0,3);
                        str = newarr.join(' / ')+'...';
                    }else{
                        str = arr.join(' / ');
                    }
                    this.$message({message:'"'+ str +' "已存在',type:'warning'})
                }
                if(response.ret_code == 0){
                    var self = this;
                    self.$message({message:'导入成功',type:'success'});
                    if(self.radio3 == 'all'){
                        self.getUsers({page_size:10,current_page:self.currentPage},'all');
                    }else{
                        self.getUsers({user_status:self.radio3,page_size:10,current_page:self.currentPage},'status');
                    }

                }else{
                    this.$message.error(response.extra);
                }
            },
            handleError: function(response,file,fileList){
                this.$message.error('操作失败');
            },
            handleChange:function(file) {
                var self = this;
            },
        }
    }
</script>

<style scoped>
    .handle-box{  margin-bottom: 20px;  }
    .handle-select{  width: 120px;  }
    .handle-input{  width: 300px;  display: inline-block;  }
    .rad-group{margin-bottom:20px;}
    .btn1{margin-bottom:5px;margin-top:5px;/*margin-left:0;*/}
    /*.digcont{width:600px;}*/
    .diainp{width:217px;}
    .diainp2{width:400px;}
    .upload-demo{}
    .mb30{margin-bottom:30px;}
    .mt30{margin-top:30px;}
</style>
