import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const store = new Vuex.Store({

  state: {
    // 存储token
    Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : '',
    username: localStorage.getItem('username') ? localStorage.getItem('user_name') : '',

  },

  mutations: {
    // 将token以Bearar token的形式保存
    changeLogin(state, user) {
      state.Authorization = user.Authorization;
      localStorage.setItem('Authorization', user.Authorization);
    },
    
    saveUserName(state, user){
      state.username = user.username;
      //将对应用户的值存到localstorage中，以防浏览器刷新后的vuex重启，造成数据丢失
      localStorage.setItem('username', user.username);
    }
  }
});

export default store;