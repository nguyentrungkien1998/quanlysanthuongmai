<template>
	<el-row>
		<el-col :span="24" :offset="0">
			<el-tabs @tab-click="" v-model="account_type" type="border-card" tab-position="top" :closable="false" :addable="false" :editable="false" :stretch="false">
				<el-tab-pane label="Thông tin tài khoản">
					

					<el-row :gutter="20">
						<el-col :span="12" :offset="0">
							<el-form ref="form" :rules="ruleForm" :model="formData"  status-icon label-width="auto" label-position="top" :inline="false" :disabled="false" :inline-message="false" show-message validate-on-rule-change size="small">
								<el-form-item label="Họ và Tên" prop="fullname" align="left">
									<el-input placeholder="Nhập họ và tên" v-model="formData.fullname" size="small" prefix-icon="el-icon-user-solid" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
								</el-form-item>
								
								<el-row :gutter="10">
									
									<el-col :span="10" :offset="0">
										<el-form-item label="Ngày sinh" prop="date_of_birth" align="left">
											<el-date-picker format="dd-MM-yyyy" placeholder="Ngày-Tháng-Năm" value-format="timestamp" v-model="formData.date_of_birth" size="small" type="date" align="left"></el-date-picker>
										</el-form-item>
									</el-col>
									<el-col :span="7" :offset="0">
										<el-form-item label="Giới tính" prop="gender" align="left">
											<el-select size="small" v-model="formData.gender"  placeholder="Chọn" filterable :allow-create="false" :multiple="false" multiple-limit="0" :collapse-tags="false" :clearable="false" :disabled="false">
												<el-option label="Nam" value="male" :disabled="false"></el-option>
												<el-option label="Nữ" value="female" :disabled="false"></el-option>

											</el-select>
										</el-form-item>
									</el-col>
									<el-col :span="7" :offset="0">
										<el-form-item label="Cấp bậc" prop="level" align="left">
											<el-input placeholder="Cấp bậc" v-model="formData.level" size="small" prefix-icon="" type="text" :autosize="false" :disabled="true" autocomplete="off"></el-input>
										</el-form-item>
									</el-col>

									
								</el-row>

								
								<el-form-item label="Địa chỉ" prop="address" align="left">
									<el-input placeholder="Địa chỉ" v-model="formData.address" size="small" prefix-icon="el-icon-map-location"  clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
								</el-form-item>

							</el-form>
						</el-col>
						<el-col :span="12" :offset="0">
							<el-form ref="form" :rules="ruleForm" :model="formData"  status-icon label-width="auto" label-position="top" :inline="false" :disabled="false" :inline-message="false" show-message validate-on-rule-change size="small">
								
								
								<el-form-item label="Email" prop="email" align="left">
									<el-tooltip :content="formData.active_email ? 'Đã xác thực' : 'Chưa xác thực'" effect="dark" placement="top">
										<el-input placeholder="Nhập địa chỉ email" v-model="formData.email" size="small" prefix-icon="el-icon-user-solid" clearable type="text" :autosize="false" :disabled="true" autocomplete="off">
											<el-button type="primary" slot="append">Gửi</el-button>
										</el-input>
									</el-tooltip>
									
								</el-form-item>
								
								<el-form-item label="Số điện thoại" prop="phone" align="left">
									<el-tooltip :content="formData.active_phone ? 'Đã xác thực' : 'Chưa xác thực'" effect="dark" placement="top">
										<el-input placeholder="Nhập số điện thoại" v-model="formData.phone" maxlength="10" show-word-limit size="small" prefix-icon="el-icon-phone" clearable type="text" :autosize="false" :disabled="false" autocomplete="off">
											<el-button v-if="(formData.phone || '').length === 10" type="primary" slot="append">Gửi</el-button>
										</el-input>
									</el-tooltip>
								</el-form-item> 



							</el-form>
						</el-col>
					</el-row>
					
					<el-button type="primary" icon="el-icon-refresh"  :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="small" :disabled="false">Cập nhật</el-button>
					

					
				</el-tab-pane>
				<el-tab-pane label="Liên kết">Tài khoản liên kếtx</el-tab-pane>

			</el-tabs>
		</el-col>
	</el-row>
</template>
<script>
	import { mapState,mapGetters,mapMutations,mapActions } from 'vuex';
	export default {
		data(){
			return {
				account_type:'',
				loading:false,
				formData:{
					fullname:'',
					email:'',
					phone:''
				},
				ruleForm:{
					fullname:[{type:'string',required:true,message:'Quý khách vui lòng nhập Họ và Tên.'}],
					email:[{type:'email',required:true}],
					phone:[{type:'string',min:10,max:10,message:'Số điện thoại không hợp lệ.',trigger:'blur'}],
					gender:[{type:'string',required:true,message:'Chọn giới tính',trigger:'blur'}],
					date_of_birth:[{type:'number',required:true,message:'Quý khách cần nhập thông tin ngày sinh.'}]
				},


			}
		},
		created:async function(){
			try{
				let {data} = await this.$axios.post('/api/account/info');

				if(data.error) throw data.error;
				return this.formData = data;
			}catch(message){
				return this.$message({type:'error',message})
			}
		},
		computed:{
//			...mapState('',[]);
//			...mapGetters('',[]);
},
methods:{
//			...mapMutations('',[]);
//			...mapActions('',[]);
async updateInfo(){
	alert('hello world');
}

}
}
</script>
<style scoped>

</style>