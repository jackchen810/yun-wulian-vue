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
                user_account:'',
                current_index:'',
                items:[],
                prjOwnerList:[],
            }
        },
        created: function(){
            this.user_type = localStorage.getItem('user_type');  //管理员或用户
            this.user_account = localStorage.getItem('user_account');  //管理员或用户
            console.log("user_type:", this.user_type);
            if(this.user_type == '0'){//普通管理员
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
                ]
            }
            this.loadProjectSidebar({});
        },
        computed:{
            onRoutes(){
                //console.log('onRoutes path:', this.$route.path.replace('/',''));
                return this.$route.path.replace('/','');
            }
        },
        methods:{
            loadProjectSidebar: async function (params){//获取项目列表
                let self = this;
                self.loading = true;
                await self.$axios.post('/api/project/manage/list',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.prjOwnerList = res.data.extra;
                     }
                });

                //加载各个项目
                for(let i = 0; i < self.prjOwnerList.length; i++) {
                    console.log('prjOwnerList:', self.prjOwnerList[i]);
                    let project_name = self.prjOwnerList[i]['project_name'];
                    let project_local = self.prjOwnerList[i]['project_local'];
                    let params = {
                        filter: {'project_name': project_name},
                    };
                    await self.$axios.post('/api/device/manage/list',params).then(function(res){
                        if(res.data.ret_code == 0){
                            let prjitem = {
                                icon: 'el-icon-menu',
                                index: '2'+i,
                                title: project_name,
                                subs:[],
                            };

                            console.log('prjitem:', prjitem);
                            for(let i = 0; i < res.data.total; i++) {
                                let dev_manage = res.data.extra[i];
                                //let project_name = project_name;
                                //let project_local = project_local;
                                let device_name = dev_manage['device_name'];
                                let devunit_name = dev_manage['devunit_name'];
                                //# 不识别
                                let display_name = device_name.replace("#","%23");
                                let subitem = {
                                    index: '/basetable?device_name=' + display_name + '&project_name='+project_name +
                                        '&project_local='+project_local +'&devunit_name=' + devunit_name,
                                    title: device_name,
                                };
                                prjitem.subs.push(subitem);
                            }
                            //
                            self.items.push(prjitem);
                            console.log('prjitem:', prjitem);
                        }
                    })
                }
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
