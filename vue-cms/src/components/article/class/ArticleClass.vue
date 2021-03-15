<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>文章分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <!--搜索与添加-->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input @clear="getClass" clearable v-model="queryInfo.query" placeholder="请输入内容">
            <el-button @click="getClass" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="addDialogVisible=true" type="primary">添加分类</el-button>
        </el-col>
      </el-row>


      <!--分类表格-->
      <el-table :data="article_class" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="分类名称" prop="class_name"></el-table-column>
        <!--操作按钮-->
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <!--修改-->
            <el-button type="primary" @click="showEditDialog(scope.row.id)" icon="el-icon-edit" size="mini"></el-button>
            <!--删除-->
            <el-button type="danger" @click="removeArticleClassById(scope.row.id)" icon="el-icon-delete"
                       size="mini"></el-button>
            <!--分配角色-->
            <el-tooltip :enterable="false" class="item" effect="dark" content="分配角色" placement="top">
              <el-button type="warning" @click="setRole(scope.row)" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
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
        :total="total">
      </el-pagination>
    </el-card>
    <!--修改分类对话框-->
    <el-dialog
      @close="editDialogClosed"
      title="修改分类"
      :visible.sync="editDialogVisible"
      width="50%">
      <!--表单主体-->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px">
        <el-form-item label="分类名">
          <el-input v-model="editForm.class_name" ></el-input>
        </el-form-item>
      </el-form>
      <!--底部按钮-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="editUser">确 定</el-button>
     </span>
    </el-dialog>

    <!--添加分类对话框-->
    <el-dialog
      @close="addDialogClosed"
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="30%">
      <!--表单主体-->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px">
        <el-form-item label="分类名称" prop="class_name">
          <el-input v-model="addForm.class_name"></el-input>
        </el-form-item>
      </el-form>
      <!--底部按钮-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClass">确 定</el-button>
       </span>
    </el-dialog>



  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    //自定义邮箱校验规则
    var checkEmail = (rule, value, callback) => {
      //验证邮箱正则表达式
      const regEmail = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
      if (!regEmail.test(value)) return callback(new Error("请输入合法邮箱"));
      return callback()
    }
    //自定义手机校验规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /0?(13|14|15|17|18|19)[0-9]{9}/
      if (!regMobile.test(value)) return callback(new Error("请输入合法手机号"));
      return callback()
    }
    return {
      //获取分类列表的参数对象
      queryInfo: {
        query: '',
        //当前页数
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 10
      },
      //分类列表
      article_class: [],
      //分类列表总条数
      total: 0,
      //添加分类对话框的显示隐藏
      addDialogVisible: false,
      //修改分类对话框的显示隐藏
      editDialogVisible: false,
      //添加分类的表单数据
      addForm: {
        class_name: "",
      },
      //编辑分类表单
      editForm: {
        class_name: "",
      },
      //添加分类的表单数据的校验规则
      addFormRules: {
        class_name: [
          {required: true, message: "请输入分类名称", trigger: "blur"},
          {min: 2, max: 10, message: "分类名称的长度在2到10之间", trigger: "blur"},
        ],
      },
      //编辑分类表单数据的校验规则
      editFormRules: {
        class_name: [
          {required: true, message: "请输入邮箱", trigger: "blur"},
          {min: 2, max: 10, message: "分类名称的长度在2到10之间", trigger: "blur"},
        ],
      },
      //控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      //需要被分配权限的分类信息
      userInfo: {},
      //所有角色列表
      rolesList: [],
      //选择角色的id
      selectedRoleId: "",
    }
  },
  created() {
    this.getClass();
  },
  methods: {
    //获取分类列表
    async getClass() {
      const {data: res} = await this.$http.get("article/class", {params: this.queryInfo});
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.article_class = res.data;
      this.total = res.data.total;
    },
    //监听 pagesize改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getClass();
    },
    //监听页码值改变事件
    handleCurrentChange(newPage) {
      console.log(newPage)
    },
    //监听switch开关
    async userStateChange(userInfo) {
      const {data: res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
      console.log(res)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("更新分类状态失败");
      }
      this.$message.success("更新分类状态成功")
    },
    //监听添加分类对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    //点击按钮，添加新分类
    addClass() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.warning("请按规范填写表单")
        const {data: res} = await this.$http.post("article/class", this.addForm);
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error("添加分类失败")
        this.$message.success("分类添加成功")
        this.addDialogVisible = false
        this.getClass()
      })
    },
    //监听编辑分类按钮
    async showEditDialog(id) {
      const {data: res} = await this.$http.get("article/class/" + id)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error("查询分类失败")
      this.editForm.id = res.data.id
      this.editForm.class_name = res.data.class_name
      this.editDialogVisible = true
    },
    //编辑分类弹窗关闭
    editDialogClosed() {
      this.editDialogVisible = false
    },
    //提交编辑分类
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.warning("请按规范填写表单")
        const {data: res} = await this.$http.put("article/class/" + this.editForm.id, {
          class_name: this.editForm.class_name,
        })
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error("更新分类失败")
        this.$message.success("更新分类成功")
        this.editDialogVisible = false
        this.getClass()
      })
    },
    //根据Id删除分类
    async removeArticleClassById(id) {
      const result = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== "confirm") return this.$message.info("已取消删除")
      const {data: res} = await this.$http.delete(`article/class/${id}`);
      console.log(res)
      if (res.meta.status !== 204) return this.$message.error("删除失败：" + res.meta.msg)
      this.$message.success("删除成功")
      this.getClass()
    },
    //展示分配角色对话框
    async setRole(userInfo) {
      //展示对话框之前获取所有的角色列表
      const {data: res} = await this.$http.get("/roles")
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error("获取角色列表失败：" + res.meta.msg)
      //保存到data
      this.rolesList = res.data
      this.userInfo = userInfo
      this.setRoleDialogVisible = true
    },
    //点击按钮，提交角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) return this.$message.warning("请选择一个角色")
      const {data: res} = await this.$http.put(`article/class/${this.userInfo.id}/role`, {
        rid: this.selectedRoleId
      })
      console.log(res)
      if(res.meta.status!==200) return  this.$message.error("设置角色失败"+res.meta.msg)
      this.$message.success("设置角色成功")
      this.setRoleDialogVisible=false
      this.getClass()
    },
    //监听设置角色对话框关闭事件
    setRoleDialogClosed(){
      this.userInfo={}
      this.selectedRoleId=""
    }
  },

}
</script>

<style lang="less" scoped>

</style>
