<template>
    <div v-loading="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i>网关</el-breadcrumb-item>
                <el-breadcrumb-item>执行命令</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='rad-group mb40'>
                <el-radio-group v-model="curRadio" @change="changeTab">
                    <el-radio-button label="custom">执行用户命令</el-radio-button>
                    <el-radio-button label="shell">执行shell命令</el-radio-button>
                </el-radio-group>
                <el-tabs v-model="tabs_tbl">
                    <el-tab-pane label="" name="1">
                        <el-form :model="form1" :inline="true" :rules="rules1" ref="form1" label-width="150px">
                            <el-form-item label="网关MAC地址" prop="route_mac">
                                <el-input v-model="form1.route_mac" class="diainp" ref="route_mac1"></el-input>
                            </el-form-item>
                            <el-select v-model="form1.custom_cmd" placeholder="请选择" @change="changeCmd">
                                <el-option label="远程开启SSH内网穿透" value="gw_start_ssh"></el-option>
                                <el-option label="远程关闭SSH内网穿透（支持广播）" value="gw_stop_ssh"></el-option>
                                <el-option label="查看设备信息" value="gw_query"></el-option>
                            </el-select>
                            <el-form-item>
                                <el-button type="primary" @click="sendCustomCmd('form1')" v-loading.fullscreen.lock="fullscreenLoading">发送</el-button>
                            </el-form-item>
                        </el-form>
                        <el-form :model="form1" ref="form1" label-width="150px">
                            <el-form-item label="执行结果" prop="router_mac">
                                <el-input type="textarea" :autosize="{ minRows: 16, maxRows: 26}" v-model="form1.result"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>

                    <el-tab-pane label="" name="2">
                        <el-form :model="form2" :inline="true" :rules="rules2" ref="form2" label-width="150px">
                            <el-form-item label="网关MAC地址" prop="route_mac">
                                <el-input v-model="form2.route_mac" class="diainp"></el-input>
                            </el-form-item>
                            <el-form-item label="输入shell命令" prop="shell_cmd">
                                <el-input v-model="form2.shell_cmd" class="diainp"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="sendShellCmd('form2')" v-loading.fullscreen.lock="fullscreenLoading">发送</el-button>
                            </el-form-item>
                        </el-form>
                        <el-form :model="form2" ref="form2" label-width="150px">
                            <el-form-item label="执行结果" prop="router_mac">
                                <el-input type="textarea" :autosize="{ minRows: 16, maxRows: 26}" v-model="form2.result"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>

        </div>
    </div>
</template>

