<template>
	<view class="union-pay-page">
		<view class="bg-orb orb-a"></view>
		<view class="bg-orb orb-b"></view>
		<view class="bg-grid"></view>

		<view class="panel">
			<view class="head">
				<view class="tag">{{$t(`UNIOPAY`)}}</view>
				<view class="title">{{$t(`银联支付`)}}</view>
				<view class="meta">
					<text>{{$t(`订单`)}} {{ pageOrderId || '-' }}</text>
					<text>{{$t(`金额`)}} ￥{{ totalPrice }}</text>
				</view>
			</view>

			<view class="form">
					<view class="field">
						<view class="label">{{$t(`姓名`)}}</view>
						<input v-model.trim="form.name" class="input" :placeholder="$t(`请输入姓名`)" />
					</view>

					<view class="field">
						<view class="label">{{$t(`银行卡号码`)}}</view>
						<input v-model="form.bank_acc" class="input" type="number" maxlength="23" :placeholder="$t(`请输入银行卡号码`)"
							@input="normalizeBankCard" />
					</view>

					<view class="field">
						<view class="label">{{$t(`证件类型`)}}</view>
						<picker class="picker-wrap" :range="certTypeList" range-key="label" @change="changeCertType">
							<view class="input picker">{{ certTypeList[form.certTypeIndex].label }}</view>
						</picker>
					</view>

					<view class="field">
						<view class="label">{{$t(`证件号`)}}</view>
						<input v-model.trim="form.id_card_no" class="input" :placeholder="$t(`请输入证件号`)" />
					</view>

					<view class="field">
						<view class="label">{{$t(`手机号`)}}</view>
						<input v-model="form.mobile" class="input" type="number" maxlength="11" :placeholder="$t(`请输入手机号`)"
							@input="normalizeMobile" />
					</view>

					<view class="field">
						<view class="label">{{$t(`验证码`)}}</view>
						<view class="code-row">
							<input v-model.trim="form.sms_code" class="input code-input" type="number" maxlength="6" :placeholder="$t(`请输入验证码`)" />
							<button class="code-btn" :disabled="countdown > 0" @click="sendCode">
								{{ countdown > 0 ? `${countdown}s` : $t(`获取验证码`) }}
							</button>
						</view>
				</view>
			</view>

			<view class="footer">
				<button class="submit-btn" @click="submitPay">{{$t(`确认支付`)}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { unionPaySuccess } from '@/api/order';

		export default {
			data() {
				return {
					pageOrderId: '',
					tradeNo: '',
					totalPrice: '0.00',
					sendCodeUrl: '/pay/SandePay?function=placeOrder',
					quickPayUrl: '/pay/SandePay?function=quickPay',
					certTypeList: [
						{ label: '身份证', value: '01' },
						{ label: '护照', value: '02' },
						{ label: '港澳通行证', value: '03' },
						{ label: '台胞证', value: '04' }
					],
					form: {
						name: '',
						bank_acc: '',
						certTypeIndex: 0,
						id_card_type: '01',
						id_card_no: '',
						mobile: '',
						sms_code: ''
					},
					countdown: 0,
					timer: null
				};
			},
			onLoad(options) {
				// 页面展示订单号使用 URL 传值；接口订单号单独生成并复用
				this.pageOrderId = options.order_id || '';
				this.tradeNo = this.generateTradeNo();
				this.totalPrice = options.totalPrice || '0.00';
			},
		onUnload() {
			if (this.timer) {
				clearInterval(this.timer);
				this.timer = null;
			}
		},
			methods: {
				normalizeBankCard(e) {
					this.form.bank_acc = (e.detail.value || '').replace(/\D/g, '').slice(0, 23);
				},
				normalizeMobile(e) {
					this.form.mobile = (e.detail.value || '').replace(/\D/g, '').slice(0, 11);
				},
				changeCertType(e) {
					const idx = Number(e.detail.value || 0);
					this.form.certTypeIndex = idx;
					this.form.id_card_type = this.certTypeList[idx].value;
				},
				generateTradeNo() {
					const now = new Date();
					const pad = (num, len = 2) => String(num).padStart(len, '0');
					const time = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
					const ms = pad(now.getMilliseconds(), 3);
					const random = Math.floor(Math.random() * 9000 + 1000);
					return `${time}${ms}${random}`;
				},
				getAmount() {
					const amount = Number(this.totalPrice || 0);
					return amount > 0 ? amount.toFixed(2) : '0.01';
				},
				validateBaseFields() {
					if (!this.form.name) return '请输入姓名';
					if (this.form.bank_acc.length < 12) return '请输入正确银行卡号码';
					if (!this.form.id_card_no) return '请输入证件号';
					if (!/^1\d{10}$/.test(this.form.mobile)) return '请输入正确手机号';
					return '';
				},
				sendCode() {
					const err = this.validateBaseFields();
					if (err) return this.toast(err);
					const payload = {
						channel: 16,
						business: 32,
						trade_no: this.tradeNo,
						amount: this.getAmount(),
						name: this.form.name,
						id_card_type: this.form.id_card_type,
						id_card_no: this.form.id_card_no,
						mobile: this.form.mobile,
						bank_acc: this.form.bank_acc
					};
					uni.showLoading({ title: this.$t(`发送中`) });
					uni.request({
						url: this.sendCodeUrl,
						method: 'POST',
						data: payload,
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
							success: (res) => {
								uni.hideLoading();
								if (res.statusCode >= 200 && res.statusCode < 300 && res.data && Number(res.data.code) === 0) {
									this.toast((res.data && res.data.msg) || '验证码已发送');
								if (this.timer) {
									clearInterval(this.timer);
									this.timer = null;
								}
								this.countdown = 60;
								this.timer = setInterval(() => {
									this.countdown -= 1;
									if (this.countdown <= 0) {
										clearInterval(this.timer);
										this.timer = null;
										this.countdown = 0;
									}
								}, 1000);
								} else {
									this.toast((res.data && res.data.msg) || '发送失败，请重试');
								}
							},
						fail: () => {
							uni.hideLoading();
							this.toast('发送失败，请检查网络');
						}
					});
				},
				submitPay() {
					const err = this.validateBaseFields();
					if (err) return this.toast(err);
					if (!this.pageOrderId) return this.toast('缺少页面订单号');
					if (!/^\d{4,6}$/.test(this.form.sms_code)) {
						return this.toast('请输入正确验证码');
					}
					const payload = {
						trade_no: this.tradeNo,
						sms_code: this.form.sms_code,
						amount: this.getAmount()
					};
					uni.showLoading({ title: this.$t(`支付中`) });
					uni.request({
						url: this.quickPayUrl,
						method: 'POST',
						data: payload,
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
							success: (res) => {
								uni.hideLoading();
								if (res.statusCode >= 200 && res.statusCode < 300 && res.data && Number(res.data.code) === 0) {
									this.confirmOrderPaid();
								} else {
									this.toast((res.data && res.data.msg) || '支付提交失败，请重试');
								}
						},
						fail: () => {
							uni.hideLoading();
							this.toast('支付提交失败，请检查网络');
						}
						});
					},
				confirmOrderPaid() {
					uni.showLoading({ title: this.$t(`确认中`) });
					unionPaySuccess({
						order_id: this.pageOrderId,
						trade_no: this.tradeNo
					}).then(() => {
						uni.hideLoading();
						this.toast('支付成功');
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/goods/order_pay_status/index?order_id=' + this.pageOrderId + '&payType=allinpay&msg=' + this.$t(`支付成功`) +
									'&type=3&totalPrice=' + this.totalPrice + '&status=0'
							});
						}, 300);
					}).catch((err) => {
						uni.hideLoading();
						this.toast(typeof err === 'string' ? err : '支付成功，但订单确认失败，请稍后重试');
					});
					},
			toast(msg) {
				uni.showToast({
					title: this.$t(msg),
					icon: 'none'
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.union-pay-page {
		min-height: 100vh;
		padding: 36rpx 26rpx 42rpx;
		position: relative;
		overflow: hidden;
		background: linear-gradient(140deg, #f3eee5 0%, #faf7f1 42%, #efe8dc 100%);
		font-family: 'HarmonyOS Sans SC', 'PingFang SC', 'Noto Serif SC', sans-serif;
	}

	.bg-orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(16rpx);
		opacity: 0.35;
		pointer-events: none;
	}

	.orb-a {
		width: 360rpx;
		height: 360rpx;
		right: -80rpx;
		top: -50rpx;
		background: radial-gradient(circle at center, #d0b48a 0%, rgba(208, 180, 138, 0) 72%);
	}

	.orb-b {
		width: 300rpx;
		height: 300rpx;
		left: -90rpx;
		bottom: 90rpx;
		background: radial-gradient(circle at center, #9ea691 0%, rgba(158, 166, 145, 0) 70%);
	}

	.bg-grid {
		position: absolute;
		inset: 0;
		background-image: linear-gradient(rgba(30, 24, 17, 0.04) 1px, transparent 1px),
			linear-gradient(90deg, rgba(30, 24, 17, 0.04) 1px, transparent 1px);
		background-size: 24rpx 24rpx;
		opacity: 0.35;
		pointer-events: none;
	}

	.panel {
		position: relative;
		z-index: 1;
		background: rgba(255, 255, 255, 0.7);
		backdrop-filter: blur(10rpx);
		border: 2rpx solid rgba(58, 45, 27, 0.08);
		border-radius: 26rpx;
		padding: 30rpx 26rpx;
		box-shadow: 0 18rpx 48rpx rgba(62, 48, 29, 0.12);
	}

	.head {
		margin-bottom: 22rpx;
	}

	.tag {
		display: inline-block;
		font-size: 22rpx;
		letter-spacing: 2rpx;
		color: #7b6242;
		background: rgba(123, 98, 66, 0.12);
		border-radius: 999rpx;
		padding: 8rpx 16rpx;
		margin-bottom: 12rpx;
	}

	.title {
		font-size: 42rpx;
		font-weight: 700;
		color: #2f2418;
		line-height: 1.2;
	}

	.meta {
		display: flex;
		justify-content: space-between;
		margin-top: 14rpx;
		font-size: 24rpx;
		color: #7a6750;
	}

	.form {
		margin-top: 12rpx;
	}

	.field {
		margin-bottom: 18rpx;
	}

	.label {
		font-size: 24rpx;
		font-weight: 600;
		color: #4a3a25;
		margin-bottom: 8rpx;
	}

	.input {
		width: 100%;
		height: 86rpx;
		border-radius: 16rpx;
		padding: 0 22rpx;
		box-sizing: border-box;
		background: rgba(255, 252, 247, 0.94);
		border: 1.5rpx solid rgba(97, 75, 47, 0.14);
		color: #2f2418;
		font-size: 28rpx;
	}

	.picker-wrap {
		width: 100%;
	}

	.picker {
		display: flex;
		align-items: center;
		position: relative;
	}

	.picker::after {
		content: '⌄';
		position: absolute;
		right: 22rpx;
		top: 50%;
		transform: translateY(-52%);
		font-size: 24rpx;
		color: #7b6242;
	}

	.code-row {
		display: flex;
		gap: 14rpx;
	}

	.code-input {
		flex: 1;
	}

	.code-btn {
		width: 210rpx;
		height: 86rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 16rpx;
		border: none;
		background: linear-gradient(140deg, #483524 0%, #2b2118 100%);
		color: #efe1cb;
		font-size: 26rpx;
		text-align: center;
	}

	.code-btn[disabled] {
		background: #a8967c;
		color: #f5eee3;
	}

	.footer {
		margin-top: 18rpx;
	}

	.submit-btn {
		width: 100%;
		height: 92rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 16rpx;
		border: none;
		background: linear-gradient(130deg, #b1814d 0%, #82562c 55%, #6d4724 100%);
		color: #fff8ef;
		font-size: 30rpx;
		font-weight: 700;
		letter-spacing: 1rpx;
		text-align: center;
		box-shadow: 0 10rpx 28rpx rgba(109, 71, 36, 0.28);
	}
</style>
