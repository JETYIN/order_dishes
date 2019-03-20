<template>
  <div class="fillcontain">
    <section class="data_section">
      <header class="section_title">数据统计</header>
      <el-form ref="order_form" :model="order_form" class="order_form_sty">
        <el-form-item>
          <el-radio-group v-model="radio_status" @change="handleRadioChange">
            <el-radio :label="0">全部</el-radio>
            <el-radio :label="1">荤菜</el-radio>
            <el-radio :label="2">素菜</el-radio>
            <el-radio :label="3">汤类</el-radio>
            <el-radio :label="4">其他</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div class="table_container">
        <el-table :data="tableData" highlight-current-row style="width: 100%">
          <el-table-column type="index" width="100">
          </el-table-column>
          <el-table-column property="order_dish_id" label="编号" width="200">
          </el-table-column>
          <el-table-column property="order_dish_time" label="添加日期" width="200">
          </el-table-column>
          <el-table-column property="order_dish_name" label="菜名" width="200">
          </el-table-column>
          <el-table-column property="order_dish_category" label="类别" width="200">
          </el-table-column>
          <el-table-column property="order_dish_poll" label="投票票数">
          </el-table-column>

          <!--管理后台进行删除菜品的操作-->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="small" type="danger" @click="deleteOrder(scope.$index,scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="Pagination" style="text-align: left;margin-top: 10px;">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="20" layout="total, prev, pager, next" :total="count">
          </el-pagination>
        </div>
      </div>
    </section>
  </div>

</template>

<script>
export default {
  data() {
    return {
      radio_status: 0, //设置单选组件的默认选择
      tableData: [],
      currentRow: null,
      currentPage: 1,
      limit: 20,
      count: 0
    };
  },

  created() {
    this.initData();
  },

  //每次进入页面需要调用数据请求，类似android,路由监听，当从外部路由到/home将会请求一次网络任务

  watch: {
    $route(to, from) {
      if (to.path == "/home") {
        this.initData();
      }
    }
  },
  methods: {
    handleRadioChange(value) {
      this.postRequest("/kitchen/order/category", {
        //后端接口
        page: this.currentPage,
        pageSize: this.limit,
        category: value
      }).then(res => {
        if (res && res.status == 200) {
          this.tableData = []; //必须清除掉每一页的数据
          this.count = res.data.total;

          var list = res.data.list;
          if (!list) {
            return;
          }
          list.forEach(node => {
            const tableData = {};
            tableData.order_dish_time =
              new Date(node.create_date)
                .toLocaleDateString()
                .replace(/\//g, "-") +
              " " +
              new Date(node.create_date).toTimeString().substr(0, 8);
            tableData.order_dish_name = node.order_dishes_name;
            tableData.order_dish_category = this.show(node.category);
            tableData.order_dish_poll = node.poll;
            tableData.order_dish_id = node.id;
            this.tableData.push(tableData);
          });
        } else {
          throw new Error("获取数据失败");
        }
      });
    },

    //删除某一选项的菜品
    async deleteOrder(index, row) {
      try {
        this.deleteRequest("/kitchen/order", {
          //后端接口
          id: row.order_dish_id
        }).then(res => {
          if (res && res.status == 200) {
            this.count = this.count - 1;
            this.$message({
              type: "success",
              message: "删除菜品成功"
            });
            this.tableData.splice(index, 1);
          } else {
            this.$message({
              type: "error",
              message: err.message
            });
          }
        });
      } catch (err) {
        this.$message({
          type: "error",
          message: err.message
        });
      }
    },

    async initData() {
      this.postRequest("/kitchen/order/category", {
        //后端接口
        page: this.currentPage,
        pageSize: this.limit,
        category: this.radio_status
      }).then(res => {
        if (res && res.status == 200) {
          this.count = res.data.total;
        } else {
          throw new Error("获取数据失败");
        }
        //首次第一页，需要调用
        this.getPageList();
      });
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    show(category) {
      if (category == 1) {
        return "荤菜";
      } else if (category == 2) {
        return "素菜";
      } else if (category == 3) {
        return "汤类";
      } else {
        return "其他";
      }
    },

    //点击下一页就行请求下一页数据
    handleCurrentChange(val) {
      console.log("page change,val:" + val);
      this.currentPage = val;
      this.getPageList();
    },

    async getPageList() {
      this.tableData = []; //必须清除掉每一页的数据
      this.postRequest("/kitchen/order/category", {
        //后端接口
        page: this.currentPage,
        pageSize: this.limit,
        category: this.radio_status
      }).then(res => {
        if (res && res.status == 200) {
          var list = res.data.list;
          if (!list) {
            return;
          }
          list.forEach(node => {
            const tableData = {};
            tableData.order_dish_time =
              new Date(node.create_date)
                .toLocaleDateString()
                .replace(/\//g, "-") +
              " " +
              new Date(node.create_date).toTimeString().substr(0, 8);
            tableData.order_dish_name = node.order_dishes_name;
            tableData.order_dish_category = this.show(node.category);
            tableData.order_dish_poll = node.poll;
            tableData.order_dish_id = node.id;
            this.tableData.push(tableData);
          });
        } else {
          throw new Error("获取数据失败");
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "../../style/mixin"; //"./"当前目录，"../父级目录"
.data_section {
  padding: 20px;
  margin-bottom: 40px;
  .section_title {
    text-align: center;
    font-size: 30px;
    margin-bottom: 10px;
  }
  .order_form_sty {
    margin-top: 30px;
    margin-left: 30px;
    text-align: left;
  }
}
.wan {
  .sc(16px, #333);
}
</style>
