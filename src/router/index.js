import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');//webpack的加载，在需要的时候才加载
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
//home下的二级界面

const orderDishesVote = r => require.ensure([], () => r(require('@/page/home/orderDishesVote')), 'orderDishesVote');//抽屉栏的右侧菜单选项都以home/形式存在
const addOrderDishes = r => require.ensure([], () => r(require('@/page/home/addOrderDishes')), 'addOrderDishes');
const custemOrderDishes = r => require.ensure([], () => r(require('@/page/home/custemOrderDishes')), 'custemOrderDishes');
//定义路由界面.一般将routes提出进行创建，方便管理,路由第一个设置的为启动的第一个界面
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },


    {
      path: '/home',
      name: 'home',
      component: home,
      children: [{//二级路由，将在主页面中router-view触发
        path: '',
        component: orderDishesVote
      },
      //雨墨厨房新增
      {
        path: '/addOrderDishes',
        component: addOrderDishes,
        meta: ['菜品管理', '添加菜品'],
      }, {
        path: '/custemOrderDishes',
        component: custemOrderDishes,
        meta: ['菜品管理', '用户自定义菜品']
      }]
    }
  ]
});


// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    next();
  } else {
    let token = localStorage.getItem('Authorization');

    if (token === 'null' || token === '') {
      next('/');
    } else {
      next();
    }
  }
});

export default router;
