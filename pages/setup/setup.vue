<template>
	<view class="setup">
		<view class="setup-box">
			<view class="setup-box-list">
				<view class="setup-box-list-left" @click="clearCache">
					清除缓存
				</view>
				<view class="setup-box-list-right">

				</view>
			</view>
			<view class="setup-box-list">
				<view class="setup-box-list-left">
					去评分
				</view>
				<view class="setup-box-list-right">
					<text class="lg text-gray cuIcon-right"></text>
				</view>
			</view>
			<view class="setup-box-list">
				<view class="setup-box-list-left">
					关于我们
				</view>
				<view class="setup-box-list-right">
					<text class="lg text-gray cuIcon-right"></text>
				</view>
			</view>
			<view class="setup-box-list">
				<view class="setup-box-list-left">
					免责声明
				</view>
				<view class="setup-box-list-right">
					<text class="lg text-gray cuIcon-right"></text>
				</view>
			</view>
		</view>
		<view class="gender-quit" @click="goLoginOut">退出登陆</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			clearCache(){
				uni.showToast({
					icon: "none",
					title: "清理成功",
				})
			},
			goLoginOut() {
				let _this = this
				uni.clearStorageSync(_this.cacheKey.userInfo)
				uni.showToast({
					icon: "none",
					title: "退出成功",
				})
				setTimeout(function() {
					_this.routerTo('/pages/home/home')
				}, 1500);
			}
		}
	}
</script>

<style scoped>
	.setup {
		width: 100%;
		height: 100%;
		padding-top: 20rpx;
		box-sizing: border-box;
	}

	.setup-box {
		width: 100%;
		height: auto;
		background: #FFFFFF;
		padding: 0 10rpx 0 24rpx;
		box-sizing: border-box;
		margin-bottom: 20rpx;
	}

	.setup-box-list {
		width: 100%;
		border-bottom: 1rpx solid #F3F3F3;
		display: flex;
		justify-content: space-between;
		height: 95rpx;
		line-height: 95rpx;
	}

	.setup-box-list:nth-last-child(1) {
		border-bottom-color: #FFFFFF;
	}

	.setup-box-list-left {
		width: 280rpx;
		height: 100%;
		font-size: 30rpx;
		color: #000000;
	}

	.setup-box-list-right {
		flex: 1;
		height: 100%;
		padding-right: 30rpx;
		height: 95rpx;
		display: flex;
		justify-content: flex-end;


	}

	.setup-box-list-right text {

		font-size: 30rpx;

	}

	.gender-quit {
		width: 100%;
		height: 95rpx;
		font-size: 30rpx;
		color: #000000;
		text-align: center;
		line-height: 95rpx;
		background: #FFFFFF;
	}
</style>
