<template>
	<view class="classRightListBox">
		<view class="classRightListBox-left" @click="goShopping(goodsInfo)">
			<image :src="goodsInfo.main_image_url"></image>
		</view>
		<view class="classRightListBox-right">
			<view class="classRightListBox-right-name" @click="goShopping(goodsInfo)">{{goodsInfo.goods_name}}</view>
			<view v-if="goodsInfo.short_desc !== ''" class="classRightListBox-right-title">{{goodsInfo.short_desc}}</view>
			<view class="classRightListBox-right-lable">
				<text v-if="goodsInfo.self_sale !==''" class="classRightListBox-right-lable-list" style="color: #FC1AE8; border-color: #FC1AE8;">{{ goodsInfo.self_sale }}</text>
				<text v-for="(tag,index) in goodsInfo.tag_list" :key="index" class="classRightListBox-right-lable-list">{{ tag }}</text>
			</view>
			<view class="classRightListBox-right-prick">
				<view class="classRightListBox-right-prick-left" @click="goShopping(goodsInfo)">
					<view class="classRightListBox-right-prick-left-prick1">
						<text>¥</text>
						<text>{{goodsInfo.price}}</text>
					</view>
					<view v-if="parseFloat(goodsInfo.origin_price) > 0" class="classRightListBox-right-prick-left-prick2">
						<text>¥</text>
						<text>{{goodsInfo.origin_price}}</text>
					</view>
				</view>
				<view class="classRightListBox-right-prick-right">
					<text class="cuIcon-add" @click="addToMyCart(goodsInfo)"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['goodsInfo'],
		data() {
			return {

			};
		},
		methods: {
			goShopping(row) {

				uni.navigateTo({
					url: '/pages/shopping/shopping?goodsId=' + row.id
				});
				console.log('跳转')
			},
			addToMyCart(row) {
				
			},
		}
	}
</script>

<style>
	.classRightListBox {
		width: 100%;
		height: auto;
		padding: 20rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
	}

	.classRightListBox-left {
		width: 157rpx;
		height: 157rpx;
		border-radius: 5rpx;
		margin-right: 25rpx;

	}

	.classRightListBox-left image {
		width: 100%;
		height: 100%;
	}

	.classRightListBox-right {
		flex: 1;
		height: auto;
	}

	.classRightListBox-right-name {
		width: 100%;
		line-height: 50rpx;
		height: 50rpx;
		color: #000000;
		font-size: 26rpx;
		font-weight: 600;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	.classRightListBox-right-title {
		width: 100%;
		height: 35rpx;
		font-size: 22rpx;
		line-height: 35rpx;
		color: #858585;
	}

	.classRightListBox-right-lable {
		width: 100%;
		padding: 6rpx;
		height: auto;
	}

	.classRightListBox-right-lable-list {
		display: inline-block;
		height: 35rpx;
		border: 1px solid;
		border-radius: 8rpx;
		font-size: 20rpx;
		line-height: 32rpx;
		padding: 0 10rpx;
		box-sizing: border-box;
		margin-right: 10rpx;
		margin-bottom: 10rpx;
	}

	.classRightListBox-right-prick {
		width: 100%;
		height: 46rpx;
		display: flex;
		justify-content: space-between;
		padding-right: 15rpx;
		box-sizing: border-box;
	}

	.classRightListBox-right-prick-left {
		flex: 1;
		height: 100%;
		display: flex;
	}

	.classRightListBox-right-prick-left-prick1 {
		height: 100%;
		line-height: 46rpx;
		color: #FF3A86;
		margin-right: 10rpx;
	}

	.classRightListBox-right-prick-left-prick1 text:nth-child(1) {
		font-size: 16rpx;
	}

	.classRightListBox-right-prick-left-prick1 text:nth-child(2) {
		font-size: 26rpx;
		font-weight: bold;
	}

	.classRightListBox-right-prick-left-prick2 {
		height: 100%;
		line-height: 46rpx;
		color: #B6B6B6;
		font-size: 18rpx;
		text-decoration: line-through;
	}

	.classRightListBox-right-prick-right {
		width: 45rpx;
		height: 45rpx;
		background: #60DA62;
		border-radius: 5rpx;
		font-size: 40rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 45rpx;

	}
</style>
