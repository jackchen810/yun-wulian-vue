<template>
    <div v-loading="loadingall">
        <div class="crumbs" style="padding-bottom:30px;border-bottom:1px solid #ececec;">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>设备统计</el-breadcrumb-item>
                <!--<el-breadcrumb-item>数量</el-breadcrumb-item>-->
            </el-breadcrumb>
        </div>
        <!--<div class="plugins-tips">-->
            <!--vue-schart：vue.js封装sChart.js的图表组件。-->
            <!--访问地址：<a href="https://github.com/lin-xin/vue-schart" target="_blank">vue-schart</a>-->
        <!--</div>-->
        <div class="cont-charts" style="padding:30px 0;">
            <div class="chart-choose">
                <!--<h3 class="chart-tit">位置统计</h3>-->
                <!--<el-form :model="formC" ref="formC">
                    <el-form-item label="" prop="" :label-width="formLabelWidth">
                        <el-select v-model="formC.limitLocation" style="width:120px;" @change="choseLocationTime" placeholder="请选择时间">
                            <el-option key="" label="最近7天" value="7"></el-option>
                            <el-option key="" label="最近30天" value="30"> </el-option>
                            <el-option key="" label="最近一年" value="365"> </el-option>
                            <el-option key="" label="自定义" value="set"> </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>-->
            </div>
            <div style="width:980px;overflow: hidden;margin:0 auto;">
                <div id="mychart3" style="width:640px;height:500px;float: left;"></div>
                <div id="mychart4" style="width:340px;height:500px;float:left;">
                    <div class="numcont">
                        <div class="numcont-item">
                            <h1>{{totalNum}}</h1>
                            <p>设备总数(台)</p>
                        </div>
                        <div class="numcont-item numcont-item-right">
                            <h1>{{onlineNum}}</h1>
                            <p>在线设备(台)</p>
                        </div>
                    </div>
                    <el-table :data="formC.locationData" style="width: 100%" height="400" :default-sort = "{prop: 'value', order: 'descending'}">
                        <el-table-column prop="name" label="省份" width="80"></el-table-column>
                        <el-table-column prop="value" label="设备总数" sortable :formatter="formatter"></el-table-column>
                        <el-table-column prop="online_value" label="在线设备"></el-table-column>
                    </el-table>
                </div>
            </div>

        </div>
        <div class="conts" style="padding:30px 0;">
            <div class="cont-item">
                <div class="chart-choose">
                    <h3 class="chart-tit-item">在线数量统计</h3>
                    <el-form :model="formC" ref="formC" :inline="true">
                        <el-form-item label="" prop="" :label-width="formLabelWidth">
                            <el-select v-model="formC.limitOnline" style="width:120px;" @change="choseOnlineTime" placeholder="请选择时间">
                                <el-option key="" label="最近7天" value="7"></el-option>
                                <el-option key="" label="最近30天" value="30"> </el-option>
                                <el-option key="" label="最近一年" value="365"> </el-option>
                                <el-option key="" label="自定义" value="set"> </el-option>
                            </el-select>
                        </el-form-item>
                        <div v-if="formC.limitOnline=='set'?true:false" style="display: inline-block;">
                            <el-form-item label="" style="margin-left:50px;">
                                <el-input v-model="formC.onlineinp" class="diainp" type="number" style="width:70px;" placeholder="请输入时间" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="" style="">
                                <el-select  v-model="formC.onlinetime" style="width:120px;" placeholder="请选择时间">
                                    <el-option key="" label="天" value="1"></el-option>
                                    <el-option key="" label="月" value="30"></el-option>
                                    <el-option key="" label="年" value="365"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="success" @click="findOnline">查询</el-button>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
                <div id="mychart1" style="width:100%;height:400px;margin:0 auto;"></div>
            </div>
            <div class="cont-item cont-item-right">
                <div class="chart-choose">
                    <h3 class="chart-tit-item">开票数量统计</h3>
                    <el-form :model="formC" ref="formC" :inline="true">
                        <el-form-item label="" prop="" :label-width="formLabelWidth">
                            <el-select v-model="formC.limitInvoice" style="width:120px;" @change="choseInvoiceTime" placeholder="请选择时间">
                                <el-option key="" label="最近7天" value="7"></el-option>
                                <el-option key="" label="最近30天" value="30"> </el-option>
                                <el-option key="" label="最近一年" value="365"> </el-option>
                                <el-option key="" label="自定义" value="set"> </el-option>
                            </el-select>
                        </el-form-item>
                        <div v-if="formC.limitInvoice=='set'?true:false" style="display: inline-block;">
                            <el-form-item label="" style="margin-left:50px;">
                                <el-input v-model="formC.invoiceinp" class="diainp" type="number" style="width:70px;" placeholder="请输入时间" auto-complete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="" style="">
                                <el-select  v-model="formC.invoicetime" style="width:120px;" placeholder="请选择时间">
                                    <el-option key="" label="天" value="1"></el-option>
                                    <el-option key="" label="月" value="30"></el-option>
                                    <el-option key="" label="年" value="365"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="success" @click="findInvoice">查询</el-button>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
                <div id="mychart2" style="width:100%;height:400px;margin:0 auto;"></div>
            </div>
        </div>
        <div class="cont-charts" style="padding:30px 0;">
            <div class="chart-choose" style="width:48%;">
                <h3 class="chart-tit-item">使用趋势统计</h3>
                <el-form :model="formC" ref="formC":inline="true">
                    <el-form-item label="" prop="" :label-width="formLabelWidth">
                        <el-select v-model="formC.limitInvoice22" style="width:120px;" @change="choseInvoiceTime22" placeholder="请选择时间">
                            <el-option key="" label="最近1天" value="1"></el-option>
                            <el-option key="" label="最近3天" value="3"></el-option>
                            <el-option key="" label="最近一周" value="7"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="粒度" style="margin-left:50px;">
                        <el-select  v-model="formC.invoice22time" style="width:120px;" placeholder="请选择时间" disabled>
                            <el-option key="" label="60分钟" value="60"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div id="mychart22" style="width:980px;height:400px;"></div>
        </div>
    </div>
