<template >
	<view class="login" >
		<view class="login-box">
			<!-- 关闭按钮 -->
			<!-- APP名称 -->
			<view class="login-box-name">
				是否同意获取您以下信息
			</view>
			<!-- 输入手机号 -->
			<view class="login-box-name">
				昵称：
			</view>
			<view class="login-box-name">
				头像：
			</view>
			<view class="login-box-name">
				手机号：
			</view>
	
			<!-- 提示文字 -->
			<view class="login-box-prompt">
			</view>
			<!-- 获取验证码 -->
			<view class="login-box-captcha">

				<view class="login-button"  @click="doLogin">
					同意
				</view>
				<view class="login-button-reject"  @click="doLogin">
					拒绝
				</view>
			</view>
	
	
		</view>


	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value:[0,1,2],
				visible:true,
				loginMode: 'PASS',
				loginText: '立即登录',
				loginForm: {
					account: '',
					password: '',
					sms_code: '',
				}
			}
		},
		methods: {
			loginByPassword() {
				this.loginMode = this.loginMode === 'SMS' ? 'PASS' : 'SMS'
			},
			doLogin() {
				let _this = this
				_this.loginText = "正在登录...."
				_this.post('/user/login', _this.loginForm).then(res => {
					_this.loginText = "立即登录"
					if (!res) return

					uni.setStorageSync(_this.cacheKey.userInfo, JSON.stringify(res.data))
					uni.showToast({
						icon: "none",
						title: "登录成功",
					})

					setTimeout(function() {
						_this.routerTo('/pages/home/home?event=login')
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
			// 微信登录
			weixinlogin() {
				uni.authorize({
					scope: 'scope.userInfo',
					success() {
						uni.getUserInfo({
							provider: 'weixin',
							success: function(infoRes) {
								console.log(infoRes)
								console.log('用户昵称为：' + infoRes.userInfo.nickName);
							}
						});
					}
				})
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {

						console.log(loginRes)
					}
				});
			},
			// qq登录
			qqlogin() {
				var _that = this
				uni.login({
					provider: 'qq',
					success: function(loginRes) {
						uni.authorize({
							scope: 'scope.userLocation',
							success() {
								uni.getUserInfo({
									provider: 'qq',
									success: function(infoRes) {
										console.log(infoRes)
										_that.loginImage = infoRes.userInfo.figureurl_qq_2
									}
								});
							}
						})
					}
				});
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
		font-size: 35rpx;
		color: #000000;
		padding: 0 70rpx;
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
		text-align: center;
		padding: 28rpx 76rpx;
		box-sizing: border-box;
		
	}

	.login-box-captcha-box {
		width: 100%;
		height: 100%;
		border-radius: 544rpx;
		background: #D6D6D6;
		color: #FFFFFF;
		font-size: 30rpx;
		font-weight: bold;
		text-align: center;
		line-height: 88rpx;
	}

	.login-button {
		width: 40%;
		height: 80rpx;
		border-radius: 544rpx;
		background: #00aa00;
		color: #FFFFFF;
		font-size: 30rpx;
		font-weight: bold;
		text-align: center;
		line-height: 80rpx;
		float: left;
	}

	.login-button-reject {
		width: 40%;
		height: 80rpx;
		border-radius: 544rpx;
		background: #ff0000;
		color: #FFFFFF;
		font-size: 30rpx;
		font-weight: bold;
		text-align: center;
		line-height: 80rpx;
		float: right;
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
		width: 50%;
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
