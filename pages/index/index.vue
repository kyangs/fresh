<template>
	<view class="content">
		<!-- 顶部搜索区域 -->
		<view class="content-search" :class="scrollOff ? 'content-search-active' : '' ">
			<view class="status_bar" :style="scrollOff ? 'color: #585858' : '' ">
				<!-- 这里是状态栏 -->
			</view>
			<!-- 定位和消息 -->
			<view class="content-search-gps" :class="scrollOff ? 'content-search-gps-blue' : 'content-search-gps-focul' ">
				<view class="content-search-gps-left" v-show="!scrollOff">
					<text class="content-search-gps-text">{{current_location}}</text>
					<text class="lg text-gray cuIcon-right content-search-gps-icon"></text>
				</view>
				<view class="content-search-gps-right" v-show="!scrollOff">
					<text class="lg text-gray cuIcon-notice content-search-gps-right-icon"></text>
				</view>
			</view>
			<!-- 搜索 -->
			<view class="content-search-box" :style="scrollOff ? 'background: #ffffff;' : '' ">
				<view class="content-search-box-input" :style="scrollOff ? 'background: #f7f7f7;' : '' " @click="goSearch">
					<text>{{ mainNavigation }}</text>
					<text class="lg text-gray cuIcon-search"></text>
				</view>
			</view>
		</view>
		<!-- 主内容区域 -->
		<view class="main">
			<!-- 绝对定位 title -->
			<view class="main-title">
				<view class="main-title-list">
					<text class="lg text-gray cuIcon-squarecheck"></text>
					<text>正品保障</text>
				</view>
				<view class="main-title-list">
					<text class="lg text-gray cuIcon-present"></text>
					<text>一件包邮</text>
				</view>
				<view class="main-title-list">
					<text class="lg text-gray cuIcon-deliver"></text>
					<text>全国配送</text>
				</view>
				<view class="main-title-list">
					<text class="lg text-gray cuIcon-service"></text>
					<text>售后无忧</text>
				</view>
			</view>
			<!-- 轮播图 -->
			<view class="main-swipe">
				<swiper class="screen-swiper square-dot" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000"
				 duration="500">
					<swiper-item v-for="(item,index) in swiperList" @click="routerTo(item.link)" :key="index">
						<image :src="item.full_path" mode="aspectFill">

						</image>
					</swiper-item>
				</swiper>
			</view>
			<!-- 公告 -->
			<view class="main-announcement">
				<view class="main-announcement-box">
					<view class="main-announcement-box-left">
						<swiper class="main-announcement-box-left-box" :autoplay="true" :interval="5000" :circular='true' :vertical='true'
						 :disable-touch='true'>
							<swiper-item v-for="(v) in notice_list" :key="v.id">
								<view @click="routerTo('/pages/notice/detail?id='+v.id)" class="main-announcement-box-left-box-list">
									<text>{{ v.tag }}</text>
									<text>{{ v.title }}</text>
								</view>
							</swiper-item>
						</swiper>
					</view>
					<view class="main-announcement-box-right">
						<text class="lg text-gray cuIcon-right main-announcement-box-right-icon"></text>
					</view>
				</view>
			</view>
			<!-- 广告 -->
			<view v-if="advPosition.home_notice.full_path" class="main-ad">
				<image class="main-ad-img" @click="routerTo(advPosition.home_notice.link)" :src="advPosition.home_notice.full_path"></image>
			</view>
			<!-- 主导航 -->
			<view class="main-nav">
				<main-nav :navList="navList"></main-nav>
			</view>
			<!-- 秒杀 -->
			<view class="main-spike">
				<mainSpike />
			</view>
			<!-- 特色专区 -->
			<view class="main-features">
				<mainFeatures />
			</view>
			<!-- 导购条 -->
			<view class="main-navigation-box" :class="mainNavigationOff ? 'main-navigation-box-flex' : '' ">
				<mainNavigation :mainNavigationOff='mainNavigationOff' />
			</view>
			<!-- 内容区域 -->
			<view class="main-centent">
				<mainCentent />
			</view>
		</view>
	</view>
</template>

