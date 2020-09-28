<template>
	<view class="char">
		<view class="status_bar" style="background: #FFFFFF;">
			<!-- 这里是状态栏 -->
		</view>
		<!-- 顶部标题 -->
		<view class="char-head">
			<view class="char-head-left">
				购物车
			</view>
	
		</view>

		<!-- 可滑动区域  购物车为空: char-scroll-activeoff   购物车已满 char-scroll-activeon-->
		<view class="char-scroll char-scroll-activeon">
			<scroll-view class="char-scroll-check" scroll-y="true">
				<view class="char-scroll-empty" v-if="cartList.length === 0">
					<view class="char-scroll-empty-image">
						<image src="/static/image/char/empty.png"></image>
					</view>

					<text>购物车空空如也</text>
				</view>

				<u-swipe-action v-for="(item,k) in cartList" @click="clickCartItem" :index="k" :key="k" :options="options">
					<view class="charList">

						<view class="charList-left">
							<u-checkbox-group active-color="red" @change="checkCartItem(item)">
								<u-checkbox v-model="item.checked" size="40" shape="circle"></u-checkbox>
							</u-checkbox-group>
						</view>
						<view class="charList-image" @click="routerTo('/pages/shopping/shopping?goodsId='+item.goods.id)">
							<image :src="item.goods.main_image_url"></image>
						</view>
						<view class="charList-right">
							<view class="charList-right-name" @click="routerTo('/pages/shopping/shopping?goodsId='+item.goods.id)">
								<text class="charList-right-name-lable">{{item.goods.self_sale}}</text>
								<text class="charList-right-name-text">{{item.goods.goods_name}}</text>
							</view>
							<view class="charList-right-title">
								{{item.goods.short_desc}}
							</view>
							<view class="charList-right-prick">
								<view class="charList-right-prick-left">
									<text class="charList-right-prick-left-text1">¥</text>
									<text class="charList-right-prick-left-text2">{{item.goods.price}}</text>
									<!-- <text class="charList-right-prick-left-text3">/箱</text> -->
									<text class="charList-right-prick-left-text4">¥ {{item.goods.origin_price}}</text>
								</view>
								<view class="charList-right-prick-right">
									<u-number-box :value="parseInt(item.goods_number)" @change="valChange" :index="k" :min="1" :max="9999"></u-number-box>
								</view>
							</view>
						</view>

					</view>
				</u-swipe-action>
				<!-- 猜你喜欢 -->
				<!-- <view class="shopping-similar">
				
					<view class="shopping-similar-box">
						<view class="shopping-similar-box-list">
							<view class="shopping-similar-box-list-image">
								
							</view>
							<view class="shopping-similar-box-list-name">
								商品名称
							</view>
							<view class="shopping-similar-box-list-table">
								标签
							</view>
							<view class="classRightListBox-right-prick">
								<view class="classRightListBox-right-prick-left">
									<view class="classRightListBox-right-prick-left-prick1">
										<text>¥</text>
										<text>19.9</text>
									</view>
									<view class="classRightListBox-right-prick-left-prick2">
										<text>¥</text>
										<text>19.9</text>
									</view>
								</view>
								<view class="classRightListBox-right-prick-right">
									<text class="cuIcon-add"></text>
								</view>
							</view>
						</view>
					</view>
				</view> -->
			</scroll-view>
		</view>
		<!-- 操作条 -->
		<view class="char-operating">
			<!-- 温馨提示 -->
