<template>
    <div v-loading="loading" style="overflow:auto;">
        <div class="cont-charts" style="padding:30px 0;">
            <div class="chart-choose" style="width:100%;">
                <h3 class="chart-tit-item">历史曲线: {{this.formC.var_name}}</h3>
                <div class="selete-center" style="width:100%;">
                    <el-select v-model="formC.historyDataType" style="width:180px;" @change="choseHistoryTime" placeholder="请选择时间">
                        <el-option key="1" label="最近60分钟数据" value="1"></el-option>
                        <el-option key="2" label="最近60小时数据" value="60"></el-option>
                        <el-option key="3" label="最近60天数据" value="100"> </el-option>
                    </el-select>
                </div>
                <div id="mychart" style="width:1300px;height:500px;"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import echarts from '../../echarts.min.js';
    export default {
        data: function(){
            return {
                //device_name:localStorage.getItem('ms_username'),
                formC:{
                    devunit_name: '',
                    channel_name: '',
                    var_name: '',
                    var_id: '',
                    historyDataType: '1',
                    seriesHistoryData:[],
                    xAxisHistoryData:[],


                    limitLocation:'30',
                    locationData:[],
                },
                loading:false,
                formLabelWidth:'0',

                totalNum:0,
                historyNum:0,
            }
        },
        created: function(){
            this.getRountPush;

            let params = {
                'devunit_name':this.formC.devunit_name,
                'var_name':this.formC.var_name
            };


            console.log('route created!', this.formC.devunit_name);
            this.getChartHistoryData(params);
        },
        mounted: function(){
            let self = this;
        },
        methods:{
            choseHistoryTime: function(){
                let self = this;
                let params = {
                    'devunit_name':self.formC.devunit_name,
                    'var_name':self.formC.var_name
                };
                self.getChartHistoryData(params)
            },
            getChartHistoryData: function (params) {
                let self = this;
                let datUrl = '';

                if (self.formC.historyDataType == '1'){
                    datUrl = 'api/gateway/minute1/list';
                }
                else if (self.formC.historyDataType == '60'){
                    datUrl = 'api/gateway/hour1/list';
                }
                else if (self.formC.historyDataType == '100'){
                    datUrl = 'api/gateway/day1/list';
                }

                //console.log('post url:', datUrl, 'params:', params);
                self.loading = true;
                self.$axios.post(datUrl, params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0) {
                        self.formC.xAxisHistoryData = res.data.extra.timeList;
                        self.formC.seriesHistoryData = res.data.extra.dataList;

                        let mychart = echarts.init(document.getElementById('mychart'));
                        let option = {
                            tooltip: {
                                trigger: 'axis'
                            },
                            xAxis: {
                                type: 'category',
                                data: self.formC.xAxisHistoryData
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: [{
                                name:'数值',
                                data: self.formC.seriesHistoryData,
                                type: 'line'
                            }]
                        };
                        mychart.setOption(option);
                    }
                    else{
                        self.$message({message: '数据获取错误',type:'warning'});
                    }
                })
            },
            formatter: function(row, column) {
                return row.value;
            }

        },
        computed:{
            getRountPush: function() {
                console.log('route para by baseTable!');
                //let task_id = this.$route.params.device_name;
                //this.$message({message: this.$route.params,type:'warning'});

                if (typeof(this.$route.params.devunit_name) === "undefined") {
                    this.formC.devunit_name = localStorage.getItem('devunit_name');
                    this.formC.var_name = localStorage.getItem('var_name');
                    this.formC.var_id = localStorage.getItem('var_id');
                }
                else{
                    this.formC.devunit_name = this.$route.params.devunit_name;
                    this.formC.var_name = this.$route.params.var_name;
                    this.formC.var_id = this.$route.params.var_id;
                    localStorage.setItem('devunit_name', this.formC.devunit_name);
                    localStorage.setItem('var_name', this.formC.var_name);
                    localStorage.setItem('var_id', this.formC.var_id);
                }

                console.log('$route.params:', this.$route.params);

                //因为在main.js中已经全局注册了store，所以这里直接用this.$直接使用。
                //return task_id;
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
    .selete-center{
        padding-left:15px;
        text-align:center;
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
        padding-left:15px;
        padding-bottom:15px;
        border-bottom:1px solid #ececec;
        margin-bottom:15px;
    }

</style>
