<template>
  <div class="article_list">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">目录</a></el-breadcrumb-item>
    </el-breadcrumb>
    <div class="list">
      <div class="list_item" @click="handleSaveheaderState(item.id)" v-for="item in curentList" :key="item.id">
        <h3 class="list_title">{{item.title}}</h3>
        <div class="list_bottom">
          <el-tag class="classify"><i class="el-icon-folder"></i>{{item.desb}}</el-tag>
          <el-tag class="date" type="info"><i class="el-icon-date"></i>{{item.create_time|timeFormat}}</el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { timeFormat, getUrlKey } from "@/utils/utils.js";
export default {
  data() {
    return {
      curentList: []
    };
  },
  async mounted() {
    this.getMenuList();
  },
  methods: {
    //获取所有菜单
    async getMenuList() {
      const listId = getUrlKey("listId", window.location.href);
      console.log(listId);
      const { data: res } = await this.$http.get("getMenuList");
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      let menuList = (this.menuList = res.data);
      if (listId == undefined) {
        var all = [];
        for (let i = 0; i < menuList.length; i++) {
          if (!menuList[i].articles) continue;
          for (let j = 0; j < menuList[i].articles.length; j++) {
            all.push(menuList[i].articles[j]);
          }
        }
        return (this.curentList = all.reverse());
      } else {
        this.curentList = res.data[listId].articles;
      }
    },
    //点击跳转文章
    handleSaveheaderState(articleId) {
      this.isShowList = false;
      this.$router.push(`/home/article?articleId=${articleId}`);
    }
  },
  filters: {
    timeFormat
  }
};
</script>

<style lang="less" scope>
.article_list {
  .el-breadcrumb {
  }
  .list {
    margin-top: 20px;
    .list_item {
      cursor: pointer;
      border-top: 1px solid #eee;
      padding: 20px 0;
      .list_title {
      }
      .list_bottom {
        i {
          margin-right: 3px;
        }
        margin-top: 20px;
        .classify {
          margin-right: 20px;
        }
      }
    }
  }
}
</style>
