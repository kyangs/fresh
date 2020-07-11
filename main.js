import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'
Vue.prototype.url = 'http://api.fresh.com/api';
Vue.prototype.now = Date.now || function() {
	return new Date().getTime();
}
Vue.prototype.isArray = Array.isArray || function(obj) {
	return obj instanceof Array;
}

Vue.prototype.request = (request_url, data, method) => {
	return uni.request({
		url: Vue.prototype.url + request_url,
		method: method,
		data: data,
		dataType: 'json',
		header: {
			"Authorization": uni.getStorageSync("authorization")
		}
	}).then(res => {
		if (res[1].data.code === 10000) {
			return res[1].data
		}
		throw res[1].data
	}).catch(result => {
		uni.showToast({
			icon: "none",
			title: result.msg,
		})
	})
}
Vue.prototype.get = (request_url, data) => {
	return Vue.prototype.request(request_url, data, 'GET')
}
Vue.prototype.post = (request_url, data) => {
	return Vue.prototype.request(request_url, data, 'POST')
}
Vue.prototype.put = (request_url, data) => {
	return Vue.prototype.request(request_url, data, 'PUT')
}
// 引入全局uView
import uView from "@/uview/index";
Vue.use(uView);

const app = new Vue({
	...App,
})
app.$mount()
