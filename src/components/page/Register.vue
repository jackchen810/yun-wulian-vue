<template>
    <div class="login-wrap">
        <div class="ms-title">用户注册</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
                <el-form-item label="账号" prop="account">
                    <el-input v-model="ruleForm.account" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="ruleForm.email" placeholder="邮箱"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="phone">
                    <el-input v-model="ruleForm.phone" placeholder="电话号码"></el-input>
                </el-form-item>
                <el-form-item label="所在城市" prop="city">
                    <el-select size="small" style="width: 110px"
                               v-model="ruleForm.selectProv"
                               placeholder="请选择省份"
                               v-on:change="getProv($event)">
                        <el-option
                            v-for="item in provs"
                            :key="item.label"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">注 册</el-button>
                </div>
                <div class="login-btn">
                    <el-button type="text" @click="back">返回登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import global_ from 'components/common/Global';
    export default {
        data: function(){
            return {
                ruleForm: {
                    account: '',
                    password: '',
                    email:'',
                    phone:'',
                    city:'',
                    selectProv: '',
                    selectCity: '',
                    user_belong:'',
                },
                provs:global_.provs,
                citys: [],
                rules: {
                    account: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        {min:3,max:32,message:'长度在3到32个字符',trigger:'blur'},
                        {validator:function(rule,value,callback){
                            if(value.indexOf(' ') != -1){
                                callback(new Error('密码不能包含空格'));
                            }else{
                                callback();
                            }
                        }}
                    ],
                    email: [
                        { required: true, message: '请输入用邮箱', trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: '请输入联系方式', trigger: 'blur' }
                    ],
//                    city: [
//                        { required: true, message: '请选择所在城市', trigger: 'change' }
//                    ],
                }
            }
        },
        created:function(){
//            this.getData();
        },
        methods: {
            submitForm:function(formName) {
                const self = this;
                var params = {
                    user_account: self.ruleForm.account,
                    user_password: self.ruleForm.password,
                    user_email: self.ruleForm.email,
                    user_phone:self.ruleForm.phone,
                    user_city:self.ruleForm.selectProv,
                    user_belong:self.ruleForm.user_belong,
                };
                console.log(params);
                self.$axios.post('/api/admin/register',params).then(function(res){
                    console.log(res);
                    if(res.data.ret_code == 0){
                        self.$message('注册成功！');
                        self.$router.push('/login');
                    }else{
                        self.$message(res.data.ret_msg);
                    }

                },function(err){
                    console.log(err);
                });
            },
            getProv: function(prov){
                let tempCity=[];
                this.citys=[];
                this.selectCity='';
                let allCity=global_.allCity;
                for (var val of allCity){
                    if (prov == val.prov){
//                        console.log(val);
                        tempCity.push({label: val.label, value: val.label})
                    }
                }
                this.citys = tempCity;
            },
            getCity: function (city) {
//                console.log(city);
//                console.log(this.selectCity)
            },
            back: function(){
                this.$router.push('/login');
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        /*height:160px;*/
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>
