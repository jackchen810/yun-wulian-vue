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
                    path: '/basetable1',
                    name: '/basetable1',
                    component: resolve => require(['../components/page/BaseTable1.vue'], resolve)
                },
                {
                    path: '/basetable2',
                    name: '/basetable2',
                    component: resolve => require(['../components/page/BaseTable2.vue'], resolve)
                },
                {
                    path: '/basetable3',
                    name: '/basetable3',
                    component: resolve => require(['../components/page/BaseTable3.vue'], resolve)
                },
                {
                    path: '/projectmanage',
                    component: resolve => require(['../components/page/ProjectManage.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/devicemanage',
                    component: resolve => require(['../components/page/DevicetManage.vue'], resolve)     // vue-datasource组件
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
