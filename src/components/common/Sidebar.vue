<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
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
                items:[],
                items_admin:[
                    {
                        icon: 'el-icon-menu',
                        index: '1',
                        title: '设备管理',
                        subs: [
                            {
                                index: '/basetable',
                                title: '津西高级氧化设备'
                            },
                        ]
                    },
                ],
                items_user:[
                ],
                items_common: [
                ]
            }
        },
        created: function(){
            this.user_type = localStorage.getItem('user_type');  //管理员或用户

            if (this.user_type == 0){
                this.items = this.items_admin.concat(this.items_common);
            }
            else{
                this.items = this.items_user.concat(this.items_common);
            }

            //安照index 排序
            this.items  = this.items.sort( function sortId(a,b){
                return a.index-b.index;
            });

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
