<template>
  <div class="home">

    <el-row class="header">
      <el-col :xs="{span:6,offset:1}" :sm="{ span: 10, offset: 2 }" :lg="{ span: 10, offset: 4 }" class="header_left">
        <el-link icon="el-icon-house" type="primary" @click="navigateToHome">博客首页</el-link>
      </el-col>
      <el-col :xs="16" :sm="10" :lg="{ span: 6 }" :xl="{ span: 5 }" class="header_right">
        <el-link icon="el-icon-edit" type="primary">基础|笔记</el-link>
        <el-link icon="el-icon-suitcase" type="primary">工具|指南</el-link>
        <el-link icon="el-icon-price-tag" type="primary">其他</el-link>
      </el-col>
    </el-row>

    <!--中间-->
    <el-row :gutter="10" class="middle">
      <el-col :xs="0" :sm="{ span: 7, offset: 1 }" :md="{ span: 7, offset: 1 }" :lg="{ span: 4, offset: 3 }" :xl="{ span: 5 }" class="aside">
        <!--头像 -->
        <div class="avatar card">
          <el-avatar :size="100">
            <img src="@/assets/images/avatar/qqphoto.jpg" />
          </el-avatar>
          <div class="avatar_name">不只是软件工程师</div>
          <div class="sjjh">社交账号</div>
          <div class="sjjh_icont_wrap">
            <el-tooltip class="sjjh_tip" placement="bottom">
              <div slot="content">
                <el-image style="width: 100px" :src="require('@/assets/images/avatar/qqQrcode.png')" fit="fill"></el-image>
              </div>
              <i class="iconfont icon-qq"></i>
            </el-tooltip>
            <el-tooltip class="sjjh_tip" placement="bottom">
              <div slot="content">
                <el-image style="width: 100px" :src="require('@/assets/images/avatar/wechatQrcode.png')" fit="fill"></el-image>
              </div>
              <i class="iconfont icon-weixin"></i>
            </el-tooltip>
            <a href="https://github.com/liyaxuanliyaxuan" class="iconfont icon-github"></a>
          </div>
        </div>

        <!--菜单列表-->
        <div class="list card">
          <el-menu  :default-active="defaultActive" class="el-menu-vertical-demo" background-color="#fff" text-color="#999" :collapse="isCollapse" :collapse-transition="false" active-text-color="#369BFF">
            <!--一级菜单-->
            <el-submenu :index="firstItem.id.toString()" v-for="firstItem in menuList" :key="firstItem.id">
              <template slot="title">
                <i :class="iconsObj[firstItem.id]"></i>
                <span>{{ firstItem.class_name }}</span>
              </template>
              <!--二级菜单-->
              <el-menu-item v-for="secendItem in firstItem.articles" :key="secendItem.id" :index="secendItem.id.toString()" @click="handleSaveheaderState(secendItem.id)">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{ secendItem.title }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </div>

        <!--轮播图 -->
        <div class="swiper card">
          <div class="swiper_container">
            <el-carousel indicator-position="none">
              <el-carousel-item v-for="item in swiperArr" :key="item.imgsrc">
                <a target="blank" :href="item.url">
                  <el-image fit="cover" style="height: 100px" :src="item.imgsrc"></el-image>
                </a>
                <div class="swiper_tip">
                  <div class="tip_line">-Using-</div>
                  <div class="tip_txt">{{ item.lable }}</div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>

      </el-col>

      <!--右侧主体区域-->
      <el-col :xs="24" :sm="15" :md="15" :lg="{ span: 13 }">
        <div class="main">
         
          <router-view>
          </router-view>
        </div>
      </el-col>

    </el-row>

    <!--footer-->
    <el-row class="footer">
      <el-col>
        <p>基于技术栈
          <el-link :href="item.url" target="_blank" v-for="item in swiperArr" :key="item.name">{{item.name}}</el-link>
        </p>
        <p>
          <el-link>dasabi999.top</el-link> 桂ICP备2020007041号
        </p>
        <p></p>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { timeFormat } from "@/utils/utils.js";
