<template>
  <div class="fillcontain">

    <el-form ref="order_form" :model="order_form" :rules="order_rules" label-width="80px">
      <el-form-item>
        <el-radio-group v-model="radio_status">
          <el-radio :label="1">荤菜</el-radio>
          <el-radio :label="2">素菜</el-radio>
          <el-radio :label="3">汤类</el-radio>
          <el-radio :label="4">其他</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="菜品名称" prop="dish">
        <el-input v-model="order_form.dish" placeholder="请输入菜品">
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">确认</el-button>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>
export default {
  data() {
    return {
      order_rules: {
        dish: [{ required: true, message: "请输入菜名", trigger: "blur" }]
      },
      radio_status: 1, //设置第一个默认选中状态
      order_form: {
        dish: ""
      }
    };
  },

  methods: {
    //点击确认按钮进行添加菜品请求
    onSubmit() {
      if (!this.order_form.dish) {
        return;
      }
      this.postRequest("/kitchen/order", {
        //后端接口
        category: this.radio_status,
        order_dishes: this.order_form.dish
      }).then(res => {
        if (res && res.status == 200) {
          this.$message({
            type: "success",
            message: "菜品录入成功"
          });
        } else {
          this.$message({
            type: "error",
            message: res.message
          });
        }
      });
    }
  }
};
</script>


<style lang="less">
@import "../../style/mixin";
.el-form-item{
  margin-top: 20px;
}
</style>
