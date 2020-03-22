<template>
    <div class="table">
        <h2>基本信息:</h2>
        <el-table :data="abstract_list" style="width: 100%" ref="multileTable">
            <el-table-column prop="project_name" label="项目名称" width="180"></el-table-column>
            <el-table-column prop="project_local" label="装备地点" width="100"></el-table-column>
            <el-table-column prop="dev_cn_name" label="设备名称" width="180"></el-table-column>
            <el-table-column prop="gateway_sn" label="设备标识" width="190"></el-table-column>
            <el-table-column prop="device_run_status" label="设备运行状态" width="120"></el-table-column>
            <el-table-column prop="device_link_status" label="设备链路状态" width="120"></el-table-column>
            <el-table-column prop="update_time" label="数据更新时间" width="200"></el-table-column>
        </el-table>
        <el-button class="btn_box" type="primary" icon="el-icon-view" @click="page_forward_module_status">查看模块状态</el-button>
        <el-button class="btn_box" type="primary" icon="el-icon-view" @click="page_forward_alarm_logs">查看日志</el-button>
        <el-button class="btn_box" type="primary" icon="el-icon-view" @click="showDialogExport = true">导出数据</el-button>
        <el-button class="btn_box" type="primary" icon="el-icon-view" @click="page_forward_module_config">查看网关配置</el-button>
        <el-button class="btn_box" type="primary" icon="el-icon-view" @click="page_forward_trigger_config">查看触发器配置</el-button>
        <h2 class="title_box">详细数据:</h2>
        <el-table :data="varListData" border style="width: 100%" ref="multipleTable" v-loading="loading">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="varName" label="描述" width="240"></el-table-column>
            <el-table-column prop="varValue" label="值"></el-table-column>
            <el-table-column label="操作" width="350">
            <template slot-scope="scope">
                <el-button class="btn1" type="primary" size="small" @click="message_box_wirte(scope.$index, abstract_list[0].devunit_id, scope.row.varId, scope.row.varName)">数值修改</el-button>
                <el-button class="btn1" type="primary" size="small" @click="create_trigger(scope.$index, scope.row.varName, scope.row.varValue)">添加触发器</el-button>
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


        <el-dialog title="添加触发器" :visible.sync="showDialogTrigger" class="digcont">
            <el-form :model="triggerForm" :rules="triggerRules" ref="triggerForm">
                <el-form-item label="设备变量：" prop=varName :label-width="formLabelWidth">
                    <el-input v-model="triggerForm.varName" class="diainp" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="比较符：" prop="if_symbol" :label-width="formLabelWidth">
                    <el-select v-model="triggerForm.if_symbol" placeholder="请选择比较符">
                        <el-option
                                v-for="item in triggerForm.symbolList"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="匹配值：" prop="if_number" :label-width="formLabelWidth">
                    <el-input v-model="triggerForm.if_number" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="结果匹配输出：" prop="if_true_comment" :label-width="formLabelWidth">
                    <el-input v-model="triggerForm.if_true_comment" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="结果不匹配输出：" prop="if_false_comment" :label-width="formLabelWidth">
                    <el-input v-model="triggerForm.if_false_comment" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="结果输出到："  :label-width="formLabelWidth">
                    <el-radio-group v-model="triggerForm.logs_type">
                        <el-radio label="告警日志"></el-radio>
                        <el-radio label="运行日志"></el-radio>
                        <el-radio label="操作日志"></el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showDialogTrigger = false">取 消</el-button>
                <el-button type="primary" @click="triggerAdd(triggerForm)">添 加</el-button>
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
                formLabelWidth: '200px',
                loading:false,
                fullscreenLoading: false,
                showDialogExport: false,
                showDialogTrigger: false,


                updateTimer: '',


                triggerForm: {
                    symbolList:['>','<','=','!='],
                    varName:'',
                    varValue:'',
                    if_symbol:'',
                    if_number:'',
                    if_true_comment:'',
                    if_false_comment:'',
                    logs_type:'告警日志',
                },
                triggerRules: {
                    if_symbol:[
                        {required: true, message: '请输入比较符', trigger: 'blur'},
                    ],
                    if_number:[
                        {required: true, message: '请输入比较数值', trigger: 'blur'}
                    ],
                    if_true_comment:[
                        {required: true, message: '请输入比较匹配后输出到日志中的内容', trigger: 'blur'}
                    ],
                },


                abstract_list:[{
                    "project_name":"",
                    "gateway_sn":"",
                    "project_local":"",
                    "devunit_id":"",
                    "devunit_name":"",
                    "dev_cn_name":"",
                    "device_run_status":"运行",
                    "device_link_status":"正常",
                    "update_time":"" }],
                varListData:[],

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
            //this.$route.query 中的参数通过url参数代入，点击侧边栏时带入,Sidebar.vue中定义
            //url的表现形式(url中带有参数)
            this.user_type = localStorage.getItem('user_type');  //管理员或用户
            this.user_account = localStorage.getItem('user_account');  //管理员或用户
            if (typeof(this.$route.query.dev_cn_name) != "undefined") {
                this.abstract_list[0].project_name = this.$route.query.project_name;
                //this.abstract_list[0].project_local = '';
                this.abstract_list[0].dev_cn_name = this.$route.query.dev_cn_name;
                this.abstract_list[0].gateway_sn = this.$route.query.gateway_sn;
                this.abstract_list[0].devunit_name = this.$route.query.devunit_name;
                console.log('[basetable] created时，从url参数中获取信息');
                //console.log('[basetable] this.$route.query', this.$route.query);
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
            /*
            * $route对象表示当前的路由信息，包含了当前 URL 解析得到的信息。包含当前的路径，参数，query对象等。
            * **1.$route.path**
                   字符串，对应当前路由的路径，总是解析为绝对路径，如 "/foo/bar"。
            **2.$route.params**
                   一个 key/value 对象，包含了 动态片段 和 全匹配片段，
                  如果没有路由参数，就是一个空对象。
            **3.$route.query**
                   一个 key/value 对象，表示 URL 查询参数。
                  例如，对于路径 /foo?user=1，则有 $route.query.user == 1，
                  如果没有查询参数，则是个空对象。
            **4.$route.hash**
                   当前路由的 hash 值 (不带 #) ，如果没有 hash 值，则为空字符串。锚点
            **5.$route.fullPath**
                   完成解析后的 URL，包含查询参数和 hash 的完整路径。
            **6.$route.matched**
                   数组，包含当前匹配的路径中所包含的所有片段所对应的配置参数对象。
            **7.$route.name    当前路径名字**
             **8.$route.meta  路由元信息
            * */
            '$route' (to, from) {
                console.log('[basetable] 路由参数变化，刷新数据', this.$route.path);

                if (typeof(this.$route.query.dev_cn_name) != "undefined") {
                    this.abstract_list[0].project_name = this.$route.query.project_name;
                    //this.abstract_list[0].project_local = '';
                    this.abstract_list[0].dev_cn_name = this.$route.query.dev_cn_name;
                    this.abstract_list[0].gateway_sn = this.$route.query.gateway_sn;
                    this.abstract_list[0].devunit_name = this.$route.query.devunit_name;
                    console.log('[basetable] 路由对象中获取数据');
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
                        project_name: self.abstract_list[0].project_name,
                    }
                };
                self.loading = true;
                self.$axios.post('/api/project/manage/list',params).then(function(res){
                    self.loading = false;
                    if (res.data.ret_code == 0 && res.data.extra.length > 0) {
                        self.abstract_list[0].project_local = res.data.extra[0].project_local;
                        //console.log('[basetable] post /api/project/manage/list ');
                        //console.log('[basetable] ', self.abstract_list[0]);
                    }
                })
            },
            getDeviceRealData: function(current_page, page_size){//获取rom列表
                let self = this;
                let params = {
                    filter: {
                        devunit_name: self.abstract_list[0].devunit_name ,
                    }
                };
                self.loading = true;
                self.$axios.post('/api/gateway/real/data', params).then(function(res){
                    self.loading = false;
                    console.log('[basetable] get real data, params:', params);
                    console.log('[basetable] get real data, return:', res.data);
                    if(res.data.ret_code == 0){
                        self.varListData = res.data.extra.data;
                        self.abstract_list[0].update_time = res.data.extra.update_time;
                        self.abstract_list[0].device_run_status = "运行";
                        self.abstract_list[0].devunit_id = res.data.extra.devunit_id;
                        console.log('[basetable] devunit_id ', res.data.extra.devunit_id);
                        //self.pageTotal = res.data.total;
                    }else{
                        self.varListData = [];
                        self.abstract_list[0].device_run_status = "停止";
                        self.$message.error(res.data.ret_msg);
                    }

                    //如果timer存在就直接返回, 这里数据每分钟更新一次
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
                                devunit_name: self.abstract_list[0].devunit_name ,
                            }
                        };
                        self.$axios.post('/api/gateway/real/data', params).then(function(rett) {
                            //console.log('[basetable timer] get real data, params:', params);
                            console.log('[basetable timer] get real data, return:', rett.data);
                            if (rett.data.ret_code == 0) {
                                self.varListData = rett.data.extra.data;
                                self.abstract_list[0].update_time = rett.data.extra.update_time;
                                self.abstract_list[0].device_run_status = "正常";
                                self.abstract_list[0].devunit_id = res.data.extra.devunit_id;
                            } else {
                                self.varListData = [];
                                self.abstract_list[0].device_run_status = "停止";
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
                    devunit_name: self.abstract_list[0].devunit_name ,
                };

                console.log('[basetable] range:', data_range);


                self.loading  = true;
                //self.$axios.post('/api/gateway/real/data', params).then(function(res){
                self.$axios.post('/api/device/manage/export/history', params).then(function(res){
                    self.loading  = false;
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
                        self.$message.error(res.data.ret_msg);
                    }
                },function(err){
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
                    devunit_name: this.abstract_list[0].devunit_name,
                    var_name: var_name,
                    var_id: var_id,
                };

                //this.$message({message: params,type:'warning'});
                this.$router.push({name: '/charts', params :params});
            },
            page_forward_module_status() {
                console.log('[basetable] page_forward_module_status!');
                let params = {
                    devunit_name: this.abstract_list[0].devunit_name,
                };
                console.log('[basetable] push params:', params);
                this.$router.push({name: '/devicemodule', params :params});
            },
            //查看网关配置，跳转到网关配置页面
            page_forward_module_config() {
                console.log('[basetable] page_forward_module_config!');
                let params = {
                    devunit_name: this.abstract_list[0].devunit_name,
                };
                console.log('[basetable] push params:', params);
                this.$router.push({name: '/ShowGatewayConfig', params :params});
            },
            //查看触发器的配置，跳转到触发器配置页面
            page_forward_trigger_config() {
                console.log('[basetable] page_forward_trigger_config!');
                let params = {
                    dev_cn_name: this.abstract_list[0].dev_cn_name,
                    devunit_name: this.abstract_list[0].devunit_name,
                };
                console.log('[basetable] push params:', params);
                this.$router.push({name: '/ShowTriggerConfig', params :params});
            },
            //查看告警日志
            page_forward_alarm_logs() {
                console.log('[basetable] page_forward_alarm_logs!');
                let params = {
                    dev_cn_name: this.abstract_list[0].dev_cn_name,
                    devunit_name: this.abstract_list[0].devunit_name,
                };
                console.log('[basetable] push params:', params);
                this.$router.push({name: '/ShowAlarmLogs', params :params});
            },

            //写入数值
            message_box_wirte_value: function(index, dev_id, var_id, var_name,value){
                let self = this;
                let params = {
                    'gw_sn':this.abstract_list[0].gateway_sn,
                    'devunit_name':this.abstract_list[0].devunit_name,
                    'dev_id':dev_id,
                    'var_id':var_id,
                    'var_name':var_name,
                    'var_value':value
                };
                self.loading = true;
                self.$axios.post('/api/cmd/exec/remote/set',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.varListData[index]['varValue'] = value;
                        console.log('self.varListData:', self.varListData);

                    }else{
                        self.$message.error(res.data.ret_msg);
                    }
                })
            },
            message_box_wirte: function(index, dev_id, var_id, var_name){
                console.log('[basetable] message_box_wirte!', index, dev_id, var_id, var_name);

                this.$prompt('请输入数值', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern:/^[0-9]*$/,
                inputErrorMessage: '数值格式不正确'
                }).then(({ value }) => {
                    this.$message({
                        type: 'success',
                        message: '写入的数值是: ' + value
                    });

                    //写入数值
                    this.message_box_wirte_value(index, dev_id, var_id, var_name, value);

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            },
            create_trigger: function(index, var_name, var_value) {
                this.showDialogTrigger = true;
                this.triggerForm.varName = var_name;
                console.log('[basetable] create_trigger!', index, var_name, var_value);
            },

            triggerAdd: function(triggerForm){
                let self = this;

                if (triggerForm.if_symbol == ''){
                    self.$message.error("请选择比较符");
                    return;
                }

                if (triggerForm.if_number == ''){
                    self.$message.error("请输入比较数");
                    return;
                }

                let params = {
                    dev_cn_name: this.abstract_list[0].dev_cn_name,
                    devunit_name: this.abstract_list[0].devunit_name,
                    var_name: triggerForm.varName,
                    if_number: triggerForm.if_number,
                    if_symbol: triggerForm.if_symbol,
                    if_true_comment: triggerForm.if_true_comment,
                    if_false_comment: triggerForm.if_false_comment,
                    logs_type: triggerForm.logs_type,
                };

                console.log('[basetable] triggerForm:', triggerForm);


                self.loading  = true;
                self.$axios.post('/api/trigger/add', params).then(function(res){
                    self.loading  = false;
                    if(res.data.ret_code == 0){
                        self.showDialogTrigger = false;
                        self.$message({message:res.data.ret_msg, type:'success'})
                    }else{
                        self.$message.error(res.data.ret_msg);
                    }

                },function(err){
                    self.$message.error(err);
                })
                //*/
            },

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
