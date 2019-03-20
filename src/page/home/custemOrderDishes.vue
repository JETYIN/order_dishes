<template>
  <div class="fillcontain">
    <div class="table_container">
      <el-table :data="tableData" highlight-current-row style="width: 100%">
        <el-table-column type="index" width="100">
        </el-table-column>
        <el-table-column property="update_time" label="日期" width="220">
        </el-table-column>
        <el-table-column property="user_name" label="用户id" width="320">
        </el-table-column>
        <el-table-column property="order_dish_name" label="自定义菜名">
        </el-table-column>
      </el-table>
      <div class="Pagination" style="text-align: left;margin-top: 10px;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="20" layout="total, prev, pager, next" :total="count">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
  watch: {
    $route(to, from) {
      if (to.path == "/custemOrderDishes") {
        this.initData();
      }
    }
  },
  methods: {
    async initData() {
      this.postRequest("/kitchen/custom", {
        //后端接口
        page: this.currentPage,
        pageSize: this.limit
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

    //点击下一页就行请求下一页数据
    handleCurrentChange(val) {
      console.log("page change,val:" + val);
      this.currentPage = val;
      this.getPageList();
    },

    async getPageList() {
      this.tableData = []; //必须清除掉每一页的数据
      this.postRequest("/kitchen/custom", {
        //后端接口
        page: this.currentPage,
        pageSize: this.limit
      }).then(res => {
        if (res && res.status == 200) {
          var list = res.data.list;
          if (!list) {
            return;
          }
          list.forEach(node => {
            const tableData = {};
            tableData.update_time =
              new Date(node.update_date)
                .toLocaleDateString()
                .replace(/\//g, "-") +
              " " +
              new Date(node.update_date).toTimeString().substr(0, 8);
            tableData.user_name = node.user_name;
            tableData.order_dish_name = node.order_dishes;
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
@import "../../style/mixin";
.table_container {
  padding: 20px;
}
</style>
