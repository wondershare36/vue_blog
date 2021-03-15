<template>
  <el-container class="home-container">
   <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <span>博客管理系统</span>
      </div>
      <el-button type="primary" @click="handleLogout">退出</el-button>
    </el-header>

    <!--页面主体区域-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapse ? 64 + 'px' : 200 + 'px'">
        <!--折叠按钮-->
        <div class="toggle-button" @click="handleToggleCollapse">|||</div>
        <!--菜单区域-->
        <el-menu
          :default-active="this.activePath"
          class="el-menu-vertical-demo"
          background-color="#323744"
          text-color="#fff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          active-text-color="#369BFF"
        >
          <!--一级菜单-->
          <el-submenu
            :index="firstItem.id.toString()"
            v-for="firstItem in menuList"
            :key="firstItem.id"
          >
            <template slot="title">
              <i :class="iconsObj[firstItem.id]"></i>
              <span>{{ firstItem.authName }}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item
              :index="secendItem.path.toString()"
              v-for="secendItem in firstItem.children"
              :key="secendItem.id"
              @click="handleSaveNavState(secendItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ secendItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧主体区域-->
      <el-main>
        home
        <!--路由-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      //左侧菜单数据
      menuList: [
        {
          id: 125,
          authName: "文章管理",
          path: "article",
          children: [
            {
              id: 110,
              authName: "文章分类",
              path: "articleClass",
              children: [],
              order: null,
            },
            {
              id: 102,
              authName: "文章列表",
              path: "articleList",
              children: [],
              order: null,
            },
          ],
          order: 1,
        },
      ],
      //默认展开项
      defaultActive: "123",
      //图标数据
      iconsObj: {
        101: "el-icon-s-goods",
        102: "el-icon-s-order",
        103: "el-icon-s-opportunity",
        125: "el-icon-s-custom",
        145: "el-icon-s-data",
      },
      //是否折叠菜单
      isCollapse: false,
      //被激活的链接地址
      activePath: "",
    };
  },
  created() {
    // this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    //点击退出
    handleLogout() {
      window.sessionStorage.clear();
      this.$message.success("退出成功");
      this.$router.push("/login");
    },
    //获取所有菜单
    async getMenuList() {
      const { data: res } = await this.$http.get("/menus");
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
    },
    //点击折叠按钮
    handleToggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    //点击菜单保存链接激活状态
    handleSaveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.$router.push("/" + activePath);
      this.activePath = activePath;
    },
  },
};
</script>


<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373c41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;

  div {
    display: flex;
    align-items: center;

    img {
      width: 50px;
    }

    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #323744;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf2;
}

.toggle-button {
  background-color: #4a5062;
  font-size: 10px;
  line-height: 24px;
  color: white;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
