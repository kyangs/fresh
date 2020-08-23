<template>
	<view class="login">
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		<view class="login-box">
			<!-- 关闭按钮 -->
			<view class="login-box-close">
				<text class="lg text-gray cuIcon-close" @click="back"></text>
			</view>
			<!-- APP名称 -->
			<view class="login-box-name">登陆</view>
			<view v-if="loginForm.loginMode==='SMS'">
				<view class="cu-form-group">
					<view class="title">手机号</view>
					<input placeholder="请输入手机号" maxlength="11" mixlength="11" name="account" v-model="loginForm.account"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">验证码</view>
					<input placeholder="请输入验证码" v-model="loginForm.smsCode" name="input"></input>
					<button :disabled="disabledCodeComputed" @click="sendCode" class='cu-btn bg-green shadow'>{{codeTxt}}</button>
				</view>
				<!-- 提示文字 -->
				<view class="login-box-prompt">
					未注册的手机号,验证后自动创建账户
				</view>
			</view>
			<view v-if="loginForm.loginMode==='PASS'">
				<view class="cu-form-group">
					<view class="title">登录账号</view>
					<input placeholder="请输入手机号或账号" name="account" v-model="loginForm.account"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">登录密码</view>
					<input placeholder="请输入登录密码" password name="password" v-model="loginForm.password"></input>
				</view>
			</view>
			<!-- 输入手机号 -->

			<!-- 输入手机号 -->

			<!-- 获取验证码 -->
			<view class="login-box-captcha">
				<button class="login-button" :disabled="disabledLogin" @click="doLogin">
					{{loginText}}
				</button>
			</view>
			<!-- 遇到问题 -->
			<view class="login-box-problem">
				<view v-if="loginForm.loginMode === 'PASS'" @click="loginByPassword">短信验证码登录</view>
				<view v-else @click="loginByPassword">密码登陆</view>
			</view>

			<!-- 顶到到底部 -->

			<view class="login-box-fixed">
				<!-- 第三方登陆 -->
				<!-- <view class="otherLoginTitle">————————其他登录方式————————</view> -->
				<view class="login-box-party">
					<view class="login-box-party-list">
						<!-- <view class="login-box-party-list-icon">
							<button open-type="getPhoneNumber"
							 @getphonenumber="onGetphonenumber" 
							 class="login-box-party-list-icon-box">
								<u-icon name="weixin-fill" color="#00aa00" size="56"></u-icon>
							</button>
						</view>
						<view class="login-box-party-list-name">微信</view> -->
					</view>
					<!-- 					<view class="login-box-party-list">
						<view class="login-box-party-list-icon">
							<view class="login-box-party-list-icon-box" @click="qqlogin">
								<u-icon name="qq-fill" color="#00aa00" size="56"></u-icon>
							</view>
						</view>
						<view class="login-box-party-list-name">QQ登录</view>
					</view> -->
				</view>
				<!-- 协议 -->
				<view class="login-box-fixed-foot">
					<text>登陆代表你同意并遵守</text>
					<navigator url="/pages/index/index" style="color: #29BF00;" open-type='switchTab' hover-class="none">
						《 免责协议 》
					</navigator>
				</view>
			</view>

		</view>



	</view>
</template>

<script>
	export default {
		data() {
			return {
				value: [0, 1, 2],
				visible: true,
				loginText: '立即登录',
				disabledSendCode: false,
				disabledLogin: false,
				codeTxt: '获取验证码',
				loginForm: {
					account: '',
					password: '',
					smsCode: '',
					loginMode: 'PASS',
				},
				urlTo:'/pages/home/home?event=login',
			}
		},
		onLoad(option) {
			if(option.url){
				this.urlTo = option.url
			}
		},
		computed: {
			disabledCodeComputed() {
				return this.verifyPhone(this.loginForm.account) === false || this.disabledSendCode
			},
		},
		methods: {
			sendCode() {
				let _this = this
				_this.disabledSendCode = true
				_this.getVerificationCode(_this.loginForm.account).then(res => {
					if (res.data && res.data.code) {
						let timeo = 60
						let timeStop = setInterval(function() {
							timeo--;
							if (timeo > 0) {
								_this.disabled = true
								_this.disabledSendCode = true
								_this.codeTxt = '(' + timeo + 's)后重新发送'
							} else {
								timeo = 60
								_this.codeTxt = '获取验证码'
								clearInterval(timeStop)
								_this.disabled = false
								_this.disabledSendCode = false
							}
						}, 1000)
						return
					}
					_this.disabledSendCode =false
				})
			},
			loginByPassword() {
				this.loginForm.loginMode = this.loginForm.loginMode === 'SMS' ? 'PASS' : 'SMS'
			},
			doLogin() {

				let _this = this

				if (_this.loginForm.account === '') {
					uni.showToast({
						icon: "none",
						title: "请输入手机号或账号"
					})
					return
				}

				if (this.loginForm.loginMode === 'PASS' && _this.loginForm.password === '') {

					uni.showToast({
						icon: "none",
						title: "请输入密码"
					})
					return
				}
				if (this.loginForm.loginMode === 'SMS' && _this.loginForm.smsCode === '') {
					uni.showToast({
						icon: "none",
						title: "请验证码"
					})
					return
				}

				_this.loginText = "正在登录...."
				_this.disabledLogin=true
				_this.post('/user/login', _this.loginForm).then(res => {
					_this.loginText = "立即登录"
					_this.disabledLogin=false
					if (!res) return

					uni.setStorageSync(_this.cacheKey.userInfo, JSON.stringify(res.data))
					uni.showToast({
						icon: "none",
						title: "登录成功",
					})

					setTimeout(function() {
						_this.routerTo(_this.urlTo)
					}, 1500);

				})
			},
			goCode() {
				uni.navigateTo({
					url: '/pages/code/code'
				});
			},
			back() {
				uni.navigateBack({
					delta: 2
				});
			},
			onGetphonenumber(e) {
				let _this = this
				if (e.detail.errMsg === 'getPhoneNumber:ok') {
					uni.login({
						provider: 'weixin',
						success: function(loginRes) {
							uni.authorize({
								scope: 'scope.userInfo',
								success() {
									uni.getUserInfo({
										provider: 'weixin',
										success: function(infoRes) {
											_this.post("/user/wx-login", {
												phoneRow: e.detail,
												loginRes: loginRes,
												userInfo: infoRes,
											})
										}
									});
								}
							})
						}
					});

					return
				}
				uni.showToast({
					icon: "none",
					title: "您已取消授权",
				})
			},
		}
	}
