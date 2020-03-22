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
            console.log("[sidebar] user_type:", this.user_type);
            if(this.user_type == '0'){//普通管理员
                this.items = [
                    {
                        icon: 'el-icon-star-on',
                        index: '0',
                        title: '系统管理',
                        subs: [
                            {
                                index: 'accountmanage',
                                title: '账号管理'
                            },
                            {
                                index: 'projectmanage',
                                title: '项目管理'
                            },
                            {
                                index: 'devtypemanage',
                                title: '设备型号管理',
                            },
                        ]
                    },
                    {
                        icon: 'el-icon-setting',
                        index: '1',
                        title: '系统设备',
                        subs: [
                            {
                                index: 'devicemanage',
                                title: '设备管理',
                            },
                            {
                                index: 'RomAppsScriptManage',
                                title: '网关版本及插件',
                            },
                            {
                                index: 'RomAppsScriptPush',
                                title: '网关及插件升级',
                            },
                            {
                                index: 'GatewayRemoteCommand',
                                title: '网关远程执行命令',
                            },
                        ]
                    },
                ]
            }
            this.loadProjectSidebar();
        },
        computed:{
            onRoutes(){
                //console.log('onRoutes path:', this.$route.path.replace('/',''));
                return this.$route.path.replace('/','');
            }
        },
        methods:{
            loadProjectSidebar: async function (){//获取项目列表
                let self = this;

                //获取用户所属的项目列表
                self.loading = true;
                await self.$axios.post('api/admin/get/own/project', {user_account:self.user_account}).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.prjOwnerList = res.data.extra;
                     }
                });


                //console.log('[sidebar] prjOwnerList:', self.prjOwnerList);

                let params = {
                    filter: {project_name: { $in: self.prjOwnerList}}
                };
                await self.$axios.post('/api/devunit/manage/list',params).then(function(res){
                    if(res.data.ret_code == 0){
                        console.log('[sidebar] devunit/manage/list :', res.data.extra.length);
                        //加载各个项目,  prjOwnerList存放project_name
                        for(let i = 0; res.data.extra.length > 0; i++) {
                            var dev_manage = res.data.extra.shift();
                            console.log('[sidebar] devlist:', dev_manage);
                            var project_name = dev_manage['project_name'];
                            //dev_cn_name
                            var dev_cn_name = dev_manage['dev_cn_name'];
                            var gateway_sn = dev_manage['gateway_sn'];
                            var devunit_name = dev_manage['devunit_name'];
                            //# 不识别
                            var display_name = dev_cn_name.replace("#","%23");

                            var prjItem = {
                                icon: 'el-icon-menu',
                                index: '2'+ i,
                                title: project_name,
                                subs:[{
                                    index: '/basetable?dev_cn_name=' + display_name + '&project_name='+project_name +'&gateway_sn=' + gateway_sn +'&devunit_name=' + devunit_name,
                                    title: dev_cn_name,
                                }],
                            };


                            //console.log('[sidebar] device list:', res.data.extra);
                            //console.log('[sidebar] device list len:', res.data.extra.length);
                            //console.log('[sidebar] try find project_name:', project_name);
                            console.log('[sidebar] find dev_manage:', dev_manage);

                            //获取剩下的菜单信息
                            for(let m = 0; m < res.data.extra.length; m++) {
                                if (res.data.extra[m]['project_name'] != project_name){
                                    //console.log('[sidebar] not found, project_name:', m, res.data.extra[m]['project_name']);
                                    continue;
                                }

                                //console.log('[sidebar] found, project_name:', m, res.data.extra[m]['project_name']);

                                // 弹出一个对象
                                dev_manage = res.data.extra[m];
                                res.data.extra.splice(m, 1);   //删除当前元素
                                m--;   //当前位置再遍历一次

                                //console.log('[sidebar] dev_manage:', dev_manage);

                                //新的device信息
                                dev_cn_name = dev_manage['dev_cn_name'];
                                devunit_name = dev_manage['devunit_name'];
                                gateway_sn = dev_manage['gateway_sn'];
                                //# 不识别
                                display_name = dev_cn_name.replace("#","%23");
                                let subitem = {
                                    index: '/basetable?dev_cn_name=' + display_name + '&project_name='+project_name +'&gateway_sn=' + gateway_sn +'&devunit_name=' + devunit_name,
                                    title: dev_cn_name,
                                };
                                prjItem.subs.push(subitem);

                                console.log('[sidebar] found, index:', m, res.data.extra.length);
                            }

                            //整体加入数组
                            self.items.push(prjItem);
                            //console.log('[sidebar] prjitem:', prjItem);
                        }
                    }
                })
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
