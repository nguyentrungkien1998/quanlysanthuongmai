<template>
	<div  style="border: 1px solid #e4e4e4;border-radius: 5px;background-color: white;">
		<el-row :gutter="20">
			<el-col :span="24" :offset="0">
				<div class="title-bar">
					<div style="margin-left:20px">
						Quản lý tài khoản SENDO
						<el-button style="margin-left: 20px;margin-top: 0px;background: none;color:white;font-size:13px" type="success" icon="el-icon-s-shop" :loading="false" :plain="true" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">{{data.length}} cửa hàng liên kết</el-button>
						<el-button style="float: right;margin-right: 10px;background: none;color:white" type="success" icon="el-icon-tickets" :loading="false" :plain="true" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Hướng dẫn</el-button>
					</div>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col align="left" :span="12" :offset="0">
				<el-image style="width:70px;margin-left:20px" src="https://res.cloudinary.com/dtll0jawl/image/upload/v1601083584/ta%CC%89i_xuo%CC%82%CC%81ng_ezrkiq.png"></el-image>
			</el-col>
			<el-col align="right" :span="12" :offset="0">
				<div style="margin-right: 10px">
					<el-button @click="add_shop = true" type="primary" icon="el-icon-plus" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="small" :disabled="false">Thêm Cửa Hàng</el-button>
				</div>

				
			</el-col>
		</el-row>
		<br>

		
		
		<el-row :gutter="20">
			<el-col :span="24" :offset="0">
				<el-alert title="Quý khách được thêm tối đa 10 shop Sendo" description="" show-icon type="warning" closable :center="false" effect="light"></el-alert>
				
			</el-col>
		</el-row>
		<div class="table-container">

			<el-table style="width: 100%" :data="data" max-height="400" :border="true" :highlight-current-row="true" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="light">
				<el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1">

					<el-table-column type="index" label="STT" align="center" :sortable="false" :fixed="false"  width="130">
						<template slot-scope="scope">
							<el-tag  type="info" :closable="false"  effect="plain" size="medium" :disable-transitions="false">{{scope.$index+1}}</el-tag>
						</template>

					</el-table-column>
				</el-col>

				<el-table-column label="Tên Shop" prop="name" align="center" :sortable="false" :fixed="false" width="576"/>
				<el-table-column label="Trạng Thái" prop="status" align="center" :sortable="false" :fixed="false" width="250">
					<template slot-scope="scope">

						<el-tag :type="scope.row.active ? 'success' : 'danger'" :closable="false" effect="plain" size="mini" :disable-transitions="false">{{scope.row.active ? 'Đang hoạt động' : 'Ngừng hoạt động'}}</el-tag>

					</template>
				</el-table-column>
				<el-table-column label="" align="center" :sortable="false" :fixed="false" width="220">
					<template slot-scope="scope">
						<el-tooltip effect="dark" :content="TimeLeft(scope.row.updatedAt)" placement="top">
							<el-button type="primary" icon="el-icon-refresh-right" @click="Refresh(scope.row)" :loading="scope.row.refresh_loading" :plain="true" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Reload</el-button>
						</el-tooltip>
						
						<el-popconfirm title="Bạn có chắc chắn?" @confirm="removeAcc(scope.row)" confirmButtonText='OK' cancelButtonText='Không,cảm ơn.' icon="el-icon-info" iconColor="red">

							<el-button slot="reference" type="danger" icon="el-icon-delete" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Xoá</el-button>
						</el-popconfirm>

					</template>
				</el-table-column></el-table>
			</div>



			<el-dialog title="Thêm Shop trên Sendo" :visible.sync="add_shop" :center="false" :fullscreen="false" top="15vh" width="45%">
				<div>
					<el-form ref="form" :rules="ruleForm" :model="formData"  status-icon label-width="auto" label-position="top" :inline="false" :disabled="false" :inline-message="false" show-message validate-on-rule-change size="small">
						<el-form-item align="left">
							<el-alert

							type="info" :closable="false" :center="false">
							<template slot="title">
								<p>Truy cập vào <el-link target="_blank" href="http://ban.sendo.vn/cau-hinh/api" icon="" type="primary" :underline="false" :disabled="false">http://ban.sendo.vn/cau-hinh/api</el-link> để lấy Mã Shop và Mã bảo mật.</p>
							</template>
						</el-alert>
					</el-form-item>
					<el-form-item label="Mã Shop :" prop="shop_key" align="left">
						<el-input spellcheck="false" placeholder="Nhập mã shop" v-model="formData.shop_key" size="medium" prefix-icon="el-icon-key" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>






					</el-form-item>
					<el-form-item label="Mã bảo mật :" prop="secret_key" align="left">
						<el-input spellcheck="false" placeholder="Nhập mã bảo mật" v-model="formData.secret_key" size="medium" prefix-icon="el-icon-key" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>






					</el-form-item>
					<el-form-item align="center">
						<el-button icon="el-icon-right" @click="add" :loading="loading_confirm" type="primary">Xác nhận</el-button>
					</el-form-item>
				</el-form>





				
				<p style="font-size: 15px">Video hướng dẫn:</p> <br>
				<iframe width="100%" height="315" src="https://www.youtube.com/embed/wH79hBjnZXk" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
			</div>
			
		</el-dialog>
	</div>