</script>

<style scoped>
	.login {
		width: 100%;
		height: 100%;
	}

	.login-box {
		width: 100%;
		height: calc(100% - var(--status-bar-height));
		background: #FFFFFF;
	}

	.login-box-close {
		width: 100%;
		height: 92rpx;
		padding: 0 32rpx;
		line-height: 92rpx;
		box-sizing: border-box;
		margin-bottom: 26rpx;
	}

	.login-box-close text {
		font-size: 50rpx;
		color: #30A500;
	}

	.login-box-name {
		width: 100%;
		height: 172rpx;
		line-height: 172rpx;
		font-size: 50rpx;
		color: #000000;
		padding: 0 82rpx;
		box-sizing: border-box;
	}

	.login-box-phone {
		width: 100%;
		height: 60rpx;
		margin-top: 20rpx;
		padding: 0rpx 82rpx;
		box-sizing: border-box;
	}

	.login-box-phone-box {
		width: 100%;
		height: 100%;
		border-bottom: 1rpx solid #DFDFDF;
	}

	.login-box-phone-box-input {
		font-size: 34rpx;
	}

	.login-box-prompt {
		width: 100%;
		height: 72rpx;
		line-height: 72rpx;
		color: #919191;
		font-size: 24rpx;
		padding-left: 82rpx;
		box-sizing: border-box;
	}

	.login-box-captcha {
		width: 100%;
		height: 144rpx;
		padding: 28rpx 76rpx;
		box-sizing: border-box;
	}

	.login-box-captcha-box {
		width: 100%;
		height: 100%;
		border-radius: 544rpx;
		background: #00aa00;
		color: #FFFFFF;
		font-size: 30rpx;
		font-weight: bold;
		text-align: center;
		line-height: 88rpx;
	}

	.login-button {
		width: 100%;
		height: 100%;
		border-radius: 544rpx;
		background: #00aa00;
		color: #FFFFFF;
		font-size: 30rpx;
		font-weight: bold;
		text-align: center;
		line-height: 88rpx;
	}

	.login-box-problem {
		width: 100%;
		height: 62rpx;
		padding: 0 82rpx;
		line-height: 62rpx;
		box-sizing: border-box;
		color: #4A8F16;
		font-size: 22rpx;
	}

	/* .login-box-problem text{
	color: #4A8F16;
	font-size: 22rpx;
} */
	/* 定位到底部 */
	.login-box-fixed {
		width: 100%;
		height: auto;
		position: absolute;
		left: 0;
		bottom: 0rpx;
	}

	.login-box-fixed-foot {
		width: 100%;
		height: 104rpx;
		padding: 0 80rpx;
		box-sizing: border-box;
		font-size: 20rpx;
		line-height: 104rpx;
		color: #8B8B8B;
		display: flex;
		justify-content: center;
	}

	.login-box-fixed-foot-check {
		width: 22rpx !important;
		height: 22rpx !important;
	}

	.login-box-party {
		width: 100%;
		height: 152rpx;
		display: flex;
		justify-content: space-between;

	}

	.login-box-party-list {
		width: 100%;
		height: 152rpx;
	}

	.login-box-party-list-icon {
		width: 100%;
		height: 104rpx;
		display: flex;
		justify-content: center;
	}

	.login-box-party-list-icon-box {
		width: 104rpx;
		height: 104rpx;
		border-radius: 52rpx;
		border: 1rpx solid #ECECEC;
		text-align: center;
		line-height: 104rpx;
	}

	.login-box-party-list-name {
		width: 100%;
		height: 48rpx;
		text-align: center;
		line-height: 48rpx;
		font-size: 22rpx;
		color: #909090;
	}

	.otherLoginTitle {
		width: 100%;
		text-align: center;
		color: #555555;
		font-size: 28upx;
		line-height: 80upx;
	}
</style>