<script>
	import mainNav from '@/components/mainNav.vue'
	import mainFeatures from '@/components/mainFeatures.vue'
	import mainNavigation from '@/components/mainNavigation.vue'
	import mainCentent from '@/components/mainCentent.vue'
	import mainSpike from '@/components/mainSpike.vue'
	import amap from '@/components/amap-wx.js'
	export default {
		data() {
			return {
				title: 'Hello',
				swiperList: [],
				navList: [],
				notice_list: [],
				advPosition: {
					home_notice: {
						full_path: ''
					},
				},
				scrollOff: false,
				mainNavigationOff: true, // 导购条距离顶部的距离
				mainNavigation: '',
				navigation: 0,
				search: 0,
				status: 0,
				centent: 0,
				nanFlex: null,
				current_location: ''
			}
		},
		onLoad() {
			this.location()
		},
		created() {
			this.home()
		},
		mounted() {
			let _this = this
		},
		// 页面滚动事件
		onPageScroll(data) {

			if (data.scrollTop > 10) {
				this.scrollOff = true
			} else {
				this.scrollOff = false
			}

			//#ifndef APP-PLUS
			this.$nextTick(function() {
				// console.log('除了APP')
				this.infoNavigation()
			})
			//#endif
		},
		// 页面触底事件
		onReachBottom() {
			console.log('触底了')
		},
		methods: {
			location() {
				let _this = this


				uni.getLocation({
					type: 'wgs84',
					success: function(res) {
						_this.post("/location/location", {
							latitude: res.latitude,
							longitude: res.longitude,
						}).then(response => {

							console.log(response)
							if (response.data.location) {
								uni.setStorageSync('current_location', JSON.stringify(response.data.location))
								let pois = response.data.location.pois
								if (pois && pois.length > 0) {
									_this.current_location = pois[0].name
								}

							}
						})
					},
					fail: (res) => {
						uni.showToast({
							title: "地址信息获取失败请打开获取位置权限"
						})
					}
				})
			},
			home() {
				let _this = this
				let param = {}

				_this.post("/home/index", param).then(response => {
				
					if (response.data.adv_list.home) {
						_this.swiperList = response.data.adv_list.home
					}

					if (response.data.adv_list.home_notice) {
						_this.advPosition.home_notice = response.data.adv_list.home_notice[0]
					}
					_this.navList = response.data.category_list
					_this.notice_list = response.data.notice_list
				})
			},
			// 获取导航条距离顶部的相对高度
			infoNavigation() {
				let navigation = 0
				let search = 0
				let status = 0
				let centent = 0
				let _this = this

				const querytop = uni.createSelectorQuery().in(this);
				querytop.select('.content-search-box').boundingClientRect(data => {
					_this.search = data.height
					// console.log( _this.search)
				}).exec();


				const querystatus = uni.createSelectorQuery().in(this);
				querystatus.select('.status_bar').boundingClientRect(data => {
					_this.status = data.height
				}).exec();

				const querynavigation = uni.createSelectorQuery().in(this);
				querynavigation.select('.main-navigation-box').boundingClientRect(data => {



					_this.navigation = data.height
				}).exec();


				const queryLS = uni.createSelectorQuery().in(this);
				queryLS.select('.main-centent').boundingClientRect(data => {



					_this.centent = data.top
					let mainNavigation = (_this.centent - _this.search - _this.status - _this.navigation)

					// this.mainNavigation = _this.centent+'_'+_this.search+'_'+_this.status+'_'+_this.navigation
					if (mainNavigation > 0) {
						_this.mainNavigationOff = false
					} else {
						_this.mainNavigationOff = true
					}


				}).exec();


			},
			// 去搜索页
			goSearch() {
				uni.navigateTo({
					url: '/pages/search/search'
				});
			},


		},
		mounted() {
			this.$nextTick(function() {
				this.infoNavigation()
			})
		},
		onShow() {
			//#ifdef APP-PLUS
			// console.log('仅在APP')
			clearInterval(this.nanFlex)
			let This = this
			this.nanFlex = setInterval(function() {
				This.infoNavigation()
			}, 200)
			//#endif
		},
		onHide() {
			//#ifdef APP-PLUS
			clearInterval(this.nanFlex)
			//#endif
		},
		components: {
			mainNav,
			mainFeatures,
			mainNavigation,
			mainCentent,
			mainSpike
		}
	}
</script>

