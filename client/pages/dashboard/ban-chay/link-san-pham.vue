<template>
	<el-row :gutter="20">
		<el-col :span="24" :offset="0">
			<el-row :gutter="20">
				<el-col :span="12" :offset="0">
					<h1>Theo dõi giá sản phẩm</h1>
				</el-col>
				<el-col :span="12" align="right" :offset="0">
					<el-button @click="add_link_show = true" type="default" icon="" :loading="false" :plain="true" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Thêm Link</el-button>
				</el-col>
			</el-row>
			<el-row :gutter="10">
				<el-col :span="12" :offset="0">
					<el-radio-group @change="Filter" v-model="filter_case" size="medium">
						<el-radio-button label="Mặc định"></el-radio-button>
						<el-radio-button label="Tăng"></el-radio-button>
						<el-radio-button label="Giảm"></el-radio-button>


					</el-radio-group>
				</el-col>
				<el-col align="right" :span="6" :offset="3">
					<el-input @keyup.enter.native="Search" placeholder="Nhập từ khóa sản phẩm" v-model="keysearch" size="medium" prefix-icon="" type="text" :autosize="false" :disabled="false" autocomplete="true"></el-input>
				</el-col>
				<el-col align="right" :span="3" :offset="0">
					<el-button type="primary" @click="Search" icon="el-icon-search" :loading="search_status" :plain="false" :round="false" :circle="false" :autofocus="false" size="medium" :disabled="false">Tìm kiếm</el-button>

					
				</el-col>
				
			</el-row>
			
			<br>
			<el-row :gutter="20">
				<el-col :span="24" :offset="0">
					<el-tabs @tab-click="moveTab" v-model="ec" type="border-card" tab-position="top" :closable="false" :addable="false" :editable="false" :stretch="false">
						<el-tab-pane v-for="(ec,index) in ec_list" :key="index" :label="ec.slice(0,1).toUpperCase()+ec.slice(1).toLowerCase()" :name="ec">
							<el-table  :data="list.filter(e=>e.ec === ec.toLowerCase())" :border="true" :highlight-current-row="true" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="light" style="width: 100%">
								<el-table-column label="Thời gian" align="center" :sortable="false" :fixed="false" width="120">
									<template slot-scope="scope">
										{{formatTime(scope.row.createdAt)}}
									</template>
								</el-table-column>


								<el-table-column label="Tên sản phẩm" align="left" :sortable="false" :fixed="false" width="450">
									<template slot-scope="scope">
										<el-tooltip :content="'ID: '+scope.row.itemId" effect="dark" placement="top">
											<el-link :href="scope.row.link_san_pham" target="_blank"  :underline="false" :disabled="false">{{scope.row.ten_san_pham}}</el-link>
										</el-tooltip>
										
									</template>
								</el-table-column>
								<el-table-column label="Giá bán" align="center" :sortable="false" :fixed="false" width="120">
									<template slot-scope="scope">
										<el-button type="text" :style="scope.row.increase_price > 0 ? 'color:green' : (scope.row.increase_price < 0 ? 'color:red' :'color:#606266')">
											{{parseFloat(scope.row.gia_moi).toLocaleString()}} 

										</el-button>

										<el-tooltip :content="scope.row.increase_price.toLocaleString()" effect="dark" placement="top">
											<el-button type="text">
												<i v-if="scope.row.increase_price > 0" style="color:green" class="el-icon-top"></i> 
												<i v-if="scope.row.increase_price < 0" style="color:red" class="el-icon-bottom"></i>  
											</el-button>
										</el-tooltip>


										
									</template>
								</el-table-column>
								<el-table-column  label="Đã bán" align="center" :sortable="false" :fixed="false" width="100">
									<template slot-scope="scope">
										<el-tooltip :content="'Doanh thu ≈ '+(parseFloat(scope.row.gia_moi)*parseFloat(scope.row.so_luong_da_ban)).toLocaleString()" effect="dark" placement="top">
											<el-button :style="scope.row.increase_stock > 0 ? 'color:green' : (scope.row.increase_stock < 0 ? 'color:red' :'color:#606266')" type="text">{{scope.row.so_luong_da_ban}}   </el-button>
										</el-tooltip>

										<el-tooltip :content="scope.row.increase_stock.toLocaleString()+' sản phẩm'" effect="dark" placement="top">
											<el-button type="text">
												<i v-if="scope.row.increase_stock > 0" style="color:green" class="el-icon-top"></i> 
												<i v-if="scope.row.increase_stock < 0" style="color:red" class="el-icon-bottom"></i>  
											</el-button>
										</el-tooltip>

									</template>
								</el-table-column>
								<el-table-column label="Tên cửa hàng" align="left" :sortable="false" :fixed="false" width="175">
									<template slot-scope="scope">
										<el-link :href="scope.row.link_shop" target="_blank" :underline="false" :disabled="false">{{scope.row.ten_cua_hang}}</el-link>
									</template>
								</el-table-column>
								<el-table-column label="" align="center" :sortable="false" :fixed="false" width="100">
									<template slot-scope="scope">
										<el-button @click="Map_Data(scope.row)" type="default" icon="" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Xem</el-button>    		
									</template>
								</el-table-column>

								<el-table-column label="" align="center" :sortable="false" :fixed="false" width="60">
									<template slot-scope="scope">
										<el-popconfirm title="Bạn có chắc chắn?" @onConfirm="removeLink(scope.row.link_san_pham)" confirmButtonText='OK' cancelButtonText='Không,cảm ơn.' icon="el-icon-info" iconColor="red">
											<el-button slot="reference" type="text" icon="el-icon-delete" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false"></el-button> 
										</el-popconfirm>

									</template>
								</el-table-column>







							</el-table>
							<br>
							<el-row :gutter="20">
								<el-col align="right" :span="24" :offset="0">
									<el-pagination @current-change="movePage" :page-size="8" :total="total_count" :pager-count="11" :hide-on-single-page="false" background layout="prev, pager, next"></el-pagination>	
								</el-col>
							</el-row>
						</el-tab-pane>

					</el-tabs>
				</el-col>
			</el-row>


			<el-dialog title="Nhập Link sản phẩm cần theo dõi" :visible.sync="add_link_show" :center="false" :fullscreen="false" top="15vh" width="50%">
				<el-form @submit.native.prevent ref="form" :rules="ruleForm" :model="formData"  status-icon label-width="auto" label-position="top" :inline="false" :disabled="false" :inline-message="false" show-message validate-on-rule-change size="small">
					<el-form-item label="Link sản phẩm :" prop="link" align="left">
						<el-input placeholder="Nhập link sản phẩm" @keyup.enter.native="addLink" v-model="formData.link" size="medium" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
					</el-form-item>

				</el-form>
				<span slot="footer">
					<el-button @click="cancelLink">Cancel</el-button>
					<el-button :loading="loading_add_link" type="primary" @click="addLink">Confirm</el-button>
				</span>
			</el-dialog>
		</el-col>
		<el-dialog :title="info_product.ten_san_pham" :visible.sync="map_show" :center="true" :fullscreen="false" top="6vh" width="86%">
			<el-row :gutter="20">
				<el-col align="right" :span="12" :offset="0">
					<el-breadcrumb separator="|">
						<el-breadcrumb-item>
							<el-link href="" target="_blank" type="primary" :underline="false" :disabled="false">
								<el-tag type="warning" :closable="false" effect="light" size="medium" :disable-transitions="false"><i class="el-icon-s-home"></i> {{info_product.ten_cua_hang}}</el-tag>
							</el-link>
							
						</el-breadcrumb-item>
						<el-breadcrumb-item>
							<el-tag type="warning" :closable="false" effect="light" size="medium" :disable-transitions="false"><i class="el-icon-s-goods"></i> {{info_product.so_luong_da_ban}} sản phẩm đã bán</el-tag>
						</el-breadcrumb-item>
					</el-breadcrumb>
					
					
					
				</el-col>
			</el-row>
			
			<el-tabs type="border-card">
				<el-tab-pane label="Giá sản phẩm">
				
					<el-chart-line :data="chartdata" :options="options"></el-chart-line>
				
					
				</el-tab-pane>
				<el-tab-pane label="Số lượng bán được">
					<el-chart-line :data="chartstock" :options="options"></el-chart-line>
				</el-tab-pane>
			</el-tabs>
			
			
			
			
			<span slot="footer">
				<el-button @click="cancel_datamap" >Đóng</el-button>

			</span>
		</el-dialog>
	</el-row>
