<template>
	<view class="classBox">
		<view class="classBox-head">
			<view class="status_bar">
				<!-- 这里是状态栏 -->
			</view>
			<!-- 搜索 -->
			<view class="content-search-box" :style="scrollOff ? 'background: #ffffff;' : '' ">
				<view class="content-search-box-input" :style="scrollOff ? 'background: #f7f7f7;' : '' " @click="routerTo('/pages/search/search')">
					<text>{{ mainNavigation }}</text>
					<text class="lg text-gray cuIcon-search"></text>
				</view>
			</view>
		</view>
		<view class="classBox-swipe">
			<!-- 左侧 -->
			<view class="classBox-swipe-left">
				<scroll-view scroll-y class="classBox-swipe-left-scroll">
					<view class="classBox-swipe-left-box">
						<view class="classBox-swipe-left-box-list" @click="selectCategory(item,k)" v-for="(item,k) in category_list" :key='item.id'>
							<view v-if="current_index === k" class="classBox-swipe-left-box-list-li">
								{{item.name}}
							</view>
							<view v-else class="classBox-swipe-left-box-list-li-out">
								{{item.name}}
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<!-- 右侧 -->
			<view class="classBox-swipe-right">
				<view class="classBox-swipe-right-top">
					<view class="classBox-swipe-right-top-box">
						<scroll-view class="classBox-swipe-right-top-scroll" scroll-x>
							<view class="classBox-swipe-right-top-scroll-box">
								<view class="classBox-swipe-right-top-scroll-box-list" @click="selectChildCategory({},-1)">
									<view v-if="children_index === -1" class="right-slect">全部</view>
									<view v-else>全部</view>
								</view>
								<view v-if="current_children && current_children.length > 0" class="classBox-swipe-right-top-scroll-box-list"
								 v-for="(item,k) in current_children" :key='item.id' @click="selectChildCategory(item,k)">
									<view v-if="children_index === k" class="right-slect">{{item.name}}</view>
									<view v-else>{{item.name}}</view>
								</view>
							</view>
						</scroll-view>

					</view>

				</view>
				<view class="classBox-swipe-right-bottom">
					<!-- 弹出层 -->
					<!-- 					<view class="classBox-swipe-right-top-modal">
						<view class="classBox-swipe-right-top-modal-box">
							<view class="classBox-swipe-right-top-modal-box-list" v-for="item in category_list[current_index].children" :key='item.id'>{{item.name}}-11</view>
						</view>
					</view> -->
					<!-- 标题栏 -->
					<view class="classBox-swipe-right-bottom-name">
						<view class="classBox-swipe-right-bottom-name-left"></view>
						<view class="classBox-swipe-right-bottom-name-right">
							<view class="classBox-swipe-right-bottom-name-right-list">
								销量
							</view>
							<view class="classBox-swipe-right-bottom-name-right-list">
								价格
							</view>
							<view class="classBox-swipe-right-bottom-name-right-icon">
								<text class="lg text-gray cuIcon-top"></text>
							</view>
						</view>
					</view>
					<!-- 滑动区域 -->
					<scroll-view class="classBox-swipe-right-bottom--scroll" scroll-y @scrolltolower="scrollBottomEvent">
						<view class="classBox-swipe-right-bottom--scroll-box">
							<!-- <view class="classBox-swipe-right-bottom-scroll-box-title">推荐</view> -->

							<classRightList v-for="(goodsInfo,index) in goodsList" :key="index" :goodsInfo="goodsInfo" class='classBox-swipe-right-bottom--scroll-box-list' />

							<view class="classBox-swipe-right-bottom--scroll-box-foot">我是有底线的</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import classRightList from '@/components/classRightList.vue'
	export default {
		data() {
			return {
				category_id: 0,
				current_index: 0,
				children_index: -1,
				category_list: [],
				mainNavigation: '',
				current_children: [],
				scrollOff: false,
				goodsList: [],
				page: 1,
				total: 0,
			}
		},
		mounted() {

		},

		onLoad(option) {
			if (option.category_id) {
				this.category_id = parseInt(option.category_id)
			}
			this.getCateList()
		},
		methods: {
			scrollBottomEvent() {
				console.log(11)
			},
			selectChildCategory(row, index) {
				let _this = this
				_this.children_index = index
				_this.getGoodsList()
			},
			goShopping() {
				uni.navigateTo({
					url: 'pages/shopping/shopping'
				});
				console.log('跳转')
			},
			selectCategory(row, index) {
				let _this = this
				_this.current_index = index
				_this.category_id = _this.category_list[index].id
				_this.current_children = _this.category_list[index].children
				_this.children_index = -1
				_this.getGoodsList()
			},
			getCateList() {
				let _this = this
				_this.get('/category/list', {
					time: _this.now()
				}).then(response => {
					_this.category_list = response.data.category_list
					_this.current_children = _this.category_list[_this.current_index].children

					if (_this.category_id > 0) {

						for (let i = 0; i < _this.category_list.length; i++) {
							if (_this.category_id === _this.category_list[i].id) {
								_this.selectCategory(_this.category_list[i], i)
								break
							}
						}
					}
					_this.getGoodsList()
				})
			},
			//
			getGoodsList() {
				let _this = this
				let param = {
					goods_name: '',
					child_id: 0,
					cate_id:_this.category_list[_this.current_index].id,
				}
				let child_id = 0;
				if (_this.current_children[_this.children_index]) {
					param.child_id = _this.current_children[_this.children_index].id
				}
				_this.post('/goods/list', param).then(response => {
					console.log(response.data.data)
					_this.goodsList = response.data.data
					_this.total = response.data.total
				})
			},
		},

		components: {
			classRightList
		}
	}