</template>

<script>
    import Schart from 'vue-schart';
    import echarts from 'echarts';
    import 'echarts/map/js/china.js';
    import 'echarts/theme/macarons.js';
    import global_ from 'components/common/Global';
    export default {
        data: function(){
            return {
                user_name:localStorage.getItem('ms_username'),
                formC:{
                    limitOnline:'7',
                    seriesOnlineData:[],
                    xAxisOnlineData:[],
                    onlineinp:'30',
                    onlinetime:'1',


                    limitInvoice:'7',
                    seriesInvoiceData:[],
                    xAxisInvoiceData:[],
                    invoiceinp:'30',
                    invoicetime:'1',

                    limitInvoice22:'1',
                    seriesInvoiceData22:[],
                    xAxisInvoiceData22:[],
                    invoice22time:'60',

                    limitLocation:'30',
                    locationData:[],
                },
                loading:false,
                formLabelWidth:'0',

                totalNum:0,
                onlineNum:0,
                loadingall:true
            }
        },
        components: {
            Schart
        },
        created: function(){
            var self = this;
            var params = {
                "limit": self.formC.limitOnline=='set'?'1':Number(self.formC.limitOnline),
                'user_name':self.user_name
            };
            var params22 = {
                "limit": self.formC.limitInvoice22=='set'?'1':Number(self.formC.limitInvoice22)*24,
                'user_name':self.user_name
            };
            var params3 = {
                "limit": self.formC.limitLocation=='set'?'1':Number(self.formC.limitLocation),
                'user_name':self.user_name
            };
            self.getChartOnlineData(params);
            self.getChartInvoiceData(params);
            self.getChartInvoiceData22(params22);
            self.getChartLocationData(params3);
        },
        mounted: function(){
            var self = this;
        },
        methods:{
            choseOnlineTime: function(){
                let self = this;
                if(self.formC.limitOnline == 'set'){
                    return false;
                }
                let params = {
                    'user_name':self.user_name,
                    'limit':Number(self.formC.limitOnline)
                };
                self.getChartOnlineData(params);
            },
            findOnline: function(){
                let self = this;
                let limit = Number(self.formC.onlineinp)*Number(self.formC.onlinetime);
                let params = {
                    'user_name':self.user_name,
                    'limit':limit
                };
                self.getChartOnlineData(params);
            },
            findInvoice: function(){
                let self = this;
                let limit = Number(self.formC.invoiceinp)*Number(self.formC.invoicetime);
                let params = {
                    'user_name':self.user_name,
                    'limit':limit
                };
                self.getChartInvoiceData(params);
            },
            choseInvoiceTime: function(){
                var self = this;
                if(self.formC.limitInvoice=='set'){
                    return false;
                }
                var params = {
                    'user_name':self.user_name,
                    'limit':Number(self.formC.limitInvoice)
                };
                self.getChartInvoiceData(params);
            },
            choseInvoiceTime22: function(){
                var self = this;
                var params = {
                    'user_name':localStorage.getItem('ms_username'),
                    'limit':self.formC.limitInvoice22=='set'?'1':Number(self.formC.limitInvoice22)*24
                };
                self.getChartInvoiceData22(params);
            },
            choseLocationTime: function(){
                var self = this;
                var params = {
                    'user_name':localStorage.getItem('ms_username'),
                    'limit':self.formC.limitLocation=='set'?'1':Number(self.formC.limitLocation)
                };
                self.getChartLocationData(params);
            },
            getChartOnlineData: function (params) {
                var self = this;
                self.loading = true;
                self.$axios.post(global_.baseUrl+'/stats/online/count',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == '1001'){//未登录状态
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == '1010'){//权限不足
                        self.emptyMsg = res.data.extra;
                    }
                    if(res.data.ret_code == 0){
                        var data = res.data.extra;
                        self.formC.xAxisOnlineData = [];
                        self.formC.seriesOnlineData = [];
                        for(let i = data.length-1;i>=0;i--){
                            var date = data[i].doc_create_at.split(' ')[0];
                            var numdata = Number(data[i].online_count);
                            self.formC.xAxisOnlineData.push(date);
                            self.formC.seriesOnlineData.push(numdata);
                        }
                        let myChart1 = echarts.init(document.getElementById('mychart1'));
                        var options = {
                            title: {
                                // text: '个数统计'
                            },
                            tooltip: {},
                            color:['#20a0ff'],
                            legend: {
                                // data:['在线','离线','未激活']
                            },
                            xAxis: {
                                // data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
                                data: self.formC.xAxisOnlineData
                            },
                            yAxis: {},
                            series: [{
                                name: '在线个数',
                                type: 'bar',
                                // data: [5, 20, 36, 10, 10, 20]
                                data: self.formC.seriesOnlineData
                            }]
                        };
                        myChart1.setOption(options)
                    }
                })
            },
            getChartInvoiceData: function(params){
                var self = this;
                self.loading = true;
                self.$axios.post(global_.baseUrl+'/stats/invoice/count',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == '1001'){//未登录状态
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == '1010'){//权限不足
                        self.emptyMsg = res.data.extra;
                    }
                    if(res.data.ret_code == 0){
                        var data = res.data.extra;
                        self.formC.xAxisInvoiceData = [];
                        self.formC.seriesInvoiceData = [];
                        for(let i = data.length-1;i>=0;i--){
                            var date = data[i].doc_create_at.split(' ')[0];
                            var numdata = Number(data[i].invoice_count);
                            self.formC.xAxisInvoiceData.push(date);
                            self.formC.seriesInvoiceData.push(numdata);
                        }
                        let myChart2 = echarts.init(document.getElementById('mychart2'));
                        var options = {
                            title: {
                                // text: '个数统计'
                            },
                            tooltip: {},
                            color:['#ff2f2f'],
                            legend: {
                                // data:['在线','离线','未激活']
                            },
                            xAxis: {
                                data: self.formC.xAxisInvoiceData
                            },
                            yAxis: {},
                            series: [{
                                name: '开票数量',
                                type: 'bar',
                                data: self.formC.seriesInvoiceData
                            }]
                        };
                        myChart2.setOption(options)
                    }
                })
            },
            getChartInvoiceData22: function(params){
                var self = this;
                self.loading = true;
                self.$axios.post(global_.baseUrl+'/stats/invoice/trend',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == '1001'){//未登录状态
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == '1010'){//权限不足
                        self.emptyMsg = res.data.extra;
                    }
                    if(res.data.ret_code == 0){
                        var data = res.data.extra;
                        self.formC.xAxisInvoiceData22 = [];
                        self.formC.seriesInvoiceData22 = [];
                        for(let i = data.length-1;i>=0;i--){
                            // var date = data[i].doc_create_at.split(' ')[0];
                            var date = data[i].doc_create_at+':00';
                            var numdata = Number(data[i].invoice_count);
                            self.formC.xAxisInvoiceData22.push(date);
                            self.formC.seriesInvoiceData22.push(numdata);
                        }
                        let myChart22 = echarts.init(document.getElementById('mychart22'));
                        var options = {
                            title: {
                                // text: '个数统计'
                            },
                            tooltip: {},
                            color:['#28c76f'],
                            legend: {
                                // data:['在线','离线','未激活']
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: true,
                                data: self.formC.xAxisInvoiceData22
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: [{
                                name: '实时开票个数',
                                type: 'line',
                                data: self.formC.seriesInvoiceData22,
                                areaStyle: {
                                    normal: {
                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                            offset: 0,
                                            // color: 'rgb(255, 158, 68)'
                                            color: '#28c76f'
                                        }, {
                                            offset: 1,
                                            // color: 'rgb(255, 70, 131)'
                                            color: '#81fbb8'
                                        }])
                                    }
                                },
                            }]
                        };
                        myChart22.setOption(options)
                    }
                })
            },
            getChartLocationData: function(params){
                var self = this;
                self.loading = true;
                self.$axios.post(global_.baseUrl+'/stats/location/list',params).then(function(res){
                    self.loading = false;
                    self.loadingall = false;
                    if(res.data.ret_code == '1001'){//未登录状态
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == '1010'){//权限不足
                        self.emptyMsg = res.data.extra;
                    }
                    if(res.data.ret_code == 0){
                        var data = res.data.extra;
                        var list = new Array();
                        var total = 0,onlineTotal = 0;
                        for(var i in data){
                            list.push(data[i].value);
                            total += Number(data[i].value);
                            onlineTotal += Number(data[i].online_value);
                        }
                        list.sort(function(num1,num2){
                            return num1-num2;
                        });
                        var maxcnt= eval(list[list.length-1]);//获取最大值
                        self.totalNum = total;
                        self.onlineNum = onlineTotal;
                        self.formC.locationData = data;
                        let myChart3 = echarts.init(document.getElementById('mychart3'),'macarons');
                        var option = {
                            title : {
                                // text: '智能中枢位置统计',
                                // subtext: '数据来自国家统计局'
                            },
                            tooltip : {
                                trigger: 'item'
                            },
                            legend: {
                                x:'right',
                                selectedMode:false,
                                data:['北京','上海','广东']
                            },
                            dataRange: {
                                orient: 'horizontal',
                                min: 0,
                                max: maxcnt,
                                text:['高','低'],           // 文本，默认为数值文本
                                splitNumber:0
                            },
                            toolbox: {
                                show : false,
                                orient: 'vertical',
                                x:'right',
                                y:'center',
                                feature : {
                                    mark : {show: true},
                                    dataView : {show: true, readOnly: false}
                                }
                            },
                            series : [
                                {
                                    name: '全国分布',
                                    type: 'map',
                                    mapType: 'china',
                                    mapLocation: {
                                        x: 'left'
                                    },
                                    selectedMode : 'multiple',
                                    itemStyle:{
                                        normal:{
                                            label:{show:false},
                                            borderWidth:'none',
                                        },
                                        emphasis:{
                                            label:{show:false},
                                            textStyle:{
                                                color:'#c71585'
                                            },
                                        }
                                    },
                                    // data:[
                                    //     {name:'西藏', value:605.83},
                                    //     {name:'青海', value:1670.44},
                                    //     {name:'宁夏', value:2102.21},
                                    //     {name:'海南', value:2522.66},
                                    //     {name:'甘肃', value:5020.37},
                                    //     {name:'贵州', value:5701.84},
                                    //     {name:'新疆', value:6610.05},
                                    //     {name:'云南', value:8893.12},
                                    //     {name:'重庆', value:10011.37},
                                    //     {name:'吉林', value:10568.83},
                                    //     {name:'山西', value:11237.55},
                                    //     {name:'天津', value:11307.28},
                                    //     {name:'江西', value:11702.82},
                                    //     {name:'广西', value:11720.87},
                                    //     {name:'陕西', value:12512.3},
                                    //     {name:'黑龙江', value:12582},
                                    //     {name:'内蒙古', value:14359.88},
                                    //     {name:'安徽', value:15300.65},
                                    //     {name:'北京', value:16251.93, selected:true},
                                    //     {name:'福建', value:17560.18},
                                    //     {name:'上海', value:19195.69, selected:true},
                                    //     {name:'湖北', value:19632.26},
                                    //     {name:'湖南', value:19669.56},
                                    //     {name:'四川', value:21026.68},
                                    //     {name:'辽宁', value:22226.7},
                                    //     {name:'河北', value:24515.76},
                                    //     {name:'河南', value:26931.03},
                                    //     {name:'浙江', value:32318.85},
                                    //     {name:'山东', value:45361.85},
                                    //     {name:'江苏', value:49110.27},
                                    //     {name:'广东', value:53210.28, selected:true}
                                    // ]
                                    data:data
                                }
                            ],
                            animation: false
                        };
                        myChart3.setOption(option);
                    }
                })
            },

            formatter: function(row, column) {
                return row.value;
            }

        }
    }
</script>

<style scoped>
    .cont-charts,.conts{
        max-width:1200px;
    }
    .cont-item{
        float:left;
        width:48%;
    }
    .conts{
        overflow: hidden;
    }
    .numcont{
        overflow: hidden;
        margin-bottom:20px;
        color:#666;
    }
    .numcont-item{
        width:48%;
        float:left;
        text-align: center;
    }
    .cont-item-right{
        float:right;
    }
    .numcont-item-right{
        float:right;
        border-left:1px solid #efefef;
    }
    .numcont-item h1{
        color:#20a0ff;
    }
    .schart{
        width: 600px;
        display: inline-block;
    }
    .content-title{
        clear: both;
        font-weight: 400;
        line-height: 50px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
    .chart-tit{
        color:#666;
        padding-bottom:25px;
    }
    .chart-tit-item{
        color:#666;
        padding-bottom:15px;
        border-bottom:1px solid #ececec;
        margin-bottom:15px;
    }

</style>