export default {
  name: "Home",
  data() {
    return {
      activeIndex: "1",
      swiperArr: [
        {
          name: "Vue ",
          imgsrc: require("@/assets/images/banner/vuebanner.jpg"),
          lable: "渐进式JavaScript 框架",
          url: "https://cn.vuejs.org/"
        },
        {
          name: "Egg ",
          imgsrc: require("@/assets/images/banner/eggbanner.jpg"),
          lable: "为企业级框架和应用而生",
          url: "https://eggjs.org/zh-cn/"
        },
        {
          name: "ElementUI ",
          imgsrc: require("@/assets/images/banner/elementuibanner.jpg"),
          lable:
            "一套为开发者、设计师和产品经理准备的基于 Vue 2.0 的桌面端组件库",
          url: "https://element.eleme.cn/#/zh-CN"
        }
      ],
      isShowList: true, //控制展示列表
      menuList: [], //左侧菜单数据
      defaultActive: "1", //默认展开项
      iconsObj: {
        //图标数据
        101: "el-icon-s-goods",
        102: "el-icon-s-order",
        103: "el-icon-s-opportunity",
        125: "el-icon-s-custom",
        145: "el-icon-s-data"
      },
      isCollapse: false, //是否折叠菜单
      curentList: []
    };
  },
  async mounted() {
    this.getMenuList();
  },
  filters: {
    timeFormat
  },
  methods: {
    //获取所有菜单
    async getMenuList() {
      const { data: res } = await this.$http.get("getMenuList");
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
      this.curentList = res.data[0].articles;
      this.isShowList = true;
    },
    //打开菜单
    handleOpenCollapse(e) {
      console.log(e);
      this.isCollapse = !this.isCollapse;
    },
    //点击跳转文章
    handleSaveheaderState(articleId) {
      this.$router.push(`/home/article?articleId=${articleId}`);
    },
    //跳转主页
    navigateToHome() {
      this.$router.push("/home/articleList");
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  overflow: hidden;
  position: relative;
  background-color: #eee;
  box-sizing: border-box;
}

.header {
  height: 50px;
  background-color: #fff;
  display: flex;
  align-items: center;
  .header_left {
  }
  .header_right {
    display: flex;
    justify-content: space-around;
  }
}

.middle {
  margin-top: 20px;
  .aside {
    .card {
      background-color: #fff;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #aaa;
    }
    .avatar {
      .avatar_name {
        padding: 10px 0;
        font-size: 12px;
      }
      .sjjh {
        color: #666;
      }
      .sjjh_icont_wrap {
        margin-top: 10px;
        display: flex;
        justify-content: space-around;
        width: 100px;
      }
      .sjjh_icont_wrap a {
        text-decoration: none;
        color: #aaa;
      }
      .sjjh_icont_wrap .iconfont {
        font-size: 25px;
      }
    }
    .list {
      margin-top: 10px;
      padding: 0;
      .el-menu {
        width: 100%;
        overflow: hidden;
      }
    }
    .swiper {
      padding: 0;
      margin-top: 10px;
      .swiper_container {
        width: 100%;
        .el-carousel {
          height: 300px;
        }
        .swiper_tip {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .tip_line {
          margin-top: 10px;
        }
        .tip_txt {
          padding: 0 20px;
          height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
      }
    }
  }
  .main {
    background-color: #fff;
    padding: 50px;
    
  }
}

.footer {
  margin-top: 20px;
  padding: 20px 0;
  background-color: #fff;
  width: 100%;
  bottom: 0;
  text-align: center;
  color: #666;
  .el-link {
    color: #225997;
    margin-left: 5px;
  }
}
</style>
<style>
* {
  padding: 0;
  margin: 0;
}
a {
  text-decoration: none;
}
ul {
  list-style: none;
}
</style>