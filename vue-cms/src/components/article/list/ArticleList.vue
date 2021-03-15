<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>文章列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <!--搜索与添加-->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input @clear="getArticleList" clearable v-model="queryInfo.query" placeholder="请输入内容">
            <el-button @click="getArticleList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="showAddArticleADialog" type="primary">添加文章</el-button>
        </el-col>
      </el-row>

      <!--文章表格-->
      <el-table :data="articleList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="文章名称" prop="title"></el-table-column>
        <el-table-column label="文章分类">
          <template slot-scope="scope">
            <el-tag>{{scope.row.class_id}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="摘要" prop="desb"></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">{{scope.row.create_time|timeFormat}}</template>
        </el-table-column>
        <!--操作按钮-->
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <!--修改-->
            <el-button
              type="primary"
              @click="showEditDialog(scope.row.id)"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <!--删除-->
            <el-button
              type="danger"
              @click="removeArticleClassById(scope.row.id)"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页按钮-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!--修改文章对话框-->
    <el-dialog @close="editDialogClosed" title="修改文章" :visible.sync="editDialogVisible" width="95%">
      <!--表单主体-->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="文章摘要" prop="desb">
          <el-input v-model="editForm.desb"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="class_id">
          <el-select v-model="editForm.class_id" clearable placeholder="请选择">
            <el-option
              v-for="item in classList"
              :key="item.id"
              :label="item.class_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <quill-editor
            v-model="editForm.content"
            ref="myQuillEditor"
            :options="editorOption"
            @change="onEditorChange"
          >
            <!-- @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)"-->
          </quill-editor>
        </el-form-item>
      </el-form>
      <!--底部按钮-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editArticle">确 定</el-button>
      </span>
    </el-dialog>

    <!--添加文章对话框-->
    <el-dialog @close="addDialogClosed" title="添加文章" :visible.sync="addDialogVisible" width="95%">
      <!--表单主体-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="文章摘要" prop="desb">
          <el-input v-model="addForm.desb"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="class_id">
          <el-select v-model="addForm.class_id" clearable placeholder="请选择">
            <el-option
              v-for="item in classList"
              :key="item.id"
              :label="item.class_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <quill-editor
            v-model="addForm.content"
            ref="myQuillEditor"
            :options="editorOption"
            @change="onEditorChange"
          >
            <!-- @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)"-->
          </quill-editor>
        </el-form-item>
      </el-form>
      <!--底部按钮-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addArticle">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
