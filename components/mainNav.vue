<template>
	<!-- 首页 主导航组件 -->
	<view class="mainNavBox">
		<view class="mainNavBox-list" v-for="(item,index) in navList" :key='index'>
			<view class="mainNavBox-list-img" @click="goCategory(item.id)">
				<image :src="item.full_url"></image>
			</view>
			<view class="mainNavBox-list-text" @click="goCategory(item.id)">
				{{item.name}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['navList'],
		data() {
			return {};
		},
		mounted() {

		},
		methods: {
			// 去搜索页
			goCategory(id) {

				uni.reLaunch({
					url: '/pages/class/class?category_id=' + id
				});
			},
			
		},
	}
</script>

<style>
	.mainNavBox {
		width: 100%;
		height: auto;
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
	}

	.mainNavBox-list {
		width: 140rpx;
		height: 168rpx;
		padding-top: 10rpx;
		box-sizing: border-box;
	}

	.mainNavBox-list-img {
		width: 100%;
		height: 108rpx;
		display: flex;
		justify-content: center;
	}

	.mainNavBox-list-img image {
		width: 108rpx;
		height: 108rpx;
	}

	.mainNavBox-list-text {
		width: 100%;
		height: 50rpx;
		padding-top: 12rpx;
		box-sizing: border-box;
		font-size: 22rpx;
		text-align: center;
		color: #030302;
		font-weight: 700;
	}
</style>
