<template>
	<div  style="border: 1px solid #e4e4e4;border-radius: 5px;background-color: white;">
		<el-row :gutter="20">
			<el-col :span="24" :offset="0">
				<div class="title-bar">
					<div style="margin-left:20px">
						Quản lý tài khoản SHOPEE 
						<el-button style="margin-left: 20px;margin-top: 0px;background: none;color:white;font-size:13px" type="success" icon="el-icon-s-shop" :loading="false" :plain="true" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">{{data.length}} cửa hàng liên kết</el-button>
						
						<el-button style="float: right;margin-right: 10px;background: none;color:white" type="success" icon="el-icon-tickets" :loading="false" :plain="true" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Hướng dẫn</el-button>
					</div>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col align="left" :span="12" :offset="0">
				<el-image style="width:100px;margin-left:20px" src="https://res.cloudinary.com/doo4xi4rh/image/upload/v1596620226/shopee_digvyt.png"></el-image>
			</el-col>
			<el-col align="right" :span="12" :offset="0">
				<div style="margin-right: 10px">
					<el-button type="primary" @click="open_link" icon="el-icon-plus" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="small" :disabled="false">Thêm Cửa Hàng</el-button>
				</div>

			</el-col>
		</el-row>
		<br>

		
		
		<el-row :gutter="20">
			<el-col :span="24" :offset="0">
				<el-alert title="Quý khách được thêm tối đa 10 shop Shopee" description="" show-icon type="warning" closable :center="false" effect="light"></el-alert>
				
			</el-col>
		</el-row>
		




		<el-table :data="data" :border="true" :highlight-current-row="true" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="light">


			<el-table-column type="index" label="STT" align="center" :sortable="false" :fixed="false" width="130">
				<template slot-scope="scope">
					<el-tag  type="info" :closable="false"  effect="plain" size="medium" :disable-transitions="false">{{scope.$index+1}}</el-tag>
				</template>

			</el-table-column>

			<el-table-column label="Tên Shop" prop="name" align="center" :sortable="false" :fixed="false" width="576"/>
			<el-table-column label="Trạng Thái" prop="status" align="center" :sortable="false" :fixed="false" width="250">
				<template slot-scope="scope">

					<el-tag :type="scope.row.active ? 'success' : 'danger'" :closable="false" effect="plain" size="mini" :disable-transitions="false">{{scope.row.active ? 'Đang hoạt động' : 'Ngừng hoạt động'}}</el-tag>

				</template>
			</el-table-column>

			<el-table-column label="" align="center" width="220">
				<template slot-scope="scope">
					<el-tooltip effect="dark" :content="TimeLeft(scope.row.updatedAt)" placement="top">
						<el-button type="primary" icon="el-icon-refresh-right" @click="Refresh(scope.row)" :loading="scope.row.refresh_loading" :plain="true" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Reload</el-button>
					</el-tooltip>
					
					<el-popconfirm title="Bạn có chắc chắn?" @confirm="removeAcc(scope.row)" confirmButtonText='OK' cancelButtonText='Không,cảm ơn.' icon="el-icon-info" iconColor="red">

						<el-button slot="reference" type="danger" icon="el-icon-delete" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Xoá</el-button>
					</el-popconfirm>

				</template>
			</el-table-column>


		</el-table>
		
	</div>
</template>
<script>
	import { mapState,mapGetters,mapMutations,mapActions } from 'vuex';
	var myWindow;
	export default {
		data(){
			return {
				data:[],
				page:1,
				count:0
			}
		},
		created:async function(req,res){
			await this.Init();
		},
		mounted:async function(){
			let _ = this;
			await this.SubScribe();

			_.$socket.on('accountec',async function(result){
				
				myWindow.close();
				if(result.error) {
					_.$message({type:'error',message:result.error})
				}else{
					await Promise.all([_.AddPending_Product(result.id),_.AddPending_Order(result.id)]);
				}
				
				return await Promise.all([_.getCountAccountEc(),_.accounts()])
				
				
			});
			return;
		},
		methods:{
			...mapActions('onsite',['getCountAccountEc']),
			SubScribe(){
				let _ = this;
				return new Promise(resolve=>{
					_.$socket.get('/api/accountec/subscribe',{},function(res){

						return resolve(res);
					});
				})
			},
			async Refresh(e){
				e.refresh_loading = true;
				let {data} = await this.$axios.post('/api/refreshec/shopee',{id:e.id});
				if(data.error){
					this.$message({type:'danger',message:data.error});
				}else{
					e.updatedAt = data.updatedAt;
					e.refresh_loading = false;
					this.$message({type:'success',message:'Cập nhật thành công '+e.name})
				}
				
				return;
			},
			async Init(){
				return await Promise.all([this.accounts(),this.LoadNewAccount()])
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
			async AddPending_Product(accountec_id){
				return await this.$axios.post('/api/pending/create',{accountec_id,section:'product'})
			},
			async AddPending_Order(accountec_id){
				return await this.$axios.post('/api/pending/create',{accountec_id,section:'order'})

			},
			async LoadNewAccount(){
				if(this.$route.query.shop_id) await this.$axios.post('/api/accountec/shopee',{shopid:this.$route.query.shop_id});
				return;
			},
			
			async accounts(pagination = 1){
				let {data} = await this.$axios.post('/api/accountec/get',{ec:'shopee'});
				this.data = data;
				return;
			},
			async removeAcc(obj){
				
				await this.$axios.post('/api/accountec/remove',{id:obj.id,ec:'shopee'});
				this.data = this.data.filter(e=>e.id !== obj.id);
				this.$message({type:'warning',message:'Đã gỡ liên kết với Shop: '+obj.name });
				return await this.getCountAccountEc()
			},
			async open_link(){
				//myWindow = window.open('https://partner.shopeemobile.com/api/v1/shop/auth_partner?id=845907&token=dfc85e478fa9cec54b5f989f75cb3904db11699c5dced550555ccc71eadd6ca1&redirect=http://localhost:8080/dashboard/san-thuong-mai/shopee', "Liên kết cửa hàng", "width=1050,height=600,left=300,top=100");
				 myWindow = window.open('https://partner.shopeemobile.com/api/v1/shop/auth_partner?id=845907&token=c28267d4691c8b02e176d45c0eba2e2af8b160a43bb887d4a747c793260902cf&redirect=https://seu.vn/dashboard/san-thuong-mai/shopee', "Liên kết cửa hàng", "width=1050,height=600,left=300,top=100");


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
</style>