<!-- 			<view class="char-operating-top">
				<view class="char-operating-top-left">
					<text class="char-operating-top-left-tit">已经满25减5,再买10.23元,可享受</text>
				</view>
				<view class="char-operating-top-right">
					<text>去凑单</text>
					<text class="lg text-gray cuIcon-right"></text>
				</view>
			</view> -->
			<!-- 结算操作条 -->
			<view class="char-operating-bottom">
				<view class="char-operating-bottom-left">
					<u-checkbox-group active-color="red"  @change="checkAll">
						<u-checkbox v-model="checkAllItem" size="40" shape="circle">全选</u-checkbox>
					</u-checkbox-group>
					
				</view>
				<view class="char-operating-bottom-right">
					<view class="char-operating-bottom-right-left">
						<view class="char-operating-bottom-right-left-top">
							<text>合计:</text>
							<text>{{orderAmount}}</text>
						</view>
						<view class="char-operating-bottom-right-left-bottom">
							<text>免基础配送费</text>
							<text>基础配送费10元</text>
						</view>
					</view>
					<view class="char-operating-bottom-right-right" @click="submitorder">
						去结算
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import charList from '@/components/charList.vue'
	export default {
		data() {
			return {
				checkAllItem: false,
				cartList: [],
				orderAmount: 0,
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}]
			}
		},
		onLoad() {

			if (this.isLogin()) {
				this.getCartList()
				return
			} else {
				uni.showToast({
					title: "请先登录再来查看吧",
					icon: "none"
				})
			}

		},
		onPullDownRefresh() {
			this.getCartList()
			uni.stopPullDownRefresh()
		},
		methods: {
			clickCartItem(index, index1) {
				let _this = this

				_this.del("/cart/item", _this.cartList[index]).then(res => {
					if(res.code === 10000){
						_this.cartList.splice(index, 1);
						uni.showToast({
							title:"删除成功",
							icon:"none",
						})
						_this.calCartPrice()
						return
					}
					
					uni.showToast({
						title:"删除失败",
						icon:"none",
					})
				})

			},
			checkCartItem(row){
				let _this = this
				let checkAllItem = true
				_this.cartList.forEach(s=>{
					if(s.checked === false){
						checkAllItem = false
					}
				})
				_this.checkAllItem = checkAllItem
				_this.calCartPrice()
			},
			getCartList() {
				let _this = this
				this.post("/cart/list", {
					user_id: _this.currentUser.id
				}).then(res => {
					if (res.data && res.data.length) {
						_this.cartList = res.data
						return
					}
				})
			},
			calCartPrice(){
				let _this = this
				let cartList = []
				
				_this.cartList.forEach(r=>{
					if(r.checked){
						cartList.push(r)
					}
				})
				if(cartList.length === 0) {
					_this.orderAmount = 0.00
				}
				
				_this.post("/cart/price", {
					cart_list: cartList
				}).then(res => {
					if (res.code === 10000) {
						_this.orderAmount = res.data.orderAmount
						return
					}
					uni.showToast({
						title:"请求出错",
						icon:"none"
					})
				})
			},
			checkAll(event){
				let _this = this
				_this.cartList.forEach(s=>{
					s.checked = _this.checkAllItem
				})
				_this.calCartPrice()
			},
			valChange(e) {
				console.log(e.index,e.value)
				let _this = this
				if(_this.cartList[e.index]){
					let cart = _this.cartList[e.index]
					if(parseInt(e.value) === parseInt(cart.goods_number)){
						return
					}
					_this.put("/cart/item", {
						id:cart.id,
						goods_number:e.value,
					}).then(res => {
						cart.goods_number = e.value
						_this.calCartPrice()
					})
					
				}
				
			},
			submitorder() {
				uni.navigateTo({
					url: '/pages/submitorder/submitorder'
				});
			}
		},
		components: {
			charList
		}
	}
</script>

