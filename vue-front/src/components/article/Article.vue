<template>
  <div class="article">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item to="articleList">目录</el-breadcrumb-item>
      <el-breadcrumb-item>文章详情</el-breadcrumb-item>
    </el-breadcrumb>
    <h1 class="article_title">{{article.title}}</h1>
    <div class="article_small_title">
      <span>
        标签：
        <el-tag v-for="tag in article.desb" :key="this" class="article_desb">{{tag}}</el-tag>
      </span>
      <span>时间：{{article.create_time|timeFormat}}</span>
    </div>
    <div class="article_content" v-html="article.content"></div>
  </div>
</template>

<script>
import "@/assets/css/quill-edit.css";
import { getUrlKey, timeFormat } from "@/utils/utils.js";
export default {
  data() {
    return {
      article: "article"
    };
  },
  mounted() {
    const articleId = getUrlKey("articleId", window.location.href);
    this.getArticle(articleId);
  },

  methods: {
    //获取文章
    async getArticle(articleId) {
      const { data: res } = await this.$http.get(`article/list/${articleId}`);
      console.log(res);
      this.article = res.data;
      this.article.desb = this.article.desb.split(" ");
    }
  },
  watch: {
    // 路由发生改变
    $route() {
      const articleId = getUrlKey("articleId", window.location.href);
      console.log("articleId:" + articleId);
      this.getArticle(articleId);
    }
  },

  created() {},
  filters: {
    timeFormat
  }
};
</script>

<style lang="less" scope>
.article {
  .article_title {
    margin-top: 20px;
    text-align: center;
  }
  .article_small_title {
    text-align: center;
    margin-top: 20px;
    color: #666;
    .article_desb {
      margin-right: 20px;
    }
  }
  .article_content {
    line-height: 30px;
  }
}
.article {
  .article_title {
    text-align: center;
  }
  .article_small_title {
    text-align: center;
    margin-top: 20px;
    color: #666;
    .article_desb {
      margin-right: 20px;
    }
  }
  .article_content {
    line-height: 30px;
  }
}
</style>
