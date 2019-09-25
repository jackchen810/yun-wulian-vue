import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/readme',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/',
                    //name: '/',
                    component: resolve => require(['../components/page/Readme.vue'], resolve)
                },
                {
                    path: '/basetable',
                    name: '/basetable',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve)
                },
                {
                    path: '/projectmanage',
                    component: resolve => require(['../components/page/ProjectManage.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/devicemanage',
                    component: resolve => require(['../components/page/DevicetManage.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/devicemodule',
                    name: '/devicemodule',
                    component: resolve => require(['../components/page/DevicetModule.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/accountmanage',
                    component: resolve => require(['../components/page/AccountManage.vue'], resolve)
                },
                {
                    path: '/rommanage',
                    component: resolve => require(['../components/page/RomPkgManage.vue'], resolve)
                },
                {
                    path: '/rommupgrade',
                    component: resolve => require(['../components/page/PushResult.vue'], resolve)
                },
                {
                    path: '/devtypemanage',
                    component: resolve => require(['../components/page/DeviceTypeManage.vue'], resolve)
                },
                {
                    path: '/pushresultdetail',
                    component: resolve => require(['../components/page/PushResultDetail.vue'], resolve)
                },
            ]
        },
        {
            path: '/login',
            name: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/register',
            name: '/register',
            component: resolve => require(['../components/page/Register.vue'], resolve)
        },
        {
            path: '/charts',
            name: '/charts',
            component: resolve => require(['../components/page/BaseCharts.vue'], resolve)
        },
    ]
})
