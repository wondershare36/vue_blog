<template>
  <div>

    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--面包屑导航-->
    <el-card>
      <!--警告区域-->
      <el-alert
        show-icon
        :closable="false"
        title="注意：只允许为第三级分类设置相关参数"
        type="warning">
      </el-alert>
      <!--选择商品分类区域-->
      <el-row>
        <el-col class="cat_opt">
          <span>选择商品分类：</span>
          <!--级联选择框-->
          <el-cascader
            v-model="cateSelectedKeys"
            :options="cateList"
            :props="cateCascaderProps"
            @change="handleCascaderChange"></el-cascader>
        </el-col>
      </el-row>
      <!--tab页签区域-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!--添加动态参数面板-->
        <el-tab-pane label="动态参数" name="many">
          <!--添加动态参数按钮-->
          <el-button
            @click="addDialogVisible=true"
            :disabled="isBtnDisable"
            type="primary" size="mini">添加参数
          </el-button>
          <!--动态参数表格-->
          <el-table :data="manyTableData" border stripe>
            <!--展开行-->
            <el-table-column type="expand">
              <template slot-scope="scope" >
                <!--循环渲染tag标签-->
                <el-tag
                  closable
                  @close="deleteAttrTag(scope.row,i)"
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i">{{item}}</el-tag>

                <!--添加按钮-->
                <el-input
                  autofocus
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

              </template>
            </el-table-column>
            <!--索引列-->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="showEditDialog(scope.row)"
                  type="primary"
                  icon="el-icon-edit"
                  size="mini">编辑
                </el-button>
                <el-button
                  @click="deleteAttr(scope.row)"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--添加静态属性面板-->
        <el-tab-pane label="静态属性" name="only">
          <!--添加静态属性按钮-->
          <el-button
            @click="addDialogVisible=true"
            :disabled="isBtnDisable"
            type="primary" size="mini">添加属性
          </el-button>
          <!--静态属性表格-->
          <el-table :data="onlyTableData" border stripe>
            <!--展开行-->
            <el-table-column type="expand">
              <template slot-scope="scope" >
                <!--循环渲染tag标签-->
                <el-tag
                  closable
                  @close="deleteAttrTag(scope.row,i)"
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i">{{item}}</el-tag>

                <!--添加按钮-->
                <el-input
                  autofocus
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>

              </template>
            </el-table-column>
            <!--索引列-->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="showEditDialog(scope.row)"
                  type="primary"
                  icon="el-icon-edit"
                  size="mini">编辑
                </el-button>
                <el-button
                  @click="deleteAttr(scope.row)"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>


    </el-card>

    <!--添加参数对话框-->
    <el-dialog
      @close="addDialogClosed"
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="50%">
      <!--添加参数表单-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCommit">确 定</el-button>
  </span>
    </el-dialog>

    <!--修改参数对话框-->
    <el-dialog
      @close="editDialogClosed"
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="50%">
      <!--添加参数表单-->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitEdit">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    return {
      //商品分类列表
      cateList: [],
      //级联选择框选中项
      cateSelectedKeys: [],
      //级联选择框配置对象
      cateCascaderProps: {
        expandTrigger: 'hover',
        children: "children",
        label: "cat_name",
        value: "cat_id",
      },
      //被激活的页签名称
      activeName: "many",
      //动态参数表格数据
      manyTableData: [],
      //静态属性表格数据
      onlyTableData: [],
      //控制添加参数对话框的显示与隐藏
      addDialogVisible: false,
      //添加参数表单数据对象
      addForm: {
        attr_name: "",//参数名称
        attr_sel: "",//[many,only]动态还是静态
        attr_vals: "",//【可选参数】如果是 many 就需要填写值的选项，以逗号分隔
      },
      //添加数据表单验证规则
      addFormRules: {
        attr_name: [
          {required: true, message: "请输入参数名称", trigger: "blur"}
        ]
      },
      //控制修改参数对话框的显示和隐藏
      editDialogVisible: false,
      //修改参数表单数据对象
      editForm: {
        attr_name: "",//参数名称
        attr_sel: "",//[many,only]动态还是静态
      },
      //添加数据表单验证规则
      editFormRules: {
        attr_name: [
          {required: true, message: "请输入参数名称", trigger: "blur"}
        ]
      },


    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取所有的商品分类列表
    async getCateList() {
      const {data: res} = await this.$http.get(`/categories`)
      if (res.meta.status !== 200) return this.$message.error("获取商品分类列表失败" + res.meta.msg)
      this.cateList = res.data;
      console.log(this.cateList)
    },
    //监听级联选择框发生改变事件
    handleCascaderChange() {
      //选中不是三级分类
      if (this.cateSelectedKeys.length !== 3) {
        this.$message.warning("注意：只允许为第三级分类设置相关参数")
        this.cateSelectedKeys = []
        this.manyTableData=[]
        this.onlyTableData=[]
        return
      }
      this.getParamsData()
    },
    //监听Tabs页签点击事件
    handleTabClick() {
      if (!this.cateSelectedKeys || this.cateSelectedKeys.length !== 3) return
      this.getParamsData()
    },
    //获取表格数据
    async getParamsData() {
      //根据所选分类id和所选面板发起请求
      const {data: res} = await this.$http.get(`/categories/${this.cateId}/attributes`, {
        params: {
          sel: this.activeName
        }
      })
      if (res.meta.status !== 200) return this.$message.error("获取分类参数失败：" + res.meta.msg)
      //处理数据格式
      res.data.forEach(item=>{
        item.attr_vals=item.attr_vals?item.attr_vals.split(","):[]
        //控制按钮与文本框的切换显示
        item.inputVisible=false
        //文本框输入内容
        item.inputValue=""
      })
      console.log(res.data)

      //如果获取的是动态参数
      if (this.activeName === "many") this.manyTableData = res.data
      else if (this.activeName === "only") this.onlyTableData = res.data


    },
    //监听添加对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    //点击按钮，提交添加表单
    addCommit() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.warning("请完善表单数据")
        this.addForm.attr_sel = this.activeName
        console.log(this.addForm)
        const id = this.cateId
        const {data: res} = await this.$http.post(`categories/${id}/attributes`, this.addForm)
        if (res.meta.status !== 201) return this.$message.error("添加失败:" + res.meta.msg)
        this.$message.success("添加成功")
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    //监听修改对话框关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //点击按钮，展示编辑对话框
    async showEditDialog(param) {
      console.log(param)
      //根据分类id和参数id获取参数列表
      const cateId = this.cateId//分类id
      const attr_id = param.attr_id//参数id
      const {data: res} = await this.$http.get(`categories/${cateId}/attributes/${attr_id}`);
      if (res.meta.status !== 200) return this.$message.error("获取参数列表失败" + res.meta.msg)
      this.editForm.attr_id = res.data.attr_id
      this.editForm.attr_name = res.data.attr_name
      this.editForm.attr_sel = res.data.attr_sel
      this.editDialogVisible = true
    },
    //点击按钮，提交编辑表单
    submitEdit() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.warning("请完善表单数据")
        const cateId = this.cateId//分类id
        const attr_id = this.editForm.attr_id//参数id
        const {data: res} = await this.$http.put(`categories/${cateId}/attributes/${attr_id}`, this.editForm);
        if (res.meta.status !== 200) return this.$message.error("更新参数列表失败" + res.meta.msg)
        this.$message.success("更新参数列表成功")
        this.editDialogVisible = false
        this.getParamsData()
      })
    },
    //点击按钮，删除属性
    async deleteAttr(param) {
      const result = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== "confirm") return this.$message.info("取消了删除")
      const {data: res} = await this.$http.delete(`/categories/${this.cateId}/attributes/${param.attr_id}`);
      if (res.meta.status !== 200) return this.$message.error("删除失败:" + res.meta.msg)
      this.$message.success("删除成功")
      this.getParamsData()
    },
    //删除tag属性标签
    async deleteAttrTag(param,index){
     const result=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err=>err)
      if(result!=="confirm")return this.$message.info("取消了删除")
      const attr_vals=param.attr_vals.splice(index,1)
      console.log(attr_vals)
      //将对 atrrs_vals的操作保存到数据库
      this.saveAttrVals(param)

    },
    //将对 atrrs_vals的操作保存到数据库
    async saveAttrVals(row){


      const {data:res}=await this.$http.put(`/categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(","),
      })
      if(res.meta.status!==200)return this.$message.error("更新失败"+res.meta.msg)
      this.$message.success("更新成功")

    },
    // tag文本框失去焦点或按下enter键都会触发该事件
    async handleInputConfirm(row){
      //如果没有输入内容
      if(row.inputValue.trim().length===0){
        row.inputValue=""
        row.inputVisible=false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue=""
      row.inputVisible=false
      //将对 atrrs_vals的操作保存到数据库
      this.saveAttrVals(row)
    },
    //点击按钮，展示文本输入框
    showInput(row){
      row.inputVisible=true
      //让文本框自动获得焦点
      //$nextTick当页面上元素被重新渲染后才会执行回调函数中的代码
      // 下划线 _={}相当于()=>{}
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    }

  },
  computed: {
    //如果按钮需要被禁用，则返回true
    isBtnDisable() {
      if (this.cateSelectedKeys.length !== 3) return true
      return false
    },
    //当前选中的三级分类id
    cateId() {
      if (this.cateSelectedKeys.length !== 3) return null
      return this.cateSelectedKeys[this.cateSelectedKeys.length - 1]
    },
    //动态计算标题的文本
    titleText() {
      if (this.activeName === "many") return "动态参数"
      return "静态属性"
    }
  }
};
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
