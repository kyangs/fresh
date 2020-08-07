<template>
	<view class="nickname">
		<view class="nickname-title">
			请输入新昵称
		</view>
		<view class="nickname-message">
			 <input class="nickname-message-input" maxlength="15"
			  placeholder="最大输入长度为15个字符" v-model="userInfo.nickname" />
		</view>
		<view class="padding flex flex-direction">
			<button @click="modifyNickName" class="cu-btn bg-green margin-tb-sm lg">确认修改</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo:{},
			}
		},
		onLoad() {
			this.initUserCenter()
		},
		methods: {
			modifyNickName(){
				let _this = this
				_this.post("/user/info",_this.userInfo).then(res=>{
					uni.setStorageSync(_this.cacheKey.userInfo,JSON.stringify(_this.userInfo))
					_this.initUserCenter()
					uni.showToast({
						icon:"none",
						title:"修改成功",
					})
					setTimeout(function() {
						_this.routerTo('/pages/person/person')
					}, 1500);
				})
			},
			initUserCenter() {
				let _this = this
				let userJson = uni.getStorageSync(_this.cacheKey.userInfo)
				if (userJson){
					_this.userInfo = JSON.parse(uni.getStorageSync(_this.cacheKey.userInfo))
				}
			},
		}
	}
</script>

<style scoped>
.nickname{
	width: 100%;
	height: 100%;
}
.nickname-title{
	width: 100%;
	height: 70rpx;
	padding: 0 24rpx;
	box-sizing: border-box;
	line-height: 70rpx;
	font-size: 22rpx;
	color: #666666;
}
.nickname-message{
	width: 100%;
	height: 90rpx;
	background: #FFFFFF;
	padding: 0 24rpx;
	box-sizing: border-box;
}
.nickname-message-input{
	width: 100%;
	height: 90rpx;
	font-size: 26rpx;
	line-height: 90rpx;
}
.nickname-message-input:-ms-input-placeholder{
	font-size: 26rpx;
}
</style>