<style scoped>
	.content {
		width: 750rpx;
		min-height: 100%;
		position: relative;
	}

	/* 顶部搜索区域 */
	/* 
	向上滑动透明色变白色, 可以采用控制透明度的方式
	定位和消息栏 消失,可以采用 transition 的方式
	 */
	.content-search {
		width: 100%;
		height: auto;
		position: fixed;
		z-index: 10;
		transition: all 0.5s;
	}

	.content-search-active {
		background: #FFFFFF;
	}

	.content-search-gps {
		width: 100%;
		/* height: 52rpx; */
		padding: 0 23rpx;
		box-sizing: border-box;
		font-size: 26rpx;
		line-height: 52rpx;
		padding-right: 10rpx;
		box-sizing: border-box;
		color: #FFFFFF;
		display: flex;
		justify-content: space-between;
		transition: all 0.3s;
	}

	.content-search-gps-blue {
		height: 0;
	}

	.content-search-gps-focul {
		height: 52rpx;
	}

	.content-search-gps-text {
		margin-right: 10rpx;
	}

	.content-search-gps-icon {
		color: #FFFFFF;
		font-size: 26rpx;
	}

	.content-search-gps-right-icon {
		color: #FFFFFF;
		font-size: 36rpx;
	}

	.content-search-box {
		width: 100%;
		height: 82rpx;
		padding: 10rpx 23rpx;
		box-sizing: border-box;
	}

	.content-search-box-input {
		width: 100%;
		height: 100%;
		background: #FFFFFF;
		border-radius: 15rpx;
		font-size: 28rpx;
		color: #898989;
		text-align: center;
		line-height: 62rpx;
	}

	.content-search-box-input-active {
		background: #f7f7f7;
	}

	.content-search-box-input text:nth-child(1) {
		margin-right: 8rpx;
		color: #9A9E9D;
		font-size: 26rpx;
	}

	/* 主内容区域 */
	.main {
		width: 100%;
		height: auto;
		position: relative;
	}

	/* title */
	.main-title {
		width: 100%;
		height: 62rpx;
		line-height: 62rpx;
		padding: 0 38rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		color: #FFFFFF;
		font-size: 22rpx;
		position: absolute;
		left: 0;
		top: calc(134rpx + var(--status-bar-height));
		z-index: 1;
	}

	.main-title-list {
		display: flex;
		justify-content: flex-start;
	}

	.main-title-list text:nth-child(1) {
		margin-right: 10rpx;
		color: #FFFFFF;
		font-size: 28rpx;
	}

	/* 轮播图 */
	.main-swipe {
		width: 100%;
		height: 486rpx;
	}

	.main-swipe image {
		width: 100%;
		height: 486rpx;
	}

	.square-dot {
		height: 486rpx;
	}

	/* 公告 */
	.main-announcement {
		width: 100%;
		height: auto;
		padding: 23rpx 20rpx;
		box-sizing: border-box;
		background: #FFFFFF;
	}

	.main-announcement-box {
		width: 100%;
		height: 62rpx;
		background: #FEF8E2;
		border-radius: 10rpx;
		padding: 0 23rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
	}

	.main-announcement-box-left {
		flex: 1;
		height: 62rpx;
		padding: 10rpx 0rpx;
		box-sizing: border-box;
		overflow: hidden;
	}

	.main-announcement-box-right {
		width: 62rpx;
		height: 62rpx;
	}

	.main-announcement-box-left-box {
		width: 100%;
		height: 42rpx;
	}

	.main-announcement-box-left-box-list {
		width: 100%;
		height: 42rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		padding: 5rpx 5rpx;
		box-sizing: border-box;
	}

	.main-announcement-box-left-box-list text {
		display: inline-block;
	}

	.main-announcement-box-left-box-list text:nth-child(1) {
		height: 32rpx;
		padding: 0rpx 15rpx;
		box-sizing: border-box;
		background-image: linear-gradient(to right, #F78A48, #E84947);
		font-size: 16rpx;
		color: #FFFFFF;
		line-height: 32rpx;
		margin-right: 15rpx;
		border-radius: 8rpx;
		transform: skew(-20deg);
	}

	.main-announcement-box-left-box-list text:nth-child(2) {
		height: 32rpx;
		box-sizing: border-box;
		font-size: 24rpx;
		color: #845931;
		line-height: 32rpx;
	}

	.main-announcement-box-right-icon {
		width: 62rpx;
		height: 62rpx;
		text-align: center;
		line-height: 62rpx;
		color: #CDA981;
	}

	/* 广告 */
	.main-ad {
		width: 100%;
		height: auto;
		padding-bottom: 10rpx;
		background: #FFFFFF;
	}

	.main-ad image {
		width: 100%;
		height: 220rpx;
	}

	/* 主导航 */
	.main-nav {
		width: 100%;
		height: auto;
		background: #FFFFFF;
		padding: 0rpx 23rpx 0;
		box-sizing: border-box;
		/* margin-bottom: 26rpx; */
	}

	/* 秒杀 */
	.main-spike {
		width: 100%;
		height: auto;
		margin-bottom: 26rpx;
		background: #FFFFFF;
	}

	/* 特色专区 */
	.main-features {
		width: 100%;
		height: auto;
		/* padding: 10rpx 30rpx; */
		box-sizing: border-box;
		margin-bottom: 26rpx;
	}

	/* 滑块 */
	.main-centent {
		width: 100%;
		/* height: 400rpx; */
		/* height: 500rpx; */
		/* height: 200rpx; */
	}

	/* 导航条 */
	.main-navigation-box {
		width: 100%;
		z-index: 12;
	}

	.main-navigation-box-flex {
		position: fixed;
		left: 0;
		top: calc(82rpx + var(--status-bar-height));
	}
</style>
