<template>
	<view class="home">
		<!-- 顶部 -->
		<view class="home-head">
			<view class="status_bar">
				<!-- 这里是状态栏 -->
			</view>
			<view class="home-head-info">
				<view class="home-head-info-box">
					<view class="home-head-info-box-left">
						<view class="home-head-info-box-left-image" @click="goPerson">
							<image v-if="userInfo.full_avatar" :src="userInfo.full_avatar"></image>
							<image v-else :src="defaultAvatar.avatar"></image>
						</view>
						<view v-if="!userInfo.id" @click="goLogin" class="home-head-info-box-left-info">
							登陆 / 注册
						</view>

						<view v-else @click="goPerson" class="home-head-info-box-left-info">
							<text class="acount-center">{{userInfo.nickname}}</text>
							<text class="acount-center">{{userInfo.account}}</text>
						</view>
					</view>
					<view class="home-head-info-box-right" @click="goSetup">
						<text class="lg text-gray cuIcon-settingsfill"></text>
					</view>
				</view>
				<!-- 悬浮 -->
				<view class="home-head-pick">
					<view class="home-head-pick-lits" @click="goCoupon">
						<view class="home-head-pick-lits-number">
							10
						</view>
						<view class="home-head-pick-lits-name">
							优惠券
						</view>
					</view>
					<view class="home-head-pick-lits" @click="goIntegral">
						<view class="home-head-pick-lits-number">
							10
						</view>
						<view class="home-head-pick-lits-name">
							积分
						</view>
					</view>
					<view class="home-head-pick-lits" @tap="goWallet">
						<view class="home-head-pick-lits-number">
							10
						</view>
						<view class="home-head-pick-lits-name">
							我的钱包
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 订单列表 -->
		<view class="home-order">
			<view class="cu-form-group home-order-top" >
				<view  @click="goOrder(0)">全部订单</view>
				<view class="setup-box-list-right" @click="goOrder(0)">
					<text class="lg text-gray cuIcon-right"></text>
				</view>
			</view>
			<view class="home-order-box">
				<view class="home-order-box-list" @click="goOrder(1)">
					<view class="home-order-box-list-icon home-order-box-list-icon-image">
						<!-- <text class="iconfont icon-daizhifu"></text> -->
						<image src="../../static/image/home/zf.png"></image>
						<text class="home-order-box-list-icon-number">7</text>
					</view>
					<view class="home-order-box-list-name">
						待支付
					</view>
				</view>
				<view class="home-order-box-list" @click="goOrder(2)">
					<view class="home-order-box-list-icon home-order-box-list-icon-image">
						<!-- <text class="iconfont icon-daishouhuo"></text> -->
						<image src="../../static/image/home/shouhuo.png"></image>
						<text class="home-order-box-list-icon-number">7</text>
					</view>
					<view class="home-order-box-list-name">
						进行中
					</view>
				</view>
				<view class="home-order-box-list" @click="goOrder(3)">
					<view class="home-order-box-list-icon home-order-box-list-icon-image">
						<!-- <text class="iconfont icon-ai-message"></text> -->
						<image src="../../static/image/home/news.png"></image>
						<text class="home-order-box-list-icon-number">7</text>
					</view>
					<view class="home-order-box-list-name">
						待评价
					</view>
				</view>
				<view class="home-order-box-list">
					<view class="home-order-box-list-icon home-order-box-list-icon-image">
						<!-- <text class="iconfont icon-qiandai"></text> -->
						<image src="../../static/image/home/tuikuan.png"></image>
						<text class="home-order-box-list-icon-number">10</text>
					</view>
					<view class="home-order-box-list-name">
						退款/售后
					</view>
				</view>
			</view>
		</view>
		<!-- 轮播图 -->
		<view class="home-swipe" v-if="centerAdvList.length > 0">
			<view class="home-swipe-box">
				<swiper class="main-ad" :autoplay="true" :interval="2000" :duration="500">
					<swiper-item v-for="(adv,index) in centerAdvList" :key="index">

						<image class="main-ad" @click="routerTo(adv.link)" :src="adv.full_path"></image>

					</swiper-item>

				</swiper>
			</view>
		</view>
		<!-- 推荐功能 -->
		<view class="home-recommend">
			<homeRecommend />
		</view>
		<!-- 版本 -->
		<!-- <view class="home-version">当前版本1.0.0</view> -->
	</view>
</template>

<script>
	import homeRecommend from '@/components/homeRecommend.vue'
	export default {
		data() {
			return {
				defaultAvatar: {},
				userInfo: {},
				centerAdvList: [],
				order:{
					all:0,
					waitPay:0,
					doing:0,
					waitPinJia:0,
					refound:0,
				}
			}
		},
		onLoad(option) {
			this.initUserCenter()
			this.getDefaultSetting()
		},
		onPullDownRefresh() {
			this.initUserCenter()
			uni.stopPullDownRefresh()
		},
		methods: {
			initUserCenter() {
				let _this = this
				let userJson = uni.getStorageSync(_this.cacheKey.userInfo)
				if (userJson) {
					_this.userInfo = JSON.parse(uni.getStorageSync(_this.cacheKey.userInfo))
				}
				_this.getAdv("center").then(res => {
		
					if (res && res.data && res.data.center) {
						_this.centerAdvList = res.data.center
					}

				})
			},

			getDefaultSetting() {
				let _this = this
				_this.get("/user/default-icon").then(res => {
					
					if(res.data){
					_this.defaultAvatar = res.data.avatar	
					}
					
				})
			},
			goPerson() {
				uni.navigateTo({
					url: '/pages/person/person'
				});
			},
			goSetup() {
				uni.navigateTo({
					url: '/pages/setup/setup'
				});
			},
			goOrder(num) {
				uni.navigateTo({
					url: '/pages/order/order?id=' + num
				});
			},
			goCoupon() {
				uni.navigateTo({
					url: '/pages/coupon/coupon'
				});
			},
			goIntegral() {
				uni.navigateTo({
					url: '/pages/integral/integral'
				});
			},
			goWallet() {
				uni.navigateTo({
					url: '/pages/wallet/wallet'
				});
			},
			goLogin() {
				uni.navigateTo({
					url: '/pages/login/login'
				});
			},
		},
		components: {
			homeRecommend
		}
	}
