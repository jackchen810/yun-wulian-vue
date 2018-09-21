<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-star-on"></i>TASK管理</el-breadcrumb-item>
                <el-breadcrumb-item>TASK列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <h4>基本信息:</h4>
        <el-table :data="system_setup_list" border style="width: 100%;margin:20px 0 20px;" ref="multileTable" v-loading="setup_loading">
            <el-table-column prop="market_gateway" label="行情接口" width="180"></el-table-column>
            <el-table-column prop="riskctrl_name" label="风控名称" width="180"></el-table-column>
            <el-table-column prop="order_gateway" label="交易接口" width="180"></el-table-column>
            <el-table-column prop="total_count" label="任务总数">
                <template slot-scope="scope">
                    <el-tag type="success">{{scope.row.total_count}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="running_count" label="运行任务">
                <template slot-scope="scope">
                    <el-tag type="warning">{{scope.row.running_count}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="fail_count" label="失败">
                <template slot-scope="scope">
                    <el-tag type="danger">{{scope.row.fail_count}}</el-tag>
                </template>
            </el-table-column>
        </el-table>
        <!--
        <div class="handle-box rad-group">
            <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="createTask('system_setup_list')">创建任务</el-button>
            <el-button type="primary" icon="plus" class="handle-del mr10" @click="dialogMarketVisible=true">绑定行情接口</el-button>
            <el-button type="primary" icon="plus" class="handle-del mr10" @click="dialogFormVisible=true">创建任务</el-button>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当前绑定的行情接口：</span>
            <span v-text="form.bind_market_gateway"></span>
        </div>
        -->
        <div class='rad-group'>
            <el-radio-group v-model="form.task_type_radio" @change="changeTab">
                <el-radio-button label="trade">自动化交易任务</el-radio-button>
                <el-radio-button label="monitor">机器人盯盘任务</el-radio-button>
            </el-radio-group>
            <el-form :inline="true" class="handle-box2">
                <el-form-item label="">
                    <el-input v-model="search_word" placeholder="请输入任务ID" class="inp240"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search">搜索</el-button>
                    <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="createTask()">创建任务</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="task_list" border style="width: 100%" ref="multipleTable" v-loading="loading">
           <!--
           <el-table-column type="index" label="ID" width="60"></el-table-column>
           <el-table-column prop="stock_name" label="股票名称" width="100"></el-table-column>
           <el-table-column prop="obj_amount" label="操作量" width="80"></el-table-column>
           <el-table-column prop="trade_ktype" label="K线类型" width="100"></el-table-column>
           <el-table-column prop="task_type" label="任务类型" width="100"></el-table-column>
           -->
            <el-table-column prop="task_type_radio" label="任务类型" width="110">
                <template slot-scope="scope">
                    <el-tag type="primary">{{form.task_type_radio == 'trade'?'自动化交易':'机器人盯盘'}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="task_id" label="任务ID" width="220"></el-table-column>
            <el-table-column prop="trade_ktype" label="K线类型"></el-table-column>
            <el-table-column prop="strategy_name" label="交易策略" width="180"></el-table-column>
            <el-table-column prop="trade_symbol" label="交易标的"></el-table-column>
            <el-table-column prop="task_status" label="运行状态"></el-table-column>
            <el-table-column label="操作" width="250">
                <template slot-scope="scope">
                    <el-button class="btn1" type="primary" size="small" @click="delTask(scope.row.task_id)">删除</el-button>
                    <el-button class="btn1" type="danger" size="small" v-if="scope.row.task_status =='running'" @click="stopTask(scope.row.task_id)">停止</el-button>
                    <el-button class="btn1" type="success" size="small" v-else @click="startTask(scope.row.task_id)">启动</el-button>
                    <el-button class="btn1" type="primary" size="small" @click="page_forward_detail(scope.row.task_id)">任务详情</el-button>
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
        <el-dialog title="添加交易任务" :visible.sync="dialogFormVisible" class="digform" >
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="" prop="task_type_radio" :inline="true":label-width="formLabelWidth">
                        <el-radio-group v-model="form.task_type_radio">
                            <el-radio label="trade">自动化交易</el-radio>
                            <el-radio label="monitor">机器人盯盘</el-radio>
                        </el-radio-group>
                </el-form-item>
                <el-form-item label="策略名称" prop="strategy_list" :label-width="formLabelWidth"
                    v-for="(item, index) in form.strategy_list"
                    :label="'策略' + index"
                    :key="item.key"
                    :prop="item.key"
                    >
                    <div class="block">
                        <label>股票代码：</label>
                        <el-input v-model="form.strategy_list[index].stock_symbol" class="inp150" auto-complete="off" placeholder="请输入股票代码" @change="changeStockSymbol(index)"></el-input>
                        <span v-text="form.strategy_list[index].stock_name"></span>
                    </div>
                    <div>
                        <label>K 线周期：</label>
                        <el-input v-model="form.strategy_main" v-if="index==0&&form.strategy_type>1" class="inp180" auto-complete="off" :disabled="true"></el-input>
                        <el-select v-model="form.strategy_list[index].stock_ktype" v-else class="inp180" placeholder="请选择K线周期">
                            <el-option label="1分钟" value="1"></el-option>
                            <el-option label="5分钟" value="5"></el-option>
                            <el-option label="15分钟" value="15"></el-option>
                            <el-option label="30分钟" value="30"></el-option>
                            <el-option label="60分钟" value="60"></el-option>
                            <el-option label="120分钟" value="120"></el-option>
                            <el-option label="日线" value="day"></el-option>
                            <el-option label="周线" value="week"></el-option>
                            <el-option label="月线" value="month"></el-option>
                        </el-select>
                    </div>
                    <div v-if="index==0">
                        <label>交易数量：</label>
                        <el-input v-model="form.strategy_list[index].trade_amount" class="inp180" auto-complete="off" placeholder="请输入交易数量"></el-input>
                    </div>
                    <div>
                        <label>对应策略：</label>
                        <el-select v-model="form.strategy_list[index].strategy_name" class="inp180" placeholder="请选择对应策略">
                            <el-option
                                    v-for="item in strategy_file_list"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                        <el-button v-if="index==0&&form.strategy_type==1" :disabled="true">N</el-button>
                        <el-button v-else-if="index==0&&form.strategy_type>1" @click.prevent="addStrategyItem(index)">+</el-button>
                        <el-button v-else @click.prevent="removeStrategyItem(index)">-</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="" prop="strategy_type" :inline="true":label-width="formLabelWidth">
                    <el-radio-group v-model="form.strategy_type" @change="changeStrategyItem(index)" :inline="true">
                        <el-radio label="1">简单策略</el-radio>
                        <el-radio label="2">多级别分析策略</el-radio>
                        <el-radio label="3">综合分析策略（策略0为主策略）</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="风控名称" prop="riskctrl_name" :label-width="formLabelWidth" v-if="form.task_type_radio=='trade'">
                    <el-input v-model="form.riskctrl_name" class="inp200" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="交易接口" prop="order_gateway" :label-width="formLabelWidth" v-if="form.task_type_radio=='trade'">
                    <el-input v-model="form.order_gateway" class="inp200" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">退 出</el-button>
                <el-button type="primary" @click="saveAdd('form')"v-loading.fullscreen.lock="fullscreenLoading">添 加</el-button>
            </div>
        </el-dialog>
        <el-dialog title="添加交易任务" :visible.sync="dialogFormWarnVisible" class="digformwarn">
            <h3>请先绑定行情接口</h3>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormWarnVisible = false">退 出</el-button>
                <el-button type="primary" @click="page_forward_setup">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    //import global_ from 'components/common/Global';
    export default {
        data: function(){
            return {
                //curRadio:'trade',
                search_word:'',
                dialogFormVisible:false,
                dialogFormWarnVisible:false,
                dialogMarketVisible:false,
                dialogCheckVisible:false,
                user_type:1,  //0:管理员, 1:用户

                updateTimer:'',

                form: {
                    task_id:'',
                    task_type_radio:'trade',
                    last_task_type_radio:'',
                    task_status:'',
                    obj_amount:'',
                    trade_symbol:'00001',
                    trade_ktype:'1',
                    stock_name:'www',
                    strategy_main:'主策略',
                    strategy_type:'1',
                    strategy_list:[{
                        stock_symbol:'',
                        stock_name:'',
                        stock_ktype:'',
                        trade_amount:'',
                        strategy_name:'',
                    }],
                    riskctrl_name: '',
                    order_gateway: '',
                    market_gateway: '',
                },

                rules: {
                    riskctrl_name:[
                        {required: true, message: '请输入风控名称', trigger: 'blur'},
                    ],
                    order_gateway:[
                        {required: true, message: '请输入交易接口', trigger: 'blur'}
                    ],
                },
                log:{
                    message:''
                },

                formLabelWidth: '100px',
                formLabelWidth50: '50px',
                setup_loading:false,
                loading:false,
                fullscreenLoading: false,
                system_setup_list: [],
                task_list:[],
                strategy_file_list:[],
                valid_stock_list:[],

                pageTotal:1,
                currentPage:1,
                page_size:10
            }
        },
        created: function(){
            if ( this.updateTimer ) {
                clearTimeout(this.updateTimer);
                this.updateTimer = '';
            }

            this.user_type = localStorage.getItem('user_type');  //管理员或用户

            //通过选股任务跳转
            if (this.getTaskType == 'monitor') {
                this.form.task_type_radio = 'monitor';
            }
            this.getTaskList(1, this.page_size, {task_type: this.form.task_type_radio});
            this.getStrategyList();
            this.getSystemSetupList();
            console.log('tradeTaskManage create');
        },
        beforeDestroy: function(){
            if ( this.updateTimer ) {
                clearTimeout(this.updateTimer);
                this.updateTimer = '';
            }

            console.log('tradeTaskManage before destory');
        },
        methods: {
            getSystemSetupList: function(){//获取task列表
                var self = this;
                var setupObj = {
                    order_gateway: '',
                    riskctrl_name: '',
                    market_gateway: '',

                    total_count: 0,
                    running_count: 0,
                    fail_count: 0,
                };
                self.$axios.post('/api/system/setup/list').then(function(res){
                    if(res.data.ret_code == 0){
                        setupObj.order_gateway = res.data.extra.order_gateway;
                        setupObj.riskctrl_name = res.data.extra.riskctrl_name;
                        setupObj.market_gateway = res.data.extra.market_gateway;
                    }

                    //////// 2 //////////
                    var filter = {
                        user_account: localStorage.getItem('user_account')
                    };
                    self.$axios.post('/api/task/stats', {filter: filter}).then(function(res){
                        if(res.data.ret_code == 0){
                            setupObj.total_count = res.data.extra.total_count;
                            setupObj.running_count = res.data.extra.running_count;
                            setupObj.fail_count = res.data.extra.fail_count;
                        }
                        self.system_setup_list.push(setupObj);
                        //console.log('system_setup_list.length', self.system_setup_list.length);
                    });

                });
            },
            getTaskList: function(current_page, page_size, filter){//获取task列表
                var self = this;
                var params = {
                    filter: filter,
                    page_size: page_size,
                    current_page: current_page,
                };
                self.loading = true;
                self.$axios.post('/api/task/list', params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.task_list = res.data.extra.slice(0, self.page_size);
                        self.pageTotal = res.data.total;
                    }
                    else{
                        self.task_list = [];
                    }
                })
            },
            getTaskPrice: function(){//获取task列表
                var self = this;
                var stock_list = []
                for (var i = 0; i < self.task_list.length; i++) {
                    if (self.task_list[i].task_status == 'running'){
                        stock_list.push({task_id:self.task_list[i].task_id, trade_symbol:self.task_list[i].trade_symbol})
                    }
                }

                self.loading = false;
                self.$axios.post('/api/stock/price', stock_list).then(function(res){
                    if(res.data.ret_code == 0){
                        //self.task_list = res.data.extra.slice(0,10);
                        for (var i = 0; i < res.data.extra.length; i++) {
                            var item = res.data.extra[i];
                            for (var j = 0; j < self.task_list.length; j++) {
                                if (item['trade_symbol'] == self.task_list[j]['trade_symbol']){
                                    self.task_list[j]['price'] = item['price']
                                    self.task_list[j]['volume'] = item['volume']
                                }
                            }
                        }
                    }
                    else{
                        console.log('resp:', res.data)
                    }
                })
                console.log(this.$route.path )
                if ( this.$route.path == '/task/manage' ) {
                    this.updateTimer = setTimeout(() => {
                        //this.getTaskPrice();
                    }, 5000);
                }

            },
            getStrategyList: function(){//获取rom列表
                var self = this;
                self.loading = true;
                var filter = {
                    file_type: 'trade',
                    user_account: localStorage.getItem('user_account')
                };
                self.$axios.post('/api/strategy/list', {filter: filter}).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.strategy_file_list = res.data.extra;
                    }
                    else{
                        console.log('resp:', res.data)
                    }
                })
            },
            getValidStockList: function(){//获取设备类型
                var self = this;
                self.loading = false;
                self.$axios.post('/api/stock/list').then(function(res){
                    //self.loading = false;
                    if(res.data.ret_code == 0){
                        self.valid_stock_list = res.data.extra;
                    }
                })
            },
            getStockName: function(){//获取设备类型
                var self = this;
                if (self.form.trade_symbol.length < 6){
                    self.form.stock_name = '';
                    return;
                }

                var params = {trade_symbol:self.form.trade_symbol}
                self.loading = false;
                self.$axios.post('/api/stock/name', params).then(function(res){
                    //self.loading = false;
                    if(res.data.ret_code == 0){
                        self.form.stock_name = res.data.extra;
                    }
                    else{
                        console.log('resp:', res.data)
                    }
                })
            },
            saveAdd: function(formName){
                var self = this;

                var params = {
                    //trade_symbol:self.form.trade_symbol,
                    //stock_name:self.form.stock_name,
                    //obj_amount:self.form.obj_amount,
                    user_account: localStorage.getItem('user_account'),
                    task_type:self.form.task_type_radio,
                    strategy_type:self.form.strategy_type,
                    strategy_list:self.form.strategy_list,
                    riskctrl_name:self.form.riskctrl_name,
                    order_gateway:self.form.order_gateway,
                    market_gateway:self.form.market_gateway
                };

                self.loading = true;
                self.$axios.post('/api/task/add', params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.$message('添加成功');

                        //更新列表
                        self.getTaskList(1, self.page_size, {task_type: self.form.task_type_radio});
                    }
                    else{
                        self.$message('添加失败:' + res.data.ret_msg);
                    }

                },function(err){
                    self.$message('添加失败');
                    self.loading = false;
                    console.log(err);
                })

            },
            delTask: function(task_id){//删除
                var self = this;
                var params = {
                    task_id: task_id
                };
                self.loading = true;
                self.$axios.post('/api/task/del', params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.$message('删除成功');
                        self.getTaskList(1, self.page_size, {task_type: self.form.task_type_radio});
                    }
                    else {
                        self.$message(res.data.extra);
                    }

                },function(err){
                    self.$message('删除失败');
                    self.loading = false;
                    console.log(err);
                })
            },
            startTask: function(task_id){//上架操作
                var self = this;
                var params = {
                    task_id: task_id,
                };
                self.loading = true;
                self.$axios.post('/api/task/start',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.$message('操作成功');
                        self.getTaskList(1, self.page_size, {task_type: self.form.task_type_radio});
                    }
                    else {
                        self.$message(res.data.extra);
                    }

                },function(err){
                    self.$message('操作失败');
                    self.loading = false;
                    console.log(err);
                })
            },
            stopTask: function(task_id){//下架操作
                var self = this;
                var params = {
                    task_id: task_id,
                };
                self.loading = true;
                self.$axios.post('/api/task/stop', params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.$message('操作成功');
                        self.getTaskList(1, self.page_size, {task_type: self.form.task_type_radio});
                    }
                    else {
                        self.$message(res.data.extra);
                    }

                },function(err){
                    self.$message('操作失败');
                    self.loading = false;
                    console.log(err);
                })
            },
            createTask: function(){//task detail操作
                var self = this;
                if (self.system_setup_list.length == 0 ) {
                    self.dialogFormWarnVisible = true;
                }
                else if (self.system_setup_list[0].market_gateway == '' ||
                    self.system_setup_list[0].riskctrl_name == '' ||
                    self.system_setup_list[0].order_gateway == '' ){
                    self.dialogFormWarnVisible = true;
                }
                else{
                    self.dialogFormVisible = true;
                    self.form.order_gateway = self.system_setup_list[0].order_gateway;
                    self.form.riskctrl_name = self.system_setup_list[0].riskctrl_name;
                    self.form.market_gateway = self.system_setup_list[0].market_gateway;
                }
            },
            page_forward_setup: function(){
                this.$router.push({name: 'SystemSetup'});
            },
            page_forward_detail: function(task_id){//task detail操作
                this.$router.push({name:'TradeTaskDetail', params :{task_id: task_id}});
            },
            handleCurrentChange:function(val){
                this.currentPage = val;
                this.getTaskList(this.currentPage, this.page_size, {task_type: 'trade'});
            },
            changeTab: function(){
                var self = this;
                self.getTaskList(1, self.page_size, {task_type: self.form.task_type_radio});
            },
            search: function(){
                var self = this;

            },
            changeStockSymbol:function(index) {

                var stock_symbol = this.form.strategy_list[index].stock_symbol;

                //所有行的stock_symbol 一致
                if (this.form.strategy_type == 2) {
                    //var value = this.form.strategy_list[index].stock_symbol;
                    for(var i = 0; i<this.form.strategy_list.length; i++){
                        this.form.strategy_list[i].stock_symbol = stock_symbol;
                    }
                }


                //获取stock_symbol  对应的名称
                if (stock_symbol.length != 6){
                    this.form.strategy_list[index].stock_name = '';
                    return;
                }
                var self = this;
                var params = '';
                if (stock_symbol[0] == '6') {
                    params = '/sina/list=' + 'sh' + stock_symbol;
                }else{
                    params = '/sina/list=' + 'sz' + stock_symbol;
                }
                self.$axios.get(params).then(function(res){
                    var data_substr = res.data.match(/\"(\S*)(?=\")/);
                    if (data_substr == null) {
                        return;
                    }
                    var fields = data_substr[1].split(",");
                    self.form.strategy_list[index].stock_name = fields[0];

                },function(err){
                    self.form.strategy_list[index].stock_name = '';
                    console.log(err);
                })


            },
            changeStrategyItem: function(index) {
                //只保留一行
                var list0 = this.form.strategy_list[0];
                if (this.form.strategy_type == 1) {
                    this.form.strategy_list = [list0];
                }
            },
            removeStrategyItem(index) {
                this.form.strategy_list.splice(index, 1);
            },
            addStrategyItem(index) {
                var stock_symbol = '';
                if (this.form.strategy_type == 2) {
                    var stock_symbol = this.form.strategy_list[0].stock_symbol;
                }

                this.form.strategy_list.push({
                    stock_symbol:stock_symbol,
                    stock_ktype:'',
                    strategy_name:'',
                });

            }
        },
        computed:{
            getTaskType() {
                //因为在main.js中已经全局注册了store，所以这里直接用this.$直接使用。
                return this.$route.params.task_type;
                /*
                //this.$message('操作'+ this.params_task_id);
                if (typeof(task_type) === "undefined") {
                    task_type = localStorage.getItem('trade_task_type');
                }
                else {
                    localStorage.setItem('trade_task_type', task_type);
                }
                return task_type;
                */
            }
        }
    }
</script>

<style src="../../../static/css/datasource.css"></style>
<style>
    .rad-group{margin-bottom:20px;}
    .handle-input{  width: 300px;  display: inline-block;  }
    .handle-box2{display:inline-block;float:right;}
    /*.el-table_1_column_5{color:#eb9e05;}*/
    .orange{color:#eb9e05;background-color:yellow;}
    .btn2{margin-bottom:5px;margin-left:0;}
    .diainp{width:217px;}
    .diainp2{width:400px;}
    .inp80{width:80px;}
    .inp100{width:100px;}
    .inp120{width:120px;}
    .inp150{width:140px;}
    .inp160{width:160px;}
    .inp180{width:180px;}
    .inp200{width:200px;}
    .inp240{width:240px;}
    .nowrap{white-space:nowrap;}
    .upload-demo .el-upload {
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .upload-demo .el-upload:hover {
        border-color: #409EFF;
    }
</style>
