import Vue from 'vue'
import App from '@/App'

Vue.config.productionTip = false

App.mpType = 'app'
Vue.prototype.url = 'http://api.fresh.com/api';
Vue.prototype.now = Date.now || function() {
	return new Date().getTime();
}
Vue.prototype.isArray = Array.isArray || function(obj) {
	return obj instanceof Array;
}

// 判断url是不是tabBar
Vue.prototype.isTabBar = function(page) {
	let tabar = [
		"/pages/class/class",
		"/pages/index/index",
		"/pages/find/find",
		"/pages/home/home",
	];
	console.log(page)
	for (let i = 0; i < tabar.length; i++) {
		if (page.search(tabar[i]) !== -1) {
			return true
		}
	}
	return false
}

Vue.prototype.cacheKey = {
	userInfo: "userInfo"
}
// 路由跳转
Vue.prototype.routerTo = function(url) {
	let tabar = this.isTabBar(url)
	if (tabar) {
		return uni.reLaunch({
			url: url
		});
	}
	return uni.navigateTo({
		url: url
	});
}

Vue.prototype.request = function(request_url, data, method) {
	let _this = this
	return uni.request({
		url: _this.url + request_url,
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


Vue.prototype.get = function(request_url, data) {
	return this.request(request_url, data, 'GET')
}
Vue.prototype.post = function(request_url, data) {
	return this.request(request_url, data, 'POST')
}
Vue.prototype.put = function(request_url, data) {
	return this.request(request_url, data, 'PUT')
}

// 发送验证码统一请求
Vue.prototype.getVerificationCode = function(phone) {
	return this.request("/verification/code", {phone:phone}, 'POST')
}
// 匹配手机号是否正确
Vue.prototype.verifyPhone = function(phone) {
	let patt = /^1[3456789]\d{9}$/
	return patt.test(phone)
}



// 引入全局uView
import uView from "@/uview/index";
Vue.use(uView);

const app = new Vue({
	...App,
})
app.$mount()
