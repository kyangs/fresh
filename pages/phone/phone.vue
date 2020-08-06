<template>
	<view class="nickname">
		<view class="cu-form-group">
			<view class="title">手机号码</view>
			<input placeholder="请输入手机号" v-model="userInfo.phone" name="input"></input>
			<view class="cu-capsule radius">
				<view class='cu-tag bg-blue '>
					+86
				</view>
				<view class="cu-tag line-blue">
					中国大陆
				</view>
			</view>
		</view>
		<view class="cu-form-group">
			<view class="title">验证码</view>
			<input placeholder="请输入验证码" v-model="userInfo.code" name="input"></input>
			<button 
			:disabled="disabled || oldPhone===userInfo.phone || userInfo.phone.length !== 11" 
			@click="sendCode" 
			class='cu-btn bg-green shadow'>{{codeTxt}}</button>
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
				oldPhone: '',
				disabled: false,
				codeTxt: "获取验证码",
			}
		},
		onLoad() {
			this.initUserCenter()
		},
		methods: {
			sendCode() {
				let _this = this
				_this.getVerificationCode(_this.userInfo.phone).then(res => {
					if (res.data.code) {
						let timeo = 60
						let timeStop = setInterval(function() {
							timeo--;
							if (timeo > 0) {
								_this.disabled = true
								_this.codeTxt = '(' + timeo + 's)后重新发送'
							} else {
								timeo = 60
								_this.codeTxt = '获取验证码'
								clearInterval(timeStop)
								_this.disabled = false
							}
						}, 1000)
					}
				})
			},
			modify() {
				let _this = this
				_this.post("/user/info", _this.userInfo).then(res => {
					uni.setStorageSync(_this.cacheKey.userInfo, JSON.stringify(_this.userInfo))
					_this.initUserCenter()
					uni.showToast({
						icon:"none",
						title:"修改成功",
					})
					setTimeout(function() {
						_this.routerTo('/pages/person/person')
					}, 1500);
				})
			},
			initUserCenter() {
				let _this = this
				let userJson = uni.getStorageSync(_this.cacheKey.userInfo)
				if (userJson) {
					_this.userInfo = JSON.parse(uni.getStorageSync(_this.cacheKey.userInfo))
					_this.oldPhone = _this.userInfo.phone
				}
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
