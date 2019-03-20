<template>
  <div class="login_page fillcontain">
    <transition name="form-fade" mode="in-out">
      <section class="form_contianer" v-show="showLogin">
        <div class="manage_tip">
          <p>Yumoon Kitchen</p>
        </div>
        <el-form :model="loginForm" :rules="logn_rules" ref="loginForm">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="用户名">
            
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" placeholder="密码" v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()" class="submit_btn">登陆</el-button>
          </el-form-item>
        </el-form>
        <p class="tip">yumoon kitchen</p>
        <p class="tip">注册过的用户可凭账号密码登录</p>
      </section>
    </transition>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      loginForm: {
        username: "", //设置默认的用户名密码,从上次登录中获取
        password: ""
      },
      logn_rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      },
      showLogin: false //控制是否显示登陆页面
    };
  },
  mounted() {
    //控制登陆界面显示
    this.showLogin = true;
  },

  methods: {
    ...mapMutations(["changeLogin", "saveUserName"]),
    //登陆按钮触发
    submitForm() {
      if (!this.loginForm.username || !this.loginForm.password) {
        return;
      }
      var _this = this;

      this.postRequest("/authentication/admin/login", {
        //后端接口
        username: this.loginForm.username,
        password: this.loginForm.password
      }).then(res => {
        if (res && res.status == 200) {
          this.$message({
            type: "success",
            message: "登录成功"
          });
          _this.changeLogin({ Authorization: "Bearer " + res.data.message }); //将服务端生成的token保存到store中,并保存用户的全局数据
          //保存用户信息，比如用户的用户名，icon等信息
          _this.saveUserName({ username: this.loginForm.username }); //保存用户名等信息
          var path = _this.$route.query.redirect;
          _this.$router.replace({
            path: path == "/" || path == undefined ? "/home" : path
          }); //登录成功跳转到管理后台主页面
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../style/mixin";
.login_page {
  position: absolute; //absolute去掉backgroud-color将不会生效
  background-color: #324057;
}
.manage_tip {
  position: absolute;
  width: 100%;
  top: -100px;
  left: 0;
  p {
    font-size: 34px;
    color: #fff;
  }
}
.form_contianer {
  .wh(320px, 240px);
  .ctp(320px, 240px);
  padding: 25px;
  border-radius: 5px;
  text-align: center;
  background-color: #fff;
  .submit_btn {
    width: 100%;
    font-size: 16px;
  }
}
.tip {
  font-size: 12px;
  color: red;
}
.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 1s;
}
.form-fade-enter,
.form-fade-leave-active {
  transform: translate3d(0, -50px, 0);
  opacity: 0;
}
</style>
