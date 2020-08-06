<template>
	<view class="gender">
		<view class="gender-box">
			<view class="gender-box-list" @click="modify('男')">
				<view class="gender-box-list-left">
					男
				</view>
				<view class="gender-box-list-right">
					<text v-if="userInfo.gender==='男'" class="lg text-gray cuIcon-check"></text>
				</view>
			</view>
			<view class="gender-box-list" @click="modify('女')">
				<view class="gender-box-list-left">
					女
				</view>
				<view class="gender-box-list-right">
					<text v-if="userInfo.gender==='女'" class="lg text-gray cuIcon-check"></text>

				</view>
			</view>
			<view class="gender-box-list" @click="modify('保密')">
				<view class="gender-box-list-left">
					保密
				</view>
				<view class="gender-box-list-right">
					<text v-if="userInfo.gender==='保密'" class="lg text-gray cuIcon-check"></text>

				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {},
			}
		},
		onLoad() {
			this.initUserCenter()
		},
		methods: {
			modify(gender) {
				let _this = this
				_this.userInfo.gender = gender
				_this.post("/user/info", _this.userInfo).then(res => {
					uni.setStorageSync(_this.cacheKey.userInfo, JSON.stringify(_this.userInfo))
					_this.initUserCenter()
				})
			},
			initUserCenter() {
				let _this = this
				let userJson = uni.getStorageSync(_this.cacheKey.userInfo)
				if (userJson) {
					_this.userInfo = JSON.parse(uni.getStorageSync(_this.cacheKey.userInfo))
				}
			},
		}
	}
</script>

<style scoped>
	.gender {
		width: 100%;
		height: 100%;
	}

	.gender-box {
		width: 100%;
		padding-left: 24rpx;
		box-sizing: border-box;
		background: #FFFFFF;
	}

	.gender-box-list {
		width: 100%;
		border-bottom: 1rpx solid #F3F3F3;
		display: flex;
		justify-content: space-between;
		height: 95rpx;
		line-height: 95rpx;
	}

	.gender-box-list:nth-last-child(1) {
		border-bottom-color: #FFFFFF;
	}

	.gender-box-list-left {
		width: 280rpx;
		height: 100%;
		font-size: 30rpx;
		color: #000000;
	}

	.gender-box-list-right {
		flex: 1;
		height: 100%;
		padding-right: 30rpx;
		height: 95rpx;
		display: flex;
		justify-content: flex-end;

		color: #39D134;
	}

	.gender-box-list-right text {
		color: #39D134;
		font-size: 30rpx;
		font-weight: bolder;
	}
</style>
