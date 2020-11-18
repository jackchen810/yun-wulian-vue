<template>
  <div>
    <el-container>
      <el-header>
        <Header></Header>
      </el-header>
      <el-main>
        <el-carousel :interval="5000" arrow="always">
          <el-carousel-item v-for="item in objimg" :key="item">
            <img :src="item" />
          </el-carousel-item>
        </el-carousel>
      </el-main>
    </el-container>
    <h3 class="inTitle">平台应用</h3>
    <div class="inBox">
      <img src="/static/img/zutai.jpg" />
      <div class="home-program-zutai1" id="zutai1">
      
      </div>
      <div class="home-program-zutai2" id="zutai2"></div>
      <div class="home-program-zutai3" id="zutai3"></div>
    </div>
  </div>
</template>
<script>
import lottie from "../../assets/js/lottie.min.js";

import Header from "./header";
export default {
  data() {
    return {
      objimg: ["/static/img/1.png", "/static/img/2.jpg", "/static/img/3.jpg"],
    };
  },
  components: {
    Header,
  },
  computed: {},
  mounted() {
    lottie.loadAnimation({
      container: document.getElementById("zutai1"), // 容器
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/static/img/zutai1.json",
    });
    lottie.loadAnimation({
      container: document.getElementById("zutai2"), // 容器
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/static/img/zutai2.json",
    });
    lottie.loadAnimation({
      container: document.getElementById("zutai3"), // 容器
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/static/img/zutai3.json",
    });
  },
};
</script>
<style>
html,
body,
#app,
.wrapper {
  overflow: auto;
}
.el-header {
  padding: 0 !important;
  background-color: rgb(84, 92, 100);
}
.el-carousel__container {
  height: 600px !important;
}
.el-carousel__item img {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  width: 100%;
  height: 100%;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.el-main {
  padding: 0 !important;
}
.inTitle {
  text-align: center;
  padding: 30px 0 20px;
  font-weight: 500;
  font-size: 1.5rem;
  color: #666;
}
.inBox {
  text-align: center;
  position: relative;
  width: 1118px;
  margin: 0 auto;
}
.home-program-zutai1 {
  position: absolute;
  top: 100px;
  left: 150px;
  width: 260px;
  z-index: 99;
  overflow: hidden;
}
.home-program-zutai2 {
  position: absolute;
  top: 100px;
  left: 550px;
  width: 260px;
  z-index: 99;
  overflow: hidden;
}
.home-program-zutai3 {
  position: absolute;
  top: 350px;
  left: 650px;
  width: 260px;
  z-index: 99;
  overflow: hidden;
}
</style>