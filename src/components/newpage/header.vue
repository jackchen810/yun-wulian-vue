<template>
    <div class="header">
        <div class="headerleft"><img src="/static/img/logo2.png"></div>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">首页</el-menu-item>
            <el-menu-item index="2">云平台</el-menu-item>
            <el-menu-item index="3">大数据</el-menu-item>
            <el-menu-item index="4">后台管理</el-menu-item>
        </el-menu>
    </div>
</template>
<script>
export default {
     data() {
      return {
        activeIndex: '1',
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        if(key === 1 ){
            this.$router.push({ path: 'home' })
        }
        if(key == 2 ){
          //  let newUrl = this.$router.resolve({ path: 'http://datav.jdwanxiang.com/webtopo/' })
          //  window.open(newUrl.href, "_blank");
          window.open("http://datav.jdwanxiang.com/webtopo/")
        }
         if(key == 3 ){
             window.open("http://datav.jdwanxiang.com:8020/")
        }
         if(key == 4 ){
           let newUrl = this.$router.resolve({ path: '/login' })
           window.open(newUrl.href, "_blank");
        }
      }
    }
};
</script>
<style scoped>
.el-menu{
    background: none;
}
.el-menu--horizontal>.el-menu-item{ color: #eee;}
.el-menu--horizontal>.el-menu-item.is-active{
    color: rgb(255, 208, 75);
    border-bottom-color: rgb(255, 208, 75);
    background-color: rgb(84, 92, 100);
}
.header{ display: flex;}
.headerleft{height:60px; padding: 10px 20px; box-sizing: border-box; margin-right: 30px;}
.headerleft img{ height:100%;}
</style>