</script>

<style scoped>
	.home {
		width: 100%;
		min-height: 100%;
		padding-bottom: 120rpx;
		background: #F6F7FB;
	}

	/* 顶部 */
	.home-head {
		width: 100%;
		height: auto;
		background-image: linear-gradient(to right, #72E437, #1FC933);
		position: relative;
		margin-bottom: 100rpx;
	}

	.home-head-info {
		width: 100%;
		height: auto;
		padding: 16rpx 22rpx 74rpx;
		box-sizing: border-box;
	}

	.home-head-info-box {
		width: 100%;
		height: 110rpx;
		display: flex;
		justify-content: space-between;
	}

	.home-head-info-box-left {
		flex: 1;
		height: 100%;
		display: flex;
		justify-content: flex-start;
	}

	.home-head-info-box-left-image {
		width: 110rpx;
		height: 110rpx;
		border-radius: 55rpx;
		overflow: hidden;
		margin-right: 20rpx;
	}

	/* 广告 */
	.main-ad {
		width: 100%;
		height: 152rpx;
		padding-bottom: 10rpx;
		background: #FFFFFF;
	}

	.home-head-info-box-left-image image {
		width: 110rpx;
		height: 110rpx;
	}

	.acount-center {
		display: block;
		height: 55rpx;
		line-height: 55rpx;
	}

	.home-head-info-box-left-info {
		flex: 1;
		height: 110rpx;
		line-height: 110rpx;
		font-size: 30rpx;
		color: #FFFFFF;
		font-weight: 600;
	}

	.home-head-info-box-right {
		width: 50rpx;
		height: 100%;
		text-align: center;
		line-height: 110rpx;
		font-size: 50rpx;
		color: #FFFFFF;
	}

	.home-head-info-box-right text {
		color: #FFFFFF;
	}

	.home-head-pick {
		width: 704rpx;
		height: 130rpx;
		border-radius: 16rpx;
		background: #FFFFFF;
		position: absolute;
		left: 23rpx;
		bottom: -80rpx;
		padding: 26rpx 0 28rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		box-shadow: 0 0 2rpx #EEEEEE;
	}

	.home-head-pick .home-head-pick-lits:nth-last-child(1) {
		border-right-color: transparent;
	}

	.home-head-pick-lits {
		flex: 1;
		height: 76rpx;
		text-align: center;
		border-right: 1px solid #EEEEEE;
	}

	.home-head-pick-lits-number {
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 22rpx;
		font-weight: bold;
		color: #1A1B1E;
	}

	.home-head-pick-lits-name {
		width: 100%;
		height: 36rpx;
		font-size: 22rpx;
		font-weight: bold;
		color: #1A1B1E;
	}
	.home-order-top{
		border-top-right-radius: 20rpx;
		border-top-left-radius: 20rpx;
	}
	/* 订单 */
	.home-order {
		width: 100%;
		height: auto;
		padding: 0 24rpx;
		border-radius: 20rpx;
		box-sizing: border-box;
		margin-bottom: 22rpx;
	}

	.home-order-box {
		width: 100%;
		background: #FFFFFF;
		border-bottom-right-radius: 20rpx;
		border-bottom-left-radius: 20rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-around;
	}

	.home-order-box-list {
		flex: 1;
		padding-top: 43rpx;
		box-sizing: border-box;
		text-align: center;
		padding-bottom: 10rpx;
	}

	.home-order-box-list-icon {
		width: 100%;
		height: 45rpx;
		position: relative;
	}

	.home-order-box-list-icon-number {
		width: 35rpx;
		height: 35rpx;
		background: #FE0C40;
		display: inline-block;
		position: absolute;
		right: 40rpx;
		top: -15rpx;
		font-size: 18rpx;
		border-radius: 18rpx;
		text-align: center;
		line-height: 35rpx;
		color: #FFFFFF;
	}

	.home-order-box-list-icon-image {
		display: flex;
		justify-content: center;
	}

	.home-order-box-list-icon-image image {
		width: 45rpx;
		height: 45rpx;
	}

	/* .home-order-box-list-icon text{
	font-size: 45rpx; */
	/* font-weight: bold; */
	/* background-image: liner-gradient(to right, red, blue); 
	-webkit-background-clip: text; */
	/* 	color: #57E535;
} */
	.home-order-box-list-name {
		width: 100%;
		height: 72rpx;
		color: #07080C;
		font-weight: bold;
		font-size: 22rpx;
		line-height: 72rpx;
	}

	/* 轮播图 */
	.home-swipe {
		width: 100%;
		height: 154rpx;
		padding: 0 24rpx;
		box-sizing: border-box;
		margin-bottom: 22rpx;
	}

	.home-swipe-box {
		width: 100%;
		height: 154rpx;
		border-radius: 10rpx;
		background: #FFFFFF;
	}

	/* 功能推荐 */
	.home-recommend {
		width: 100%;
		/* height: 630rpx; */
		padding: 0 24rpx;
		box-sizing: border-box;
		margin-bottom: 20rpx;
	}

	/* 版本 */
	.home-version {
		width: 100%;
		height: 50rpx;
		text-align: center;
		line-height: 50rpx;
		font-size: 20rpx;
		color: #666666;
	}
</style>
