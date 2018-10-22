<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" @select="handleSelect" theme="dark" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index">
                        <template slot="title"><i :class="item.icon"></i>{{ item.title }}</template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">{{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index">
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    //import global_ from 'components/common/Global';
    export default {
        data: function() {
            return {
                user_type:1,  //0:管理员, 1:用户
                current_index:'',
                items:[],
            }
        },
        created: function(){
            this.user_type = localStorage.getItem('user_type');  //管理员或用户
            console.log("user_type:", this.user_type);
            if(this.user_type == '1'){//普通管理员
                this.items = [
                    {
                        icon: 'el-icon-menu',
                        index: '1',
                        title: '津西项目',
                        subs: [
                            {
                                index: '/basetable1?device_name=jinxi_1&channel_name=C1_D1&display_name=1号高级氧化设备',
                                title: '津西高级氧化1#设备'
                            },
                            {
                                index: '/basetable2?device_name=jinxi_2&channel_name=C2_D1&display_name=2号高级氧化设备',
                                title: '津西高级氧化2#设备'
                            },
                            {
                                index: '/basetable3?device_name=jinxi_3&channel_name=C3_D1&display_name=3号高级氧化设备',
                                title: '津西高级氧化3#设备'
                            },
                        ]
                    },
                ]
            }else{
                this.items = [
                    {
                        icon: 'el-icon-star-on',
                        index: 'accountmanage',
                        title: '渠道管理',
                    },
                    {
                        icon: 'el-icon-setting',
                        index: '1',
                        title: '项目管理',
                        subs: [
                            {
                                index: 'projectmanage',
                                title: '项目管理'
                            },
                            {
                                index: 'devicemanage',
                                title: '设备管理',
                            },
                        ]
                    },
                    {
                        icon: 'el-icon-menu',
                        index: '2',
                        title: '津西项目',
                        subs: [
                            {
                                index: '/basetable1?device_name=jinxi_1&channel_name=C1_D1&display_name=1号高级氧化设备',
                                title: '津西高级氧化1#设备'
                            },
                            {
                                index: '/basetable2?device_name=jinxi_2&channel_name=C2_D1&display_name=2号高级氧化设备',
                                title: '津西高级氧化2#设备'
                            },
                            {
                                index: '/basetable3?device_name=jinxi_3&channel_name=C3_D1&display_name=3号高级氧化设备',
                                title: '津西高级氧化3#设备'
                            },
                        ]
                    },
                ]
            }
        },
        computed:{
            onRoutes(){
                //console.log('onRoutes path:', this.$route.path.replace('/',''));
                return this.$route.path.replace('/','');
            }
        },
        methods:{
            getUser: function(){
                var self = this;
            },
            handleSelect: function(key, keyPath) {
                //console.log('1113', key, this.current_index);
                /*
                if (this.current_index != key) {
                    this.current_index = key;
                    this.$router.replace(key);
                    this.$router.go(0);
                }
                */
            },
        },
        mounted: function(){
            //this.data();
        },
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #2E363F;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
