<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!--登录表单区域-->
      <el-form class="login_form" :model="loginForm" :rules="login_form_rules" ref="loginFormRef">
        <!--用户名-->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!--按钮区域-->
        <el-form-item class="btns">
          <el-button type="primary" @click="handleLogin">登录</el-button>
          <el-button type="info" @click="handleResetForm">重置</el-button>

        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      //登录表单数据绑定对象
      loginForm: {
        username: 'root',
        password: 'root',
      },
      //表单验证规则对象
      login_form_rules: {
        //验证用户名会否合法
        username: [
          {required: true, message: '请输入登录名称', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10  个字符', trigger: 'blur'},
        ],
        //验证用户名会否合法
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10  个字符', trigger: 'blur'},
        ],
      }
    }
  },
  methods: {
    //点击重置
    handleResetForm() {
      this.$refs.loginFormRef.resetFields();
    },
    //点击登录
    handleLogin() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        const {data: res} = await this.$http.post("/login", this.loginForm);
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error("登录失败");
        this.$message.success("登录成功");
        window.sessionStorage.setItem("token","498282023");
        this.$router.push("/home");
      })
    },

  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
}

</style>