</template>
<script>
	import { mapState,mapGetters,mapMutations,mapActions } from 'vuex';
	export default {
		data(){
			return {
				data:[],
				add_shop:false,
				formData:{
					shop_key:'',secret_key:''
				},
				ruleForm:{
					'shop_key':[{required:true,message:'Quý khách chưa nhập Mã Shop',trigger:'click'}],
					'secret_key':[{required:true,message:'Quý khách chưa nhập Mã bảo mật',trigger:'click'}]


				},
				loading_confirm:false
			}
		},
		created:async function(req,res){
			await this.Init();
		},
		methods:{
			...mapActions('onsite',['getCountAccountEc']),
			async Init(){
				return await Promise.all([this.accounts()])
			},
			reset(){
				this.formData.shop_key = '';
				this.formData.secret_key = '';
				this.loading_confirm = false;
			},
			async Refresh(obj){
				obj.loading = true
				try{
					let _ = this;
					let {data} = await this.$axios.post('/api/accountec/refresh',{ec:'sendo',id:obj.id});
					_.data = _.data.map(e=>{
						if(e.id === data.id) e = data;
						return e;
					});
					_.$message({type:'success',message:'Đã làm mới'})
				}catch(error){
					this.$message({type:'error',message:error});
				}
				obj.loading = false;
				return
				
			},
			async add(){
				let _ = this;
				_.$refs['form'].validate(async valid=>{
					if(valid){
						_.loading_confirm = true;
						try{
							let {data} = await this.$axios.post('/api/accountec/sendo',{shop_key:this.formData.shop_key,secret_key:this.formData.secret_key});
							if(data.error) throw data.error;
							_.data.push(data);
							_.add_shop = false;
							await Promise.all([_.AddPending_Product(data.id),_.AddPending_Order(data.id)]);
							
							_.$message({type:'success',message:'Shop '+data.name+' vừa được thêm Thành công.'});
							await _.getCountAccountEc();
						}catch(message){
							_.$message({type:'error',message});
						}
						return _.reset();

					}else{
						return false;
					}
				})
			},
			TimeLeft(updatedAt){
				let ChangeTime = Date.now()-updatedAt;
				let limit_second = 1000;
				let limit_minute = 60000;
				let limit_hour = 3600000;
				let limit_day = 86400000;

				if((ChangeTime > limit_second) && (ChangeTime < limit_minute)){
					return Math.round(ChangeTime/1000)+' giây'
				}else if((ChangeTime > limit_minute) && (ChangeTime < limit_hour)){
					return Math.floor(ChangeTime/60000)+' phút'
				}else if((ChangeTime > limit_hour) && (ChangeTime < limit_day)){
					return Math.floor(ChangeTime/3600000)+ ' giờ '+Math.round((ChangeTime - (Math.floor(ChangeTime/3600000)*3600000))/60000)+' phút'
				}else if(ChangeTime > limit_day){
					return Math.floor(ChangeTime/86400000)+ ' ngày '+Math.round((ChangeTime - (Math.floor(ChangeTime/86400000)*86400000))/3600000)+' giờ'
				}else{
					return 'Vừa xong';
				}

			},
			async Refresh(e){
				e.refresh_loading = true;
				let {data} = await this.$axios.post('/api/refreshec/sendo',{id:e.id});
				if(data.error){
					this.$message({type:'danger',message:data.error});
				}else{
					e.updatedAt = data.updatedAt;
					e.refresh_loading = false;
					this.$message({type:'success',message:'Cập nhật thành công '+e.name})
				}
				
				return;
			},
			async AddPending_Product(accountec_id){
				return await this.$axios.post('/api/pending/create',{accountec_id,section:'product'})
			},
			async AddPending_Order(accountec_id){
				return await this.$axios.post('/api/pending/create',{accountec_id,section:'order'})

			},
			async accounts(){
				let {data} = await this.$axios.post('/api/accountec/get',{ec:'sendo'});
				return this.data = data;
				
			},
			async removeAcc(obj){
				await this.$axios.post('/api/accountec/remove',{id:obj.id,ec:'sendo'});
				this.data = this.data.filter(e=>e.id !== obj.id);
				this.$message({type:'warning',message:'Đã gỡ liên kết với Shop: '+obj.name });
				return await this.getCountAccountEc();
			}
		}
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
@media screen and (max-width:768px) {
	.table-container {
		overflow: auto;
	}
}
</style>
