<template>
    <div class="header">
        <div class="logo">金大万翔物联网管理平台</div>
        <div class="user-info">
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    <img class="user-logo" src="../../../static/img/img.jpg">
                    {{username}}
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="changepwd">修改密码</el-dropdown-item>
                    <el-dropdown-item command="loginout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>

        <el-dialog title="修改密码" :visible.sync="showDialogPwd" class="digcont">
            <el-form :model="form" ref="form" :rules="rules">
                <!--<el-form-item label="账号" prop="user_account" :label-width="formLabelWidth">-->
                <!--<el-input v-model="form.user_account" class="diainp" auto-complete="off"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="密码" prop="user_password" :label-width="formLabelWidth">
                    <el-input v-model="form.user_password" type="password" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="user_new_password" :label-width="formLabelWidth">
                    <el-input v-model="form.user_new_password" type="password" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="user_validate_password" :label-width="formLabelWidth">
                    <el-input v-model="form.user_validate_password" type="password" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showDialogPwd = false">取 消</el-button>
                <el-button type="primary" @click="saveChange('form')">确 定</el-button>
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
                name: 'chenzejun',

                showDialogPwd: false,
                form:{
                    user_account:localStorage.getItem('user_account'),
                    user_password:'',
                    user_new_password:'',
                    user_validate_password:''
                },
                formLabelWidth: '120px',
                rules: {
                    user_account:[
                        {required: true, message: '请输入账号', trigger: 'blur'}
                    ],
                    user_password:[
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {validator:this.validateSpace,trigger:'blur'},
                        {min:3,max:32,message:'长度在3到32个字符',trigger:'blur'}
                    ],
                    user_new_password:[
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {validator:this.validateSpace,trigger:'blur'},
                        {min:3,max:32,message:'长度在3到32个字符',trigger:'blur'}
                    ],
                    user_validate_password:[
                        {required: true, message: '请输入确认密码', trigger: 'blur'},
                        {validator:this.validateRepwd,trigger:'blur'}
                    ]
                },

            }
        },
        computed:{
            username(){
                let username = localStorage.getItem('user_account');
                return username ? username : this.name;
            }
        },
        methods:{
            getmd5(password){
                var md5Hash = crypto.createHash("md5");
                var md5Value = md5Hash.update(password).digest('hex');
                return md5Value;
            },

            saveChange: function(formName){
                var self = this;
                var params = {
                    //user_account: self.form.user_account,
                    //user_password:self.form.user_password,
                    user_account: localStorage.getItem('user_account'),
                    user_password: self.getmd5(self.form.user_password),
                    user_new_password: self.form.user_new_password
                };
                self.$axios.post('/api/admin/change',params).then(function(res){
                    if(res.data.ret_code == 0){
                        self.showDialogPwd = false;
                        self.$message({message:res.data.ret_msg,type:'success'})
                    }else{
                        self.$message.error(res.data.ret_msg);
                    }
                },function(err){
//                    self.loading = false;
                    self.$message.error(err);
                })
            },
            validateRepwd: function(rule,value,callback){
                if(value !== this.form.user_new_password){
                    callback(new Error('两次输入密码不一致'));
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
            handleCommand(command) {
                var self = this;
                if(command == 'changepwd'){
                    self.showDialogPwd = true;
                }
                if(command == 'loginout'){
                    self.$axios.post('/api/admin/logout').then(function(res){
                        if(res.data.ret_code == 0){
                            self.$message(res.data.ret_msg);
                            localStorage.removeItem('user_type');
                            localStorage.removeItem('user_account');
                            self.$router.push('/login');
                        }else{
                            self.$message.error(res.data.ret_msg);
                        }
                    },function(err){
                        self.$message.error(err);
                    });
                }
            }
        }
    }
</script>
<style scoped>
    .header{
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        color: #fff;
    }
    .header .logo{
        float: left;
        width:250px;
        text-align: center;
        font-size: 22px;
        line-height: 70px;
    }
    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
        line-height: 70px;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        padding-left: 50px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }
    .user-info .user-logo{
        position: absolute;
        left:0;
        top:15px;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }

    .diainp{width:217px;}
</style>
