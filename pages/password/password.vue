<template>
	<view class="nickname">
		<view class="cu-form-group">
			<view class="title">新密码</view>
			<input password placeholder="请输入不少于6个字符新密码" v-model="password" name="password"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">确认密码</view>
			<input password placeholder="请重复新密码" v-model="newPassword" name="newPassword"></input>
		</view>
		<view class="padding flex flex-direction">
			<button @click="modify" class="cu-btn bg-gradual-green margin-tb-sm lg">确定</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {},
				password: '',
				newPassword: '',

			}
		},
		onLoad() {
			this.initUserCenter()
		},
		methods: {
			initUserCenter() {
				let _this = this
				let userJson = uni.getStorageSync(_this.cacheKey.userInfo)
				if (userJson) {
					_this.userInfo = JSON.parse(uni.getStorageSync(_this.cacheKey.userInfo))
				}
			},
			modify() {
				let _this = this
				if(this.password.trim() ==='' ||this.password.trim().length < 6){
					uni.showToast({
						icon: "none",
						title: "密码长度不可少于6个字符",
					})
					return
				}
				if (this.password !== this.newPassword) {
					uni.showToast({
						icon: "none",
						title: "两次输入密码不一致",
					})
					return
				}
				let param = Object.assign({
					password: _this.password
				}, _this.userInfo)
				_this.post("/user/info", param).then(res => {
					uni.setStorageSync(_this.cacheKey.userInfo, JSON.stringify(_this.userInfo))
					_this.initUserCenter()
					uni.showToast({
						icon: "none",
						title: "修改成功,下次登录生效",
					})
					setTimeout(function() {
						_this.routerTo('/pages/person/person')
					}, 1500);
				})
			},

		}
	}
</script>

<style scoped>
	.nickname {
		width: 100%;
		height: 100%;
	}

	.nickname-message {
		width: 100%;
		height: 90rpx;
		background: #FFFFFF;
		padding: 0 24rpx;
		box-sizing: border-box;
	}

	.nickname-message-input {
		width: 100%;
		height: 90rpx;
		font-size: 26rpx;
		line-height: 90rpx;
	}

	.nickname-message-code {
		width: 80%;
		height: 90rpx;
		font-size: 26rpx;
		float: left;
		line-height: 90rpx;
	}

	.nickname-message-button {
		width: 18%;
		height: 90rpx;
		font-size: 26rpx;
		float: right;
		line-height: 90rpx;
	}

	.nickname-message-input:-ms-input-placeholder {
		font-size: 26rpx;
	}
</style>
