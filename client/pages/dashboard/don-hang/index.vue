<template>
	<el-row :gutter="20">
		<el-col :span="24" :offset="0">
			<br>

			<el-row :gutter="20">
				<el-col :span="24" :offset="0">
					<h1>Danh sách đơn hàng</h1>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col align="left" :span="6" :offset="0">
					
					<el-input placeholder="Nhập tên sản phẩm,SKU..."size="small" suffix-icon="el-icon-search" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
					
				</el-col>
				<el-col :span="4" :offset="0">
					<el-button type="primary" icon="el-icon-refresh-left"  @click="Refresh" :loading="refresh_status" :plain="true" :round="false" :circle="false" :autofocus="false" size="small" :disabled="false">Làm mới</el-button>
				</el-col>
				<el-col align="right" :span="14" :offset="0">
					<el-button type="primary" icon="el-icon-s-data
					" :loading="false" :plain="true" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Excel</el-button>
				</el-col>
			</el-row>
			<br>
			
			<el-row :gutter="20">
				<el-col align="left" :span="24" :offset="0">
					
					<el-tabs @tab-click="ActiveTab" v-model="tab" type="border-card">

						<el-tab-pane
						v-for="(item, index) in count"
						:key="index"
						
						:name="item.id"
						>
						<template slot="label">
							<div>
								<img style="width:20px;margin-bottom: -5px" :src="image_ec(item.ec)">

								<span style="margin-left: 5px">

									{{item.name}}
									<i v-if="item.load_order === true" class="el-icon-loading"></i>
									<el-tag  type="info"effect="plain" size="mini" :disable-transitions="false">{{item.order_count}}</el-tag>

								</span>
							</div>
						</template>


					</el-tab-pane>
					<el-table :data="orders" :border="true" :highlight-current-row="true" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="light" style="width: 100%">
						
						
						
						
						<el-table-column label="Sản phẩm" align="center" :sortable="false" :fixed="false" width="100">
							<template slot-scope="scope">
								<el-popover placement="top-start" trigger="click" title="Title" width="200" transition="el-fade-in-linear">
									<el-button size="small" :circle="false" slot="reference"> {{scope.row.items.length}}</el-button>

								</el-popover>

							</template>
						</el-table-column>

						<el-table-column label="Tên khách hàng" prop="name" align="center" :sortable="false" :fixed="false" width="180"/>
						<el-table-column label="Số điện thoại" prop="phone" align="center" :sortable="false" :fixed="false" width="140"/>
						<el-table-column label="Địa chỉ" prop="address" align="left" :sortable="false" :fixed="false" width="220"/>
						<el-table-column label="Tình trạng" prop="status" align="center" :sortable="false" :fixed="false" width="180"/>
						<el-table-column label="Xác thực" align="center" :sortable="false" :fixed="false" width="180">
							<template slot-scope="scope">
								<el-dropdown @command="demo" @click="Confirm(scope.row)" size="small" split-button type="primary">
									<i v-if="scope.row.loading_status" class="el-icon-loading"></i> Xác nhận 
									<el-dropdown-menu slot="dropdown">
										
										<el-dropdown-item command="cancel">Huỷ bỏ</el-dropdown-item>
										
									</el-dropdown-menu>
								</el-dropdown>
							</template>
						</el-table-column>
						
						
						
					</el-table>


				</el-tabs>


				



			</el-col>
		</el-row>
		
		<el-row :gutter="20">
			<el-col :span="24" :offset="0" align="right">
				<el-pagination @current-change="Order" :total="count_current" :page-count="6" :hide-on-single-page="false" background layout="prev, pager, next"></el-pagination>

			</el-col>
		</el-row>
		<br>
	</el-col>
</el-row>
</template>
<script>
	export default {
		data(){
			return {
				orders:[],
				shops:[],
				page:1,
				count:[],
				status_ec:[
				{value:'canceled',type:'danger'},
				{value:'ready_to_ship tiki_delivery',type:'primary'},
				{value:'successful_delivery tiki_delivery',type:'success'},
				{value:'delivered',type:'success'},
				{value:'failed',type:'danger'},
				{value:'canceled tiki_delivery',type:'danger'},
				

				],
				ec:'Tổng hợp',
				tab:'',
				load_data:true,
				refresh_status:false,
				data_show:false

			}
		},
		created:async function(){
			this.data_show = true;
			this.load_data = true;
			await Promise.all([this.Init()]);
			
		},
		computed:{
			count_current(){
				return this.count[this.tab]
			}
		},
		methods:{
			demo(){
				alert('hello world');
			},
			async Confirm(e){
				e.loading_status = true;
				try{
					let {ec,order_id,accountec_id} = e;
					let list_ec = ['lazada','tiki','sendo','shopee'];
					if(!list_ec.includes(ec)) throw 'Không tìm thấy sàn hỗ trợ ERR:001'
					let {data} = await this.$axios.post('/api/orderstatus/confirm',{ec,order_id,accountec_id});
					
					if(data.error) throw data.error;
					

				}catch(error){
					 this.$message({type:'error',message:error});
				}
				e.loading_status = false;
				return
			},
			
			async Init(){
				await this.Count();
				await this.Order();
			},
			count_order(ec){
				return this.orders.filter(e=>e.ec === ec).length;
			},
			image_ec(ec){
				if(ec === 'lazada') {
					return 'https://res.cloudinary.com/doo4xi4rh/image/upload/v1594984163/lazada_sxhacf.png'
				}else if(ec === 'tiki'){
					return 'https://res.cloudinary.com/doo4xi4rh/image/upload/v1594984224/tiki_r2v6kh.png'
				}else if(ec === 'sendo'){
					return 'https://res.cloudinary.com/doo4xi4rh/image/upload/v1594984218/sendo_npeph9.png'
				}else if(ec === 'shopee'){
					return 'https://res.cloudinary.com/doo4xi4rh/image/upload/v1594984309/shopee_qdau2x.png'
				}
			},
			async Count(){
				let {data} = await this.$axios.post('/api/order/count');
				data = data.sort((a, b) => (a.order_count > b.order_count) ? -1 : 1);
				this.tab = data[0].id;
				return this.count = data;
			},
			async Load(e){

				e.load_order = true;
				
				let {data} = await this.$axios.post('/api/order/load',{id:e.id,ec:e.ec});

				e.load_order = false;
				if(data.error) throw data.error;
				return e;
			},
			async ActiveTab(){
				return await this.Order(1);

			},
			TimeConvert(unixtime){
				let time = new Date(unixtime);
				let day = time.getDate();
				let month = time.getMonth()+1;
				let year = time.getFullYear();
				let hour = time.getHours();
				let minute = time.getMinutes();
				return day+'/'+month+'/'+year+' '+hour+':'+minute
			},
			async Refresh(){
				try{
					this.refresh_status = true
					let map_load = this.count.map(e=>this.Load(e));
					await Promise.all(map_load);
					await this.Order();
					this.refresh_status = false;
					return this.$message({type:'success',message:'Đã cập nhật danh sách sản phẩm !'})
				}catch(error){
					this.$message({type:'error',message:error});
				}
				
			},
			async Order(page = 1){
				
				
				this.load_data = true;
				
				let {data} = await this.$axios.post('/api/order/get',{accountec_id:this.tab,page});

				this.load_data = false;
				this.orders = data;
			}
		}
	}
</script>
<style scoped>
.el-row{
	background-color: white
}
.item {
	margin-top: 10px;
	margin-right: 40px;
}
</style>