export default {
  name: "Users",
  components: {
    quillEditor,
  },
  data() {
    //自定义邮箱校验规则
    var checkEmail = (rule, value, callback) => {
      //验证邮箱正则表达式
      const regEmail = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
      if (!regEmail.test(value)) return callback(new Error("请输入合法邮箱"));
      return callback();
    };
    //自定义手机校验规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /0?(13|14|15|17|18|19)[0-9]{9}/;
      if (!regMobile.test(value))
        return callback(new Error("请输入合法手机号"));
      return callback();
    };
    return {
      //分类列表
      classList: [],
      // 编辑器
      editorOption: {
        // some quill options
      },
      //获取文章列表的参数对象
      queryInfo: {
        query: "",
        //当前页数
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 10,
      },
      //文章列表
      articleList: [],
      //文章列表总条数
      total: 0,
      //添加文章对话框的显示隐藏
      addDialogVisible: false,
      //修改文章对话框的显示隐藏
      editDialogVisible: false,
      //添加文章的表单数据
      addForm: {
        title: "",
        dscb: "",
        class_id: "",
        content: "<h1>example</h1>",
      },
      //编辑文章表单
      editForm: {
        title: "",
        desb: "",
        class_id: "",
        content: "",
      },
      //添加文章的表单数据的校验规则
      addFormRules: {
        title: [
          { required: true, message: "请输入文章名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "文章名称的长度在2到10之间",
            trigger: "blur",
          },
        ],
        class_id: [
          { required: true, message: "请选择文章分类", trigger: "blur" },
        ],
        content: [
          { required: true, message: "请输入文章内容", trigger: "blur" },
        ],
      },
      //编辑文章表单数据的校验规则
      editFormRules: {
        title: [
          { required: true, message: "请输入文章名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "文章名称的长度在2到10之间",
            trigger: "blur",
          },
        ],
        class_id: [
          { required: true, message: "请选择文章分类", trigger: "blur" },
        ],
        content: [
          { required: true, message: "请输入文章内容", trigger: "blur" },
        ],
      },
      //控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      //需要被分配权限的文章信息
      userInfo: {},
      //所有角色列表
      rolesList: [],
      //选择角色的id
      selectedRoleId: "",
    };
  },
  created() {
    this.getArticleList();
    this.getClassList();
  },
  methods: {
    //获取文章列表
    async getArticleList() {
      const { data: res } = await this.$http.get("article/list", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.articleList = res.data;
      this.total = res.data.total;
    },
    //监听 pagesize改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getArticleList();
    },
    //监听页码值改变事件
    handleCurrentChange(newPage) {
      console.log(newPage);
    },

    //监听添加文章对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //点击按钮，添加新文章
    addArticle() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.warning("请按规范填写表单");
        const { data: res } = await this.$http.post(
          `article/list/${this.addForm.class_id}`,
          this.addForm
        );
        console.log(res);
        if (res.meta.status !== 201) return this.$message.error("添加文章失败");
        this.$message.success("文章添加成功");
        this.addDialogVisible = false;
        this.getArticleList();
      });
    },
    //监听编辑文章按钮
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("article/list/" + id);
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("查询文章失败");
      this.editForm = res.data;

      this.editDialogVisible = true;
    },
    //编辑文章弹窗关闭
    editDialogClosed() {
      this.editDialogVisible = false;
    },
    //提交编辑文章
    editArticle() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return this.$message.warning("请按规范填写表单");
        const { data: res } = await this.$http.put(
          `article/list/${this.editForm.id}/${this.editForm.class_id}`,
          this.editForm
        );
        console.log(res);
        if (res.meta.status !== 201) return this.$message.error("更新文章失败");
        this.$message.success("更新文章成功");
        this.editDialogVisible = false;
        this.getArticleList();
      });
    },
    //根据Id删除文章
    async removeArticleClassById(id) {
      const result = await this.$confirm(
        "此操作将永久删除该文章, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (result !== "confirm") return this.$message.info("已取消删除");
      const { data: res } = await this.$http.delete(`article/list/${id}`);
      console.log(res);
      if (res.meta.status !== 204)
        return this.$message.error("删除失败：" + res.meta.msg);
      this.$message.success("删除成功");
      this.getArticleList();
    },

    //点击按钮，提交角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) return this.$message.warning("请选择一个角色");
      const { data: res } = await this.$http.put(
        `article/list/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId,
        }
      );
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("设置角色失败" + res.meta.msg);
      this.$message.success("设置角色成功");
      this.setRoleDialogVisible = false;
      this.getArticleList();
    },
    //监听设置角色对话框关闭事件
    setRoleDialogClosed() {
      this.userInfo = {};
      this.selectedRoleId = "";
    },
    //编辑文本
    //  onEditorBlur(quill) {
    //     console.log('editor blur!', quill)
    //   },
    //   onEditorFocus(quill) {
    //     console.log('editor focus!', quill)
    //   },
    //   onEditorReady(quill) {
    //     console.log('editor ready!', quill)
    //   },
    onEditorChange({ quill, html, text }) {
      // console.log('editor change!', quill, html, text)
    },
    // 展示添加文章对话框
    async showAddArticleADialog() {
      this.addDialogVisible = true;
    },
    //获取分类列表
    async getClassList() {
      const { data: res } = await this.$http.get(`article/class`);
      console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("设获取分类列表失败" + res.meta.msg);
      this.classList = res.data;
    },
  },
  filters: {
    timeFormat(value) {
      var date = new Date(value);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      var second = date.getSeconds();
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
    },
    class_name(class_id) {
      const class_item = this.classList.find((item) => {
        return item.id == class_id;
      });
      return class_item.class_name;
    },
  },
};
</script>

<style lang="less" scoped>
</style>
