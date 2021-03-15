<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card>
      <!--提示消息-->
      <el-alert
        :closable="false"
        title="添加商品信息"
        type="info"
        center
        show-icon>
      </el-alert>

      <!--步骤条-->
      <el-steps
        align-center
        :active="activeIndex-0"
        finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>


      <!--表单区域-->
      <el-form
        label-position="top"
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px">
        <!--tab栏区域-->
        <el-tabs
          @tab-click="tabClicked"
          :before-leave="beforeTabLeave"
          v-model="activeIndex"
          tab-position="left">
          <!--基本信息-->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cascaderProps"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!--商品参数-->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item1 in manyTableData"
              :label="item1.attr_name"
              :key="item1.attr_id">
              <!--复选框组-->
              <el-checkbox-group v-model="item1.attr_vals">
                <el-checkbox
                  border
                  v-for="(item2,index2) in item1.attr_vals"
                  :key="index2"
                  :label="item2"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!--商品属性-->
          <el-tab-pane label="商品属性" name="2">
              <el-form-item
                v-for="only in onlyTableData"
                :key="only.attr_id"
                :label="only.attr_name"
                prop="attr_name">
                <el-input v-model="only.attr_vals"></el-input>
              </el-form-item>
          </el-tab-pane>
          <!--商品图片-->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :on-success="handleSuccess"
              :action="uploadUrl"
              :headers="headObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture-card">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-tab-pane>
          <!--商品内容-->
          <el-tab-pane label="商品内容" name="4">
            <!--富文本编辑器组件-->
            <quill-editor
              ref="myQuillEditor"
              v-model="addForm.goods_introduce"
            />
            <!--添加商品按钮-->
            <el-button
              @click="add"
              type="primary" class="btnAdd">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>

    </el-card>

    <!--图片预览-->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%">
      <img :src="previewUrl" alt="" class="previewImg">
    </el-dialog>

  </div>
</template>

<script>
import _ from  "loadsh"
export default {
  name: "Add",
  data() {
    return {
      activeIndex: "0",
      //添加商品的表单数据对象
      addForm: {
        goods_name: "0",//商品名称
        goods_price: "0",//价格
        goods_number: "0",//数量
        goods_weight: "0",//重量
        goods_introduce: "0",//介绍
        goods_cat: [],//以为','分割的分类列表
        pics: [],//上传的图片临时路径（数组【对象】）
        attrs: [],//商品的参数（数组），包含 `动态参数` 和 `静态属性`
      },
      //添加商品表单数据校验规则
      addFormRules: {
        goods_name: [
          {required: true, message: "请输入商品名称", trigger: "blur"}
        ],
        goods_price: [
          {required: true, message: "请输入商品价格", trigger: "blur"}
        ],
        goods_number: [
          {required: true, message: "请输入商品数量", trigger: "blur"}
        ],
        goods_weight: [
          {required: true, message: "请输入商品重量", trigger: "blur"}
        ],
        goods_cat: [
          {required: true, message: "请选择商品分类", trigger: "blur"}
        ],
      },
      //商品分类列表数据对象
      cateList: [],
      //配置联级选择器对象
      cascaderProps: {
        expandTrigger: "hover",
        children: "children",
        label: "cat_name",
        value: "cat_id"
      },
      //动态参数列表数据
      manyTableData: [],
      //静态属性列表数组
      onlyTableData:[],
      //上传图片的url地址
      uploadUrl:"http://127.0.0.1:8888/api/private/v1/upload",
      //图片上传组件的header对象
      headObj:{
        Authorization:window.sessionStorage.getItem("token")
      },
      //预览图片地址
      previewUrl:"",
      // 控制图片预览的显示和隐藏
      previewVisible:false

    }
  },
  created() {
    //获取商品分类列表
    this.getCateList()
  },
  methods: {
    //获取商品分类列表
    async getCateList() {
      const {data: res} = await this.$http.get(`categories`)
      if (res.meta.status !== 200) return this.$message.error("获取商品分类列表失败：" + res.meta.msg)
      this.cateList = res.data
    },
    //监听联级选择器改变事件
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        return
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (this.addForm.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类")
        return false
      }

    },
    async tabClicked() {
      //访问动态参数面板
      if (this.activeIndex === "1") {
        const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: "many"
          }
        })
        if (res.meta.status !== 200) return this.$message.error("获取动态参数失败：" + res.meta.msg)
        // 处理属性字符串成数组
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : []
        })
        this.manyTableData = res.data
        console.log(res.data)
      }
      else if (this.activeIndex === "2") {
        const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: "only"
          }
        })
        if (res.meta.status !== 200) return this.$message.error("获取动态参数失败：" + res.meta.msg)
        this.onlyTableData=res.data
        console.log(res.data)
      }

    },
    //监听图片上传成功事件
    handleSuccess(res){
      console.log(res)
      const picInfo={
        pic:res.data.tmp_path
      }
      this.addForm.pics.push(picInfo)
    },
    //处理图片预览效果
    handlePreview(file){
      console.log(file)
      const url=file.response.data.url
      this.previewUrl=url
      this.previewVisible=true
    },
    //处理移除图片操作
    handleRemove(file){
      console.log(file)
      const filePath=file.response.data.tmp_path
      const index=this.addForm.pics.findIndex(item=>{
        return item.pic===filePath
      })
      this.addForm.pics.splice(index,1)
    },
    //点击按钮，提交添加表单
    add(){
      console.log(this.addForm)
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid)return this.$message.warning("请完善表单数据")
        const form = _.cloneDeep(this.addForm)
        form.goods_cat=form.goods_cat.join(",")
        //处理动态参数
        this.manyTableData.forEach(item=>{
          const newInfo={
            attr_id:item.attr_id,
            attr_value:item.attr_vals.join(" ")
          }
          this.addForm.attrs.push(newInfo)
        })
        //处理静态属性
        this.onlyTableData.forEach(item=>{
          const newInfo={
            attr_id:item.attr_id,
            attr_value:item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs=this.addForm.attrs
        console.log(form)
        //发起请求添加商品
        //  商品的名称必须是唯一的
        const {data:res}=await this.$http.post(`/goods`,form)
        if(res.meta.status!==201)return  this.$message.error("添加商品失败:"+res.meta.msg)

        this.$message.success("添加商品成功")
        this.$router.push("/goods")
      })
    }
  },
  computed: {
    cateId() {
      console.log(this.addForm.goods_cat.length)
      if (this.addForm.goods_cat.length !== 3) return null
      return this.addForm.goods_cat[2]
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox{
  margin: 0 15px 0 0 !important;
}
.previewImg{
  width: 100%;
}
.btnAdd{
  margin-top: 15px;
}
</style>
