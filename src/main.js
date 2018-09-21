import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
//import 'element-ui/lib/theme-default/index.css';    // 默认主题
import 'element-ui/lib/theme-chalk/index.css'
 //import '../static/css/theme-green/index.css';       // 浅绿色主题
//import "babel-polyfill";
//const VueCookie = require('vue-cookie');

//var echarts = import('echarts');
//Vue.use(echarts);  //自定义vue全局组件use使用

// Tell Vue to use the plugin
//Vue.use(VueCookie);

Vue.use(ElementUI);
axios.defaults.withCredentials=true;


/**
 * @file Axios的Vue插件（添加全局请求/响应拦截器）
 */

// 拦截request,设置全局请求为ajax请求
/*
axios.interceptors.request.use((config) => {
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    return config
})
*/

// 拦截响应response，并做一些错误处理

axios.interceptors.response.use((response) => {
    const data = response.data;
    //console.log('ret_msg', data.ret_msg, data.ret_code);
    switch (data.ret_code){
        case 2000: {
            ///session 超时返回2000
            //跳转到登录页面
            router.replace({
                path: '/login',
                query: {redirect: router.currentRoute.fullPath}
            })
        }
    }
    return response;
});


Vue.prototype.$axios = axios;
//Vue.prototype.$echarts = echarts;
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');

