<template>
    <div v-loading="loading" style="float:right;">
        <div class="thumbnail"  v-for="(subitem, index) in listData" :key="index">
            <img src="https://dsjiaqi.cn/image/upload_06a23bf183e53c076df887d1a94fe336.jpg" class="image">
            <span>模块{{index+1}}</span>
            <div class="bottom">
                <span>运行状态：</span>
                <el-button type="text" v-if="subitem=='1.000'" >运行</el-button>
                <div class="red_box" v-else>停止</div>
            </div>
            <div class="bottom">
                <span>告警信息：</span>
                <div class="green_box" v-if="listAlarm[index]=='0.000'" >无</div>
                <div class="red_box" v-else>故障</div>
            </div>
        </div>
    </div>
</template>

<script>
    //import global_ from 'components/common/Global';
    export default {
        data: function(){
            return {
                user_type:1,  //0:管理员, 1:用户
                user_account:'',

                channel_name:"C1_D1",
                devunit_name:"jinxi_1",
                listData:[],
                listAlarm:[],
                loading:false,

                pageTotal:1,
                currentPage:1,
                page_size:10
            }
        },
        created: function(){
            this.getRountPush;
            this.user_type = localStorage.getItem('user_type');  //管理员或用户
            this.user_account = localStorage.getItem('user_account');  //管理员或用户
            this.getDeviceModuleStatus();
        },
        methods: {
            getDeviceModuleStatus: function(){//获取项目列表
                let self = this;
                let params = {
                    'device_name':self.devunit_name,
                    'channel_name':self.channel_name,
                };
                self.loading = true;
                self.$axios.post('/api/module/run/status',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.listData = res.data.extra.dataList;
                        self.listAlarm = res.data.extra.alarmList;
                    }else{
                        self.listData = [];
                        self.$message.error(res.data.ret_msg);
                    }
                })
            },
        },
        computed:{
            getRountPush: function() {
                console.log('route push into device!');

                if (typeof(this.$route.params.devunit_name) === "undefined") {
                    this.devunit_name = localStorage.getItem('devunit_name');
                    this.channel_name = localStorage.getItem('channel_name');
                    console.log('devunit_name:', this.devunit_name);
                    console.log('channel_name:', this.channel_name);
                }
                else{
                    this.devunit_name = this.$route.params.devunit_name;
                    this.channel_name = this.$route.params.channel_name;
                    localStorage.setItem('devunit_name', this.devunit_name);
                    localStorage.setItem('channel_name', this.channel_name);
                }

                console.log('get $route.params:', this.$route.params);
                //因为在main.js中已经全局注册了store，所以这里直接用this.$直接使用。
                //return task_id;
            }
        }
    }
</script>

<style>

    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .image {
        width: 100px;
        display: block;
    }

    .thumbnail
    {
        float:left;
        width:110px;
        height:280px;
        margin:5px;
    }
    .red_box{margin-top: 13px;font-size: 15px;color:red;font-weight: bold}
    .green_box{margin-top: 13px;font-size: 15px;color:green;font-weight: bold}
</style>
