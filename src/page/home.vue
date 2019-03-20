<template>
    <div class="manage_page">
        <el-row style="height: 100%;">
            <el-col :span="4" style="min-height: 100%; background-color: #324057;">
                <el-menu :default-active="defaultActive" router>
                    <el-menu-item index="home">
                        <!--修改首页地址wei首页内容，即首页不会再跳转-->
                        <i class="el-icon-menu"></i>
                        <i style="color: #D1EEEE;">首页</i>

                    </el-menu-item>

                    <el-submenu index="2">
                        <template slot="title">
                            <i class="el-icon-plus"></i>
                            <i style="color: #D1EEEE;">菜品管理</i>
                        </template>
                        <el-menu-item index="addOrderDishes">添加菜品</el-menu-item>
                        <el-menu-item index="custemOrderDishes">用户自定义菜品</el-menu-item>
                    </el-submenu>

                </el-menu>
            </el-col>
            <el-col :span="20" style="height: 100%;overflow: auto;">
                <!--header start,path应为当页面路由地址-->
                <div class="header_container">
                    <el-breadcrumb separator="/">
                        <!--此处设置的分割符号将会显示在页面如:首页/数据管理/用户列表-->
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
                    </el-breadcrumb>

                    <el-dropdown @command="handleCommand" menu-align='start'>
                        <span class="avator">{{user_name}}<img :src="this.userAvatar" /></span>
                        <!--img只能在其中通过此方式使用-->
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="home">首页</el-dropdown-item>
                            <!--command 事件触发-->
                            <el-dropdown-item command="logout">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <!--header end，header不变，路由页面变化-->
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { Message } from "element-ui";
export default {
  data() {
    //FIXXME用户数据通过全局session拿
    return {
      userAvatar: require("../assets/avatar.png"), //指定用户的本地路径文件
      user_name: localStorage.getItem("username")
    };
  },
  methods: {
    handleCommand(command) {
      //统一处理el-dropdown的事件处理,事件定义到按照command进行
      switch (command) {
        case "home":
          this.$router.push("/home");
          break;
        case "logout": //处理退出事件
          Message.success({ message: "登出成功" });
          localStorage.removeItem("Authorization"); //登出,清除token
          this.$router.push("/");

          break;
      }
    }
  }
};
</script>


<style lang="less" scoped>
@import "../style/mixin";

.manage_page {
  height: 100%;
  width: 100%;
}
.el-menu {
  background-color: #324057;
}
.header_container {
  background: #eff2f7;
  height: 65px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
}

.user {
  padding-right: 50px;
}
.avator {
  .wh(38px, 38px);
  padding-right: 20px;
  text-align: center;

  img {
    //可设置class内的节点
    width: 36px;
    height: 36px;
    border-radius: 20px;
    margin: 5px 0px 0px 5px;
  }
}
.el-dropdown-menu_item {
  text-align: center;
  color: #324057;
}
</style>