<style scoped>
	.cart-item {
		display: flex;
		padding: 60rpx;
	}

	.char {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.char-head {
		width: 100%;
		height: 80rpx;
		display: flex;
		justify-content: space-between;
		padding: 0 25rpx;
		box-sizing: border-box;
		background: #FFFFFF;
	}

	.char-head-left {
		width: 150rpx;
		height: 100%;
		line-height: 80rpx;
		font-size: 36rpx;
		color: #000000;
	}

	.char-head-right {
		flex: 1;
		height: 100%;
		line-height: 80rpx;
		text-align: right;
		color: #121416;
		font-size: 30rpx;
	}

	.char-scroll {
		width: 100%;
		height: calc(100% - 80rpx - var(--status-bar-height));
		background: #F4F8FB;

		box-sizing: border-box;
	}

	.char-scroll-activeoff {
		padding: 18rpx 23rpx;
	}

	.char-scroll-activeon {
		padding: 18rpx 23rpx 196rpx;
	}

	.char-scroll-check {
		width: 100%;
		height: 100%;
	}

	.char-scroll-empty {
		width: 100%;
		height: 750rpx;
		padding-top: 120rpx;
		box-sizing: border-box;
		/* display: flex;
	justify-content: center; */
		/* align-items: center; */
		flex-wrap: wrap;
	}

	.char-scroll-empty-image {
		width: 100%;
		height: 250rpx;
		display: flex;
		justify-content: center;
		margin-bottom: 20rpx;
	}

	.char-scroll-empty image {
		width: 346rpx;
		height: 234rpx;
		margin: 0 auto;
	}

	.char-scroll-empty text {
		display: inline-block;
		width: 100%;
		height: 50rpx;
		text-align: center;
		line-height: 50rpx;
		font-size: 26rpx;
		color: #666666;
	}

	/* 操作条 */
	.char-operating {
		width: 100%;
		height: auto;
		position: absolute;
		left: 0;
		bottom: 0;
	}

	.char-operating-bottom {
		width: 100%;
		height: 104rpx;
		background: #FFFFFF;
		padding: 0 22rpx 0 17rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
	}

	.char-operating-bottom-left {
		width: 200rpx;
		height: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.checked {
		color: #39B54A;
	}

	.char-operating-bottom-right {
		flex: 1;
		height: 100%;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.char-operating-bottom-right-right {
		width: 210rpx;
		height: 77rpx;
		border-radius: 38rpx;
		background-image: linear-gradient(to right, #FE5722, #FE212A);
		color: #FFFFFF;
		text-align: center;
		line-height: 77rpx;
		font-size: 30rpx;
	}

	.char-operating-bottom-right-left {
		margin-right: 10rpx;
		text-align: right;
	}

	.char-operating-bottom-right-left-top {
		display: flex;
		justify-content: flex-end;
	}

	.char-operating-bottom-right-left-top text:nth-child(1) {
		font-size: 26rpx;
		margin-right: 10rpx;
	}

	.char-operating-bottom-right-left-top text:nth-child(2) {
		font-size: 38rpx;
		font-weight: bold;
		color: #FE212A;
	}

	.char-operating-bottom-right-left-bottom text {
		font-size: 22rpx;
		color: #A1A1A1;
	}

	.char-operating-top {
		width: 100%;
		height: 76rpx;
		background: #FFF5F4;
		padding: 0 24rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
	}

	.char-operating-top-left {
		flex: 1;
		height: 76rpx;
	}

	.char-operating-top-left-tit {
		width: 100%;
		height: 100%;
		line-height: 76rpx;
		font-size: 26rpx;
		color: #20232A;
	}

	.char-operating-top-right {
		width: 110rpx;
		line-height: 76rpx;
	}

	.char-operating-top-right text:nth-child(1) {
		color: #FC1B3A;
		font-size: 24rpx;
	}

	.char-operating-top-right text:nth-child(2) {
		color: #DD92A4;
		font-size: 24rpx;
	}

	/* 相似商品 */
	.shopping-similar {
		width: 100%;
		height: auto;
		padding: 0 20rpx 20rpx;
		box-sizing: border-box;

	}

	.shopping-similar-name {
		width: 100%;
		height: 76rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.shopping-similar-box {
		width: 100%;
		height: auto;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.shopping-similar-box-list {
		width: 345rpx;
		height: auto;
		background: #FFFFFF;
		padding-bottom: 44rpx;
		box-sizing: border-box;
		border-radius: 10rpx;
	}

	.shopping-similar-box-list-image {
		width: 100%;
		height: 340rpx;
		padding: 17rpx;
		box-sizing: border-box;
	}

	.shopping-similar-box-list-image image {
		width: 100%;
		height: 100%;
	}

	.shopping-similar-box-list-name {
		width: 100%;
		height: 68rpx;
		line-height: 34rpx;
		font-size: 26rpx;
		color: #1F1F1F;
		padding: 0 22rpx;
		box-sizing: border-box;

	}

	.shopping-similar-box-list-table {
		width: 100%;
		height: 68rpx;
		padding: 0 22rpx;
		box-sizing: border-box;
	}

	.classRightListBox-right-prick {
		width: 100%;
		height: 46rpx;
		display: flex;
		justify-content: space-between;
		padding: 0 20rpx;
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
		font-size: 24rpx;
	}

	.classRightListBox-right-prick-left-prick1 text:nth-child(2) {
		font-size: 36rpx;
		font-weight: bold;
	}

	.classRightListBox-right-prick-left-prick2 {
		height: 100%;
		line-height: 46rpx;
		color: #B6B6B6;
		font-size: 26rpx;
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


	.charList {
		width: 100%;
		height: 212rpx;
		background: #FFFFFF;
		border-radius: 15rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.charList-left {
		width: 85rpx;
		height: 212rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.charList-image {
		width: 134rpx;
		height: 212rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.charList-image image {
		width: 134rpx;
		height: 134rpx;
	}

	.charList-right {
		flex: 1;
		height: 212rpx;
		box-sizing: border-box;
		padding: 25rpx 20rpx 0;
	}

	.charList-right-name {
		width: 100%;
		height: 50rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.charList-right-name-lable {
		border-radius: 10rpx;
		border: 1px solid #E1C9D2;
		color: #F8224A;
		font-size: 22rpx;
		padding: 5rpx 10rpx;
		margin-right: 10rpx;
	}

	.charList-right-name-text {
		color: #1B2127;
		font-weight: bold;
		font-size: 30rpx;
	}

	.charList-right-title {
		width: 100%;
		height: 43rpx;
		color: #989898;
		font-size: 22rpx;
		line-height: 43rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.charList-right-prick {
		width: 100%;
		height: 84rpx;
		/* display: flex;
	justify-content: space-between;
	align-items: center; */
		position: relative;
	}

	.charList-right-prick-left {
		width: 100%;
		height: 84rpx;
		line-height: 84rpx;
	}

	.charList-right-prick-left-text1 {
		color: #FC002D;
		font-size: 22rpx;
		margin-right: 5rpx;
	}

	.charList-right-prick-left-text2 {
		color: #FC002D;
		font-size: 36rpx;
		font-weight: bold;
		margin-right: 5rpx;
	}

	.charList-right-prick-left-text3 {
		color: #888C8E;
		font-size: 28rpx;
		margin-right: 10rpx;
	}

	.charList-right-prick-left-text4 {
		color: #888C8E;
		font-size: 24rpx;
		text-decoration: line-through;
	}

	.charList-right-prick-right {
		position: absolute;
		height: 100%;
		right: 0;
		bottom: 0;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
</style>
