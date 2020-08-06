<template>
	<view class="person">
		<view class="person-box">
			<view class="person-box-list person-image" @click="goImage">
				<view class="person-box-list-left">
					头像
				</view>
				<view class="person-box-list-right person-image-box">
					<image v-if="userInfo.full_avatar" :src="userInfo.full_avatar"></image>
					<image v-else :src="defaultAvatar.avatar"></image>
				</view>
			</view>
			<view class="person-box-list" @click="goNickname">
				<view class="person-box-list-left">
					昵称
				</view>
				<view class="person-box-list-right">
					<text>{{userInfo.nickname}}</text>
					<text class="lg text-gray cuIcon-right"></text>
				</view>
			</view>
			<view class="person-box-list" @click="goGender">
				<view class="person-box-list-left">
					性别
				</view>
				<view class="person-box-list-right">
					<text>{{userInfo.gender}}</text>
					<text class="lg text-gray cuIcon-right"></text>
				</view>
			</view>
			<view class="person-box-list" @click="timeShow = true">
				<view class="person-box-list-left">
					生日
				</view>
				<view class="person-box-list-right">
					<text>{{userInfo.birth}}</text>
					<text class="lg text-gray cuIcon-right"></text>
				</view>
			</view>
			<view class="person-box-list" @click="goPhone">
				<view class="person-box-list-left">
					手机号
				</view>
				<view class="person-box-list-right">
					<text>{{userInfo.phone}}</text>
					<text class="lg text-gray cuIcon-right"></text>
				</view>
			</view>

		</view>
		<!-- 时间选择器 -->
		<u-picker v-model="timeShow" mode="time" @confirm='selectTime'></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timeShow: false,
				userInfo: {},
				defaultAvatar: {},
			}
		},
		onLoad() {
			this.initUserCenter()
			this.getDefaultSetting()
		},
		methods: {
			initUserCenter() {
				let _this = this
				let userJson = uni.getStorageSync(_this.cacheKey.userInfo)
				if (userJson) {
					_this.userInfo = JSON.parse(uni.getStorageSync(_this.cacheKey.userInfo))
				}
			},
			getDefaultSetting() {
				let _this = this
				_this.get("/user/default-icon").then(res => {
					console.log(res.data)
					_this.defaultAvatar = res.data.avatar
				})
			},
			// 选择生日时间
			selectTime(time) {
				let _this = this
				_this.userInfo.birth = time.year+'-'+time.month+'-'+time.day
				_this.post("/user/info",_this.userInfo).then(res=>{
					uni.setStorageSync(_this.cacheKey.userInfo,JSON.stringify(_this.userInfo))
					_this.initUserCenter()
				})
			},
			// 去修该昵称
			goNickname() {
				uni.navigateTo({
					url: '/pages/nickname/nickname'
				});
			},
			// 去修该手机号
			goPhone() {
				uni.navigateTo({
					url: '/pages/phone/phone'
				});
			},
			// 去修该性别
			goGender() {
				uni.navigateTo({
					url: '/pages/gender/gender'
				});
			},
			// 去修该头像
			goImage() {
				let _this = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: function(res) {
						const tempFilePaths = res.tempFilePaths
						uni.uploadFile({
							url: _this.url + "/user/info", //仅为示例，非真实的接口地址
							filePath: tempFilePaths[0],
							name: 'file',
							formData: _this.userInfo,
							success: (uploadRes) => {
								let userInfo = JSON.parse(uploadRes.data)
								console.log(userInfo)
								uni.setStorageSync(_this.cacheKey.userInfo,JSON.stringify(userInfo.data))
								_this.initUserCenter()
							}
						});

					}
				});
			}
		}
	}
</script>

<style scoped>
	.person {
		width: 100%;
		height: 100%;
		padding-top: 20rpx;
		box-sizing: border-box;
		background: #F5F5F5;
	}

	.person-box {
		background: #FFFFFF;
		padding-left: 30rpx;
		box-sizing: border-box;
	}

	.person-box-list {
		width: 100%;
		border-bottom: 1rpx solid #F3F3F3;
		display: flex;
		justify-content: space-between;
		height: 95rpx;
		line-height: 95rpx;
	}

	.person-box-list:nth-last-child(1) {
		border-bottom-color: #FFFFFF;
	}

	.person-box-list-left {
		width: 280rpx;
		height: 100%;
		font-size: 30rpx;
		color: #000000;
	}

	.person-box-list-right {
		flex: 1;
		height: 100%;
		padding-right: 30rpx;
		height: 95rpx;
		display: flex;
		justify-content: flex-end;
	}

	.person-box-list-right text:nth-child(1) {
		color: #646464;
		font-size: 22rpx;
	}

	.person-box-list-right text:nth-child(2) {
		color: #BFBFBF;
		font-size: 28rpx;
		margin-left: 10rpx;
	}

	.person-image {
		height: 126rpx;
		line-height: 126rpx;
	}

	.person-image-box {
		padding-top: 15rpx;
		box-sizing: border-box;
	}

	.person-image-box image {
		width: 96rpx;
		height: 96rpx;
		border-radius: 48rpx;
		overflow: hidden;
	}
</style>
