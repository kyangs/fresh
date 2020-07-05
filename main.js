import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'
Vue.prototype.url = 'http://api.fresh.com';  
Vue.prototype.now = Date.now || function () {  
    return new Date().getTime();  
};  
Vue.prototype.isArray = Array.isArray || function (obj) {  
    return obj instanceof Array;  
};
// 引入全局uView
import uView from "@/uview/index";
Vue.use(uView);



const app = new Vue({
    ...App
})
app.$mount()
