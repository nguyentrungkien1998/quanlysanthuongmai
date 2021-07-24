<template>
	<div style="border: 1px solid #e4e4e4;border-radius: 5px;background-color: white">
		<el-row :gutter="20">
			<el-col :span="24" :offset="0">
				<div style="width: 100%;height: auto;background-color:#5f5858;margin-bottom: 20px;padding: 10px 0px;color:white;border-top-left-radius: 5px;border-top-right-radius:5px">
					<div style="margin-left:20px">
						Đồng bộ tồn kho
						<el-button style="float: right;margin-right: 10px;margin-top: -5px;background: none;color:white" type="success" icon="el-icon-tickets" :loading="false" :plain="true" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Hướng dẫn</el-button>
					</div>
				</div>
			</el-col>
		</el-row>
		<div style="padding: 0px 10px">
			<el-row :gutter="20">
				<el-col :span="24" :offset="0">
					<el-alert title="Đồng bộ tồn kho" type="success" closable show-icon :center="false" effect="light">
						- Tất cả các sản phẩm liên kết với từ khoá sẽ được đồng bộ cùng 1 giá trị tồn kho <br>
						- Chỉnh sửa lại liên kết bằng cách nhấp vào từ khoá <br>
					</el-alert>
				</el-col>
			</el-row>
			<br>
			<el-row :gutter="20">
				<el-col :span="12" align="left" :offset="0">
					<div style="margin-top: 10px;display: block">
						Có {{list_keyword.length}} từ khoá
					</div>
				</el-col>
				<el-col align="right" :span="12" :offset="0">
					<el-button type="primary" icon="el-icon-download" :loading="false" :plain="true" :round="false" :circle="false" :autofocus="false" size="small" :disabled="false">Tải xuống</el-button>
					<el-button type="primary" icon="el-icon-upload2" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="small" :disabled="false">Tải lên</el-button>
				</el-col>
			</el-row>
			<br>
			<el-row :gutter="20">
				<el-col align="left" :span="24" :offset="0">
					<el-table :data="list_keyword" :max-height="400" :border="true" :highlight-current-row="true" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="light" style="width: 100%">
						<el-table-column label="STT" type="index" align="center" :sortable="false" :fixed="false" width="190"/>

						<el-table-column label="Từ khoá" prop="keyword" align="left" :sortable="false" :fixed="false" width="500">
							<template slot-scope="scope">
								<el-tooltip effect="dark" :content="scope.row.product.length+' sản phẩm liên kết'" placement="top">

									<router-link style="text-decoration: none;color:black" :to="'/dashboard/ton-kho/thiet-lap?id='+scope.row.id"> {{scope.row.keyword}} <i class="el-icon-link"></i></router-link>
								</el-tooltip>
								
								
							</template>
						</el-table-column>
						<el-table-column label="Trạng thái" align="center" width="200">
							<template slot-scope="scope">
								<el-popover placement="top-start" trigger="click" title="Title" width="200" transition="el-fade-in-linear">
									
									<template slot="reference">
										<el-badge  style="margin-top: 10px" :value="10" class="item" type="success">
											
											<el-button type="success" icon="el-icon-check" :loading="false" :plain="true" :round="true" :circle="true" :autofocus="false" size="mini" :disabled="false"></el-button>
										</el-badge>
									</template>
								</el-popover>
								<span style="margin: 0px 7px"></span>
								<el-popover placement="top-start" trigger="click" title="Title" width="200" transition="el-fade-in-linear">
									
									<template slot="reference">
										<el-badge  style="margin-top: 10px" :value="10" class="item" type="danger">
											<el-button type="danger" icon="el-icon-close" :loading="false" :plain="true" :round="true" :circle="true" :autofocus="false" size="mini" :disabled="false"></el-button>
										</el-badge>
									</template>
								</el-popover>
								
								
							</template>
						</el-table-column>

						<el-table-column label="Tồn kho" align="center" width="270">
							<template slot-scope="scope">
								
								<el-input-number @keyup.enter.native="submit" v-model="scope.row.stock"></el-input-number>
								
								
							</template>
						</el-table-column>


					</el-table>
				</el-col>
			</el-row>
			<br>
			<el-row :gutter="20">
				<el-col align="center" :span="24" :offset="0">
					
					<el-button type="primary" icon="el-icon-top" @click="submit" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="medium" :disabled="false">Xác nhận</el-button>
					
					
				</el-col>
			</el-row>
			<br>
			
		</div>
	</div>
</template>
<script>
	export default {
		scrollToTop: true,
		data(){
			return {
				list_shop:[],
				list_keyword:[],
				keyword:'',
				show_empty:false,
				select:[],
				push_key:'',
				accountec_id:'',
				loading_search:false,
				keyword_obj:null,
				stocksave:[]
			}
		},
		created:async function(){
			return await Promise.all([this.LoadAllKeyword()])
		},
		computed:{
			selected(){
				return this.select.map(e=>{
					return {
						id:e.id,
						accountec_id:e.accountec_id,
						ec:e.ec,
						product_id:e.product_id,
						sku:e.sku,
						name:e.name,
						url:e.url
					}
				})
			}
		},
		methods:{
			
			
			async LoadAllKeyword(){
				let {data} = await this.$axios.post('/api/stock/get');
				return this.list_keyword = data.map(e=>{
					e.stock = (e.stock === -1) ? undefined : e.stock; 
					return e;
				});
			},
			async submit(){
				let list_change = this.list_keyword.filter(({stock})=>stock);
				for(let stock_obj of list_change){
					try{
						let {data} = await this.$axios.post('/api/stock/change',stock_obj);
						if(data.error) throw data.error;
						this.$message({type:'success',message:'OK'})
					}catch(error){
						this.$message({type:'error',message:error})
					}
					
				};
				return 
			}

		}
	}
</script>
<style >

</style>