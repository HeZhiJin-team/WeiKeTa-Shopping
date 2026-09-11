<template>
	<view class="about-wrapper">
		<view class="header">
			<text class="company-name">{{ companyName }}</text>
		</view>

		<view class="info-section">
			<view class="section-title">基本信息</view>
			<view class="info-item">
				<text class="label">成立日期：</text>
				<text class="value">{{ companyDate }}</text>
			</view>
			<view class="info-item">
				<text class="label">注册地址：</text>
				<text class="value">{{ companyAddress }}</text>
			</view>
			<view class="info-item">
				<text class="label">法定代表人：</text>
				<text class="value">{{ companyLegal }}</text>
			</view>
		</view>

		<view class="info-section">
			<view class="section-title">经营范围</view>
			<view class="scope-content">
				<text class="value">{{ companyScope }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				companyName: '深圳维科塔信息技术有限公司',
				companyDate: '2024年06月11日',
				companyAddress: '深圳市宝安区西乡街道臣田社区宝田一路50号臣田研发大楼702',
				companyLegal: '刘小文',
				companyScope: '电子产品销售；机械设备销售；金属制品销售；仪器仪表销售；办公设备销售；电子元器件批发；智能机器人销售；人工智能硬件销售；智能机器人的研发；五金产品批发；五金产品研发；办公用品销售；日用品销售；信息技术咨询服务；信息咨询服务（不含许可类信息咨询服务）；数据处理服务；物联网技术研发；物联网技术服务；国内贸易代理；农副产品销售。（除依法须经批准的项目外，凭营业执照依法自主开展经营活动）许可经营项目：无。'
			};
		}
	};
</script>

<style lang="scss" scoped>
	page {
		background-color: #f5f5f5;
	}

	.about-wrapper {
		padding: 30rpx;
	}

	.header {
		background-color: #fff;
		border-radius: 12rpx;
		padding: 40rpx 30rpx;
		text-align: center;
		margin-bottom: 24rpx;
	}

	.company-name {
		font-size: 36rpx;
		font-weight: 700;
		color: #333;
	}

	.info-section {
		background-color: #fff;
		border-radius: 12rpx;
		padding: 30rpx;
		margin-bottom: 24rpx;
	}

	.section-title {
		font-size: 30rpx;
		font-weight: 700;
		color: #333;
		margin-bottom: 24rpx;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #eee;
	}

	.info-item {
		display: flex;
		align-items: flex-start;
		margin-bottom: 20rpx;
		font-size: 28rpx;
		line-height: 1.6;
	}

	.label {
		color: #999;
		white-space: nowrap;
	}

	.value {
		color: #333;
		flex: 1;
	}

	.scope-content {
		font-size: 28rpx;
		color: #333;
		line-height: 1.8;
	}
</style>