</template>
<script>
	export default {

		data () {
			return {
				ruleForm:{
					link:[{required:true,trigger:'click',message:'Quý khách chưa nhập Link sản phẩm.'}]
				},
				list:[],
				formData:{
					link:'',
				},
				add_link_show:false,
				loading_add_link:false,
				keysearch:'',
				ec_list:['sendo','shopee'],
				ec:'sendo',
				total_count:0,
				search_status:false,
				filter_case:[],
				map_show:false,
				list_price:[],
				chartdata:null,
				chartstock:null,
				options: {
					responsive: true,
					maintainAspectRatio: false
				},
				info_product:{},
				

			}
		},
		computed:{
			

		},
		
		created:async function(){
			return await this.Init();
		},
		methods:{
			formatTime(timestamp){
				let time = new Date();
				let date = time.getDate();
				let month = time.getMonth()+1;
				let year = time.getFullYear();

				return date+'/'+month+'/'+year

			},
			async Init(){
				return await Promise.all([this.getListLink(),this.getCount()]);
			},
			async getCount(){
				let {data} = await this.$axios.post('/api/trendproductlink/count-link',{ec:this.ec});
				return this.total_count = data.count;
			},
			async getListLink(page = 1){
				let {data} = await this.$axios.post('/api/trendproductlink/get-all-link',{ec:this.ec.toLowerCase(),page});
				this.list = data;
				await this.getCount();
			},
			async addLink(){
				let _ = this;
				_.$refs['form'].validate(async valid=>{
					if(valid){
						_.loading_add_link = true;
						try{
							let {data} = await _.$axios.post('/api/trendproductlink/add',{url:_.formData.link});
							if(data.error) throw data.error;
							_.ec = data.ec;
							_.formData.link = '';
							_.add_link_show = false;
							await _.getListLink();

							_.$message({type:'success',message:'Đã thêm url sản phẩm vào danh sách theo dõi.'})
						}catch(message){
							_.formData.link = '';
							_.$message({type:'error',message});
						}
						return _.loading_add_link = false;
					}else{
						return false;
					}
				})
			},
			cancelLink(){
				this.formData.link = '';
				this.add_link_show = false;
			},
			async moveTab(){
				return await this.getListLink();
			},
			async movePage(index){
				return await this.getListLink(index);
			},
			async Search(){
				this.search_status = true;
				let {data} = await this.$axios.post('/api/trendproductlink/search',{keysearch:this.keysearch});
				this.search_status = false;
				return this.list = data;
			},
			async Filter(){

			},
			async removeLink(link_san_pham){
				try{
					let {data} = await this.$axios.post('/api/trendproductlink/remove',{link_san_pham});
					this.list = this.list.filter(e=>e.link_san_pham!== link_san_pham);
					await this.getListLink(1);
					return this.$message({type:'warning',message:'Đã gỡ url khỏi danh sách.'})
				}catch(error){
					return this.$message({type:'danger',message:error})
				}
				let {data} = await this.$axios.post('/api/trendproductlink/remove',{link_san_pham});
				return this.list = this.list.filter(e=>e.link_san_pham!== link_san_pham);
			},
			async Map_Data(obj){
				this.info_product = obj;
				let {data} = await this.$axios.post('/api/trendproduct/data',{link_san_pham:obj.link_san_pham});
				this.map_show = true;
				
				this.chartdata = {
					labels: JSON.parse(JSON.stringify(data)).map(({createdAt})=>(new Date(createdAt)).getDate()+'/'+((new Date(createdAt)).getMonth()+1)),
					datasets: [
					{
						label: "Giá",
						data: JSON.parse(JSON.stringify(data)).map(e=>e.gia_moi),
						borderColor: "#FC2525",
						pointBackgroundColor: "red",
						borderWidth: 1,
						pointBorderColor: "white",
					},
					
					
					]
				};
				this.chartstock = 
				{
					labels: JSON.parse(JSON.stringify(data)).map(({createdAt})=>(new Date(createdAt)).getDate()+'/'+((new Date(createdAt)).getMonth()+1)),
					datasets: [
					{
						label: "Giá",
						data: JSON.parse(JSON.stringify(data)).map(e=>e.gia_moi),
						borderColor: "#FC2525",
						pointBackgroundColor: "red",
						borderWidth: 1,
						pointBorderColor: "white",
					},
					
					
					]
				};

				


			},
			cancel_datamap(){
				this.data_map_link = [];
				this.map_show = false;
			}
		}
	}
</script>
<style scoped>

</style>