<script>
    import global_ from 'components/common/Global';
    export default {
        data: function () {
            return {
                form1: {
                    route_mac: '',
                    custom_cmd: '',
                    result:''
                },
                rules1: {
                    route_mac: [
                        {required: true, message: '请输入指定MAC', trigger: 'blur'},
                        {validator: this.validateMac, trigger: 'blur'}
                    ]
                },
                form2: {
                    route_mac: '',
                    shell_cmd: '',
                    result:''
                },
                rules2: {
                    route_mac: [
                        {required: true, message: '请输入指定MAC', trigger: 'blur'},
                        {validator: this.validateMac, trigger: 'blur'}
                    ],
                },


                rules_result:false,

                curRadio:'custom',
                tabs_tbl: '1',
                fullscreenLoading:false,
                loading:false
            }
        },
        created:function () {

        },
        methods: {
            sendCustomCmd: function(formName){
                var self = this;
                if (!self.rules_result){
                    console.log('命令参数输入错误');
                    self.$message.error('命令参数输入错误');
                    return false;
                }

                var cmdUrl = '';
                switch (self.form1.custom_cmd)
                {
                    case "gw_start_ssh":cmdUrl = '/api/cmd/exec/start/ssh'; break;
                    case "gw_stop_ssh":cmdUrl = '/api/cmd/exec/stop/ssh'; break;
                    default:
                        console.log('验证失败');
                        self.$message.error('命令参数输入错误');
                        return false;
                }

                self.$refs[formName].validate(function(valid){
                    if(!valid){
                            console.log('验证失败');
                            return false;
                    }

                    console.log('验证成功');
                    var mac = self.form1.route_mac;
                    var str = (mac.indexOf(':')>=0?mac.replace(/:/g,''):mac).toUpperCase();

                    self.loading  = true;
                    var params = {
                        route_mac:str,
                        custom_cmd: cmdUrl
                    };
                    // self.$axios.defaults.withCredentials = true;
                    self.$axios.post(cmdUrl,params).then(function(res){
                        self.loading = false;
                        if(res.data.ret_code == 0){
                            var retmsg = JSON.stringify(res.data.extra);
                            self.form1.result = retmsg.replace(/"<br>"/g,"\r\n");//把里面的回车换行符替换掉
                        }else{
                            self.form1.result = JSON.stringify(res.data);
                            self.$message.error(res.data.ret_msg);
                        }

                    },function(err){
                        self.$message.error('操作失败');
                        // self.fullscreenLoading  = false;
                        self.loading  = false;
                    })
                });

            },
            sendShellCmd: function(formName){
                var self = this;
                if (!self.rules_result){
                    console.log('命令参数输入错误');
                    self.$message.error('命令参数输入错误');
                    return false;
                }

                self.$refs[formName].validate(function(valid){
                    if(!valid){
                        console.log('验证失败');
                        return false;
                    }
                    // console.log('验证成功')
                    // self.fullscreenLoading  = true;
                    var mac = self.form2.route_mac;
                    var str = (mac.indexOf(':')>=0?mac.replace(/:/g,''):mac).toUpperCase();
                    self.loading  = true;
                    var params = {
                        route_mac:str,
                        shell_cmd: self.form2.shell_cmd
                    };
                    self.$axios.post('/api/cmd/exec/shell',params).then(function(res){
                        self.loading = false;
                        if(res.data.ret_code == 0){
                            self.form2.result = res.data.extra.replace(/<br>/gm,"\n");//把里面的回车换行符替换掉
                        }else{
                            self.form2.result = JSON.stringify(res.data);
                            self.$message.error(res.data.ret_msg);
                        }

                    },function(err){
                        self.$message.error('操作失败');
                        // self.fullscreenLoading  = false;
                        self.loading  = false;
                    })
                });

            },
            changeCmd: function() {
                var self = this;
                console.log('form1.custom_cmd', self.form1.custom_cmd);
                //console.log('field', self.$refs['form1'].fields);
                //self.$refs['form1'].validateField("route_mac");
                //this.$refs['form1'].$el.querySelector('input').focus();
                this.$refs.route_mac1.focus();
            },

            validateMac: function (rule, value, callback) {
                var self = this;
                if (value.search(/ffffffffff/i) >= 0 && self.form1.custom_cmd != 'gw_stop_ssh'){
                //if (value.search(/ffffffffff/i) >= 0){
                    self.rules_result = false;
                    return callback(new Error('输入有误'));
                }

                var reg_name = /^[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}$/;
                var reg_name2 = /^[A-Fa-f\d]{2}[A-Fa-f\d]{2}[A-Fa-f\d]{2}[A-Fa-f\d]{2}[A-Fa-f\d]{2}[A-Fa-f\d]{2}$/;
                if (!reg_name.test(value) && !reg_name2.test(value)) {
                    self.rules_result = false;
                    return callback(new Error('输入有误'));
                } else {
                    self.rules_result = true;
                    callback();
                }
            },
            changeTab: function(){
                var self = this;
                if(self.curRadio == 'custom'){
                    self.tabs_tbl = '1';
                }
                if(self.curRadio == 'shell'){
                    self.tabs_tbl = '2';
                }
            },
        }
    }
</script>
<style>
    .mb40 {margin-bottom: 40px;}
    .tab-cont {padding: 40px; /*border-top:1px solid #dfe6ec;*/}
    .diainp{width:217px;}
    .inp100{width:100px;}
    .form-box2{width:700px;}
</style>
