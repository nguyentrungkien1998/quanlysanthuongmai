<template>
	<div  style="border: 1px solid #e4e4e4;border-radius: 5px;background-color: white;">
		<el-row :gutter="20">
			<el-col :span="24" :offset="0">
				<div class="title-bar">
					<div style="margin-left:20px">
						Tạo sản phẩm
						<el-button style="float: right;margin-right: 10px;margin-top: -5px;background: none;color:white" type="success" icon="el-icon-tickets" :loading="false" :plain="true" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Hướng dẫn</el-button>
					</div>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :span="24" :offset="0">
				<el-alert title="📌 Chức năng tạo sản phẩm" type="info" closable :center="false" effect="light">
					- Tạo sản phẩm nhanh chóng, <u> Up lên cùng lúc nhiều cửa hàng </u> đang bán trên sàn. <br>
					- <u>Sao chép sản phẩm tự động</u> từ bất kì link nào trên 4 sàn : Tiki,Shopee,Sendo,Lazada. <br>
					- <u>Tự động nhân dạng Category</u> khi nhập tên sản phẩm. <br>
				</el-alert>
			</el-col>
		</el-row>
		<nuxt/><br>
	</div>
</template>
<script>
	export default {
		
	}
</script>
<style scoped>
.title-bar{
	width: 100%;
	height: auto;
	background-color:#5f5858;
	margin-bottom: 20px;
	padding: 10px 0px;
	color:white;
	border-top-left-radius: 5px;
	border-top-right-radius:5px
}
</style>