</script>

<style scoped>
	.classBox {
		width: 100%;
		height: 100%;
		background: #FFFFFF;
	}

	/* 搜索 */
	.content-search-box {
		width: 100%;
		height: 82rpx;
		padding: 10rpx 23rpx;
		box-sizing: border-box;
		background: #FFFFFF;
	}

	.content-search-box-input {
		width: 100%;
		height: 100%;
		background: #f7f7f7;
		border-radius: 15rpx;
		font-size: 28rpx;
		color: #898989;
		text-align: center;
		line-height: 62rpx;
	}

	.content-search-box-input text:nth-child(1) {
		margin-right: 8rpx;
		color: #9A9E9D;
		font-size: 26rpx;
	}

	/* 导航 */
	.classBox-swipe {
		width: 100%;
		height: calc(100% - 82rpx - var(--status-bar-height));
		display: flex;
		justify-content: space-between;
	}

	/* 左侧 */
	.classBox-swipe-left {
		width: 175rpx;
		height: 100%;
		background: #F8F8F8;
	}

	.classBox-swipe-left-box {
		width: 100%;
	}

	.classBox-swipe-left-scroll {
		width: 100%;
		height: 100%;
	}

	.classBox-swipe-left-box-list {
		width: 100%;
		height: 110rpx;
		padding: 26rpx 0;
		box-sizing: border-box;
	}

	.classBox-swipe-left-box-list-li {
		width: 100%;
		height: 100%;
		border-left: 6rpx solid;

		box-sizing: border-box;
		border-left-color: #34BF5C;
		font-size: 24rpx;
		text-align: center;
		line-height: 54rpx;
		color: #34BF5C;
	}

	.classBox-swipe-left-box-list-li-out {
		width: 100%;
		height: 100%;
		border-left: 6rpx solid;

		box-sizing: border-box;
		border-left-color: #F8F8F8;
		font-size: 24rpx;
		text-align: center;
		line-height: 54rpx;
		color: #2F2F2F;
	}

	.right-slect {
		color: #34BF5C;
	}

	/* 右侧 */
	.classBox-swipe-right {
		width: 575rpx;
		height: 100%;

		box-sizing: border-box;
	}

	/* 右侧顶部 */
	.classBox-swipe-right-top {
		width: 100%;
		height: 76rpx;
		padding: 12rpx 0 12rpx 20rpx;
		box-sizing: border-box;
		border-bottom: 1px solid #EFEFEF;
		position: relative;
	}

	.classBox-swipe-right-top-box {
		width: 100%;
		height: 100%;
		position: relative;

	}

	.classBox-swipe-right-top-scroll {
		width: calc(100% - 40rpx);
		height: 100%;
		/* padding-right: 40rpx; */
		box-sizing: border-box;
	}

	.classBox-swipe-right-top-scroll-box {
		display: flex;
		justify-content: flex-start;
		flex-wrap: nowrap;
		white-space: nowrap;
		width: auto;
		height: 100%;
	}

	.classBox-swipe-right-top-scroll-box-list {
		/* width: 170rpx; */
		height: 100%;
		background: #F2F2F2;
		color: #4D4D4D;
		margin-right: 15rpx;
		border-radius: 8rpx;
		font-size: 22rpx;
		text-align: center;
		line-height: 52rpx;
		display: block !important;
		padding: 0 64rpx;
		box-sizing: border-box;
	}

	/* 向下箭头 */
	.classBox-swipe-right-top-right {
		width: 100rpx;
		height: 52rpx;
		position: absolute;
		right: 0;
		top: 0;
		background-image: linear-gradient(to right, transparent, #ffffff, #ffffff, #ffffff);
		text-align: right;
		padding-right: 30rpx;
		box-sizing: border-box;
		line-height: 52rpx;
	}

	.classBox-swipe-right-top-right text {
		color: #8B8B8B;
	}

	/* 滑动区域 */
	.classBox-swipe-right-bottom {
		width: 100%;
		height: calc(100% - 76rpx);
		position: relative;
	}

	/* 弹出层 */
	.classBox-swipe-right-top-modal {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0rpx;
		box-sizing: border-box;
		background: rgba(199, 196, 196, 0.5);
		display: none;
	}

	.classBox-swipe-right-top-modal-box {
		width: 100%;
		height: auto;
		padding: 20rpx;
		box-sizing: border-box;
		background: #FFFFFF;
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
	}

	.classBox-swipe-right-top-modal-box-list {
		width: 160rpx;
		height: 64rpx;
		color: #5B5B5B;
		background: #F2F2F2;
		font-size: 22rpx;
		text-align: center;
		line-height: 64rpx;
		border-radius: 7rpx;
		margin-right: 15rpx;
		margin-bottom: 15rpx;
	}

	/* 标题 */
	.classBox-swipe-right-bottom-name {
		width: 100%;
		height: 77rpx;
		border-bottom: 1px solid #EFEFEF;
		box-sizing: border-box;
		padding: 0 20rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
	}

	.classBox-swipe-right-bottom-name-left {
		width: 200rpx;
		height: 76rpx;
		line-height: 76rpx;
		font-size: 22rpx;
		color: #515151;
	}

	.classBox-swipe-right-bottom-name-right {
		height: 100%;
		display: flex;
		justify-content: flex-end;
	}

	.classBox-swipe-right-bottom-name-right-list {
		height: 100%;
		width: 70rpx;
		text-align: center;
		line-height: 70rpx;
		font-size: 22rpx;
	}

	.classBox-swipe-right-bottom-name-right-icon {
		width: 40rpx;
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;
	}

	.classBox-swipe-right-bottom-name-right-icon text {
		color: #8C8C8C;
	}

	/* 右侧滑块区域 */
	.classBox-swipe-right-bottom--scroll {
		width: 100%;
		height: calc(100% - 77rpx);
		padding-left: 20rpx;
		box-sizing: border-box;
	}

	.classBox-swipe-right-bottom--scroll-box {
		width: 100%;
		height: auto;
	}

	.classBox-swipe-right-bottom--scroll-box-title {
		width: 100%;
		height: 76rpx;
		font-size: 22rpx;
		color: #515151;
		line-height: 76rpx;
		border-bottom: 1px solid #EEEEEE;
		box-sizing: border-box
	}

	.classBox-swipe-right-bottom--scroll-box-list {
		border-bottom: 1px solid #EEEEEE;
	}

	.classBox-swipe-right-bottom--scroll-box-foot {
		width: 100%;
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;
		color: #999999;
		font-size: 24rpx;
	}
</style>
