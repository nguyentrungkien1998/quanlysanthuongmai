<template>
	<el-row :gutter="20">
		
		<el-col :span="24" :offset="0">
			<h1>Tất Cả Sản Phẩm</h1>
			<br>
			<el-row :gutter="5">
				
				<el-col align="left" :span="14" :offset="0">
					<el-popover placement="bottom-start" trigger="click" title="Lọc :" width="200" transition="el-fade-in-linear">
						<el-checkbox label="Hết hàng" :border="false" :checked="false" :disabled="false"></el-checkbox> 
						

						<el-button slot="reference" type="default" icon="el-icon-s-operation" :loading="false" :plain="true" :round="false" :circle="false" :autofocus="false" size="medium" :disabled="false">Lọc sản phẩm</el-button>
					</el-popover>


					<el-button type="default" icon="el-icon-refresh-left"  @click="Refresh" :loading="refresh_status" :plain="true" :round="false" :circle="false" :autofocus="false" size="medium" :disabled="false">Cập nhật</el-button>
					<el-popconfirm title="Bạn có chắc chắn?" @onConfirm="" confirmButtonText='OK' cancelButtonText='Không,cảm ơn.' icon="el-icon-info" iconColor="red">

						<el-button slot="reference" type="default" icon="el-icon-download
						" :loading="false" :plain="true" :round="false" :circle="false" :autofocus="false" size="medium" :disabled="false">Xuất Excel</el-button>
					</el-popconfirm>


					
					
				</el-col>
				
				<el-col align="right" :span="8" :offset="0">
					
					<el-input @keyup.enter.native= "SearchProduct" v-model="search" spellcheck="false" placeholder="Nhập tên sản phẩm,SKU..."size="medium" clearable type="text" :autosize="false" :disabled="false" autocomplete="on">
						<template slot="prepend">
							<el-popover placement="top-start" trigger="click" width="200" transition="el-fade-in-linear">
								<p>Quét theo:</p>
								<el-radio-group v-model="filter.type">
									<el-radio label="name" :disabled="false" :border="false" size="small">Tên sản phẩm</el-radio>
									<br>
									<el-radio label="sku" :disabled="false" :border="false" size="small">SKU</el-radio>
								</el-radio-group>


								<p>Vùng quét:</p>

								<el-radio-group v-model="filter.tab">
									<el-radio label="all" :disabled="false" :border="false" size="small">Tất cả cửa hàng</el-radio>
									<br>
									<el-radio label="one" :disabled="false" :border="false" size="small">Cửa hàng hiện tại</el-radio>
								</el-radio-group>
								<template  slot="reference" >
									<el-tooltip content="Tùy chỉnh tìm kiếm" effect="plain" placement="top">
										<el-button type="info" icon="el-icon-setting" :loading="false" :plain="true" :round="false" :circle="false" :autofocus="false" size="small" :disabled="false"></el-button>
									</el-tooltip>
								</template>





							</el-popover>
						</template>
					</el-input>
					
				</el-col>
				<el-col align="right" :span="2" :offset="0">
					<el-button type="default" @click="SearchProduct" icon="el-icon-search" :loading="search_status" :plain="true" :round="false" :circle="false" :autofocus="false" size="medium" :disabled="false">Tìm kiếm</el-button>
				</el-col>
			</el-row>
			<br>

			<el-row :gutter="20">
				<el-col align="center" :span="24" :offset="0">
					
					<el-tabs @tab-click="ActiveTab" v-model="tab" type="border-card">
						
						<el-tab-pane
						v-for="(item, index) in shops"
						:key="index"

						:name="item.id"
						>
						<template slot="label">
							<div>
								<img style="width:20px;margin-bottom: -5px" :src="image_ec(item.ec)">
								<el-tooltip :content="item.ec.toUpperCase()" effect="dark" placement="top">

									<span style="margin-left: 5px">

										{{item.name}} 

										<i v-if="!item.load_status"  class="el-icon-loading"></i>
										
										<el-tag v-if="item.load_status" :type="((item.count > 0) && searched) ? 'success' : (((item.count > 0) && !searched) ? 'info' : 'danger')" effect="plain" size="mini" :disable-transitions="false">{{item.count}}</el-tag>

									</span>
								</el-tooltip>
							</div>
						</template>
						
						<el-table  v-loading="load_data" ref="data" :data="products" max-height="1200" :border="true" :highlight-current-row="true" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="light" style="width: 100%">
							

							<el-table-column label="" prop="" align="center" :sortable="false" :fixed="false" width="170">
								<template slot-scope="scope">
									<el-image style="width: 80px;":src="scope.row.image">
										<div style="display: block;width: 80px;height: 40px;margin-top: 20px" slot="placeholder" class="image-slot">
											<i class="el-icon-loading"></i>
										</div>
									</el-image>
								</template>
							</el-table-column>
							<el-table-column label="Tên sản phẩm" prop="name" align="left" :sortable="false" :fixed="false" width="390">
								<template slot-scope="scope">
									<el-link target="_blank" :href="scope.row.url" icon="" type="default" :underline="true" :disabled="false">{{scope.row.name}}</el-link>

								</template>
							</el-table-column>
							<el-table-column label="SKU" prop="sku" align="center" :sortable="false" :fixed="false" width="150"></el-table-column>
							<el-table-column label="Giá bán" prop="price" align="center" :sortable="false" :fixed="false" width="180">
								<template slot-scope="scope">
									<el-popover trigger="click" placement="top-start" title="Chỉnh giá : " width="150" transition="el-zoom-in-center">
										<Money :max='1000000000' :placeholder="scope.row.price" @keyup.enter.native="UpdatePrice(scope.row)" v-model="scope.row.price_new" size="medium" :disabled="!scope.row.active"  :min='0' :fixed='0' clearable></Money>
										
										<br> <br>
										<center>
											<el-button @click="UpdatePrice(scope.row)" type="primary" icon="" :loading="edit_price_status" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="!scope.row.active">Sửa giá</el-button>
										</center>
										<el-button slot="reference" type="default" icon="" :loading="false" :plain="true" :round="false" :circle="false" :autofocus="false" size="medium" :disabled="false">{{scope.row.price.toLocaleString()}}</el-button>
									</el-popover>

									


								</template>
							</el-table-column>
							<el-table-column label="Tồn kho" prop="quantity" align="center" :sortable="false" :fixed="false" width="90">
								<template slot-scope="scope" >



									{{scope.row.quantity === 0 ? 'Hết hàng': scope.row.quantity}}
								</template>
							</el-table-column>
							<el-table-column label="Trạng thái" align="center" width="140">
								<template slot-scope="scope">
									<el-tooltip content="Đang hoạt động" effect="dark" placement="top">
										<i style="color:green" v-if="scope.row.active" class="el-icon-check"></i>
									</el-tooltip>
									<el-tooltip content="Ngừng hoạt động" effect="dark" placement="top">
										<i style="color:red" v-if="!scope.row.active" class="el-icon-close"></i>
									</el-tooltip>


								</template>
							</el-table-column>
						</el-table>
						<br>
						<el-row :gutter="20">
							<el-col :span="24" :offset="0" align="right">
								<el-pagination @current-change="Product" :total="shops.find(({id})=>id === tab) ? (shops.find(({id})=>id === tab)).count : 0" :page-count="6" :hide-on-single-page="false" small background layout="prev, pager, next"></el-pagination>

							</el-col>
						</el-row>
						<br>
					</el-tab-pane>


				</el-tabs>






			</el-col>
		</el-row>



		<br>
	</el-col>
</el-row>
</template>
<script>
	import Money from '~/components/dashboard/other/money';
	export default {
		components:{Money},
		data(){
			return {
				products:[],
				shops:[],
				page:1,
				count:0,
				list_ec:['lazada','shopee','sendo','tiki'],
				search:'',
				search_status:false,
				searched:false,
				filter:{
					tab:'all',
					type:'name'
				},
				ec:'Tổng hợp',
				tab:null,
				load_data:false,
				refresh_status:false,
				price_new:'',
				edit_price_status:false

			}
		},
		created:async function(){
			
			await Promise.all([this.Init()]);
			
		},
		
		methods:{

			async GetAllShop(search = null){
				let {data} = await this.$axios.post('/api/accountec/get-all');
				data = [...data.lazada.map(e=>{e.ec = 'lazada';return e}),...data.tiki.map(e=>{e.ec = 'tiki';return e}),...data.shopee.map(e=>{e.ec = 'shopee';return e}),...data.sendo.map(e=>{e.ec = 'sendo';return e})]
				this.shops = data;
				let load_shop = await Promise.all(data.map(async e=>({...e,load_status:true,count: await this.Count(e.id,search)})));
				
				this.shops = this.searched ? load_shop.sort((a, b) => (a.count > b.count) ? -1 : 1) : this.list_ec.reduce(((previous,current)=>[...previous,...load_shop.filter(({ec})=>ec === current)]),[]);
				return;
			},
			async Count(accountec_id,search){
				let {data:{count}} = await this.$axios.post('/api/product/count',{accountec_id,search});
				return count;
			},
			async Init(){
				await this.GetAllShop();
				this.tab = this.shops[0].id;
				await this.Product();
				await this.LoadPending();
				return;
				
			},
			async LoadPending(){
				let _ = this;
				let {data} = await this.$axios.post('/api/pending/get',{section:'product'});
				let id_pending = data.map(({accountec_id})=>accountec_id);
				let Load_map = this.shops.filter(({id})=>id_pending.includes(id)).map(e=>_.Load(e));
				let result_Load_map = await Promise.all(Load_map);
				let list_remove = result_Load_map.filter(({success})=>success);
				let map_remove = list_remove.map(({id})=>_.DeletePending(id));

				return await Promise.all(map_remove);
			},
			async DeletePending(accountec_id){
				return await this.$axios.post('/api/pending/remove',{accountec_id,section:'product'});

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
			
			async Load(e){

				try{
					e.load_status = false;
					e.count = 0;
					let {data} = await this.$axios.post('/api/product/reload',{id:e.id,ec:e.ec});
					if(data.error) throw data.error;
					e.load_status = true;
					e.count = await this.Count(e.id);
					if(e.id === this.tab) await this.Product();
					return {success:true,...e};
				}catch(error){
					this.$message({type:'error',message:error});
					return {success:false};
				};
				
			},
			async ActiveTab(){
				let keysearch = this.searched ? this.search.replace(/ /g,'').toLowerCase() : null;
				return await this.Product(1,keysearch);
			},
			
			async Refresh(){
				this.refresh_status = true
				this.search = '';
				this.searched = false;
				let make_load = this.shops.map(e=>this.Load(e));
				await Promise.all(make_load);
				this.refresh_status = false;
				return this.$message({type:'success',message:'Đã cập nhật danh sách sản phẩm !'})
			},
			async SearchProduct(){
				this.search_status = true;
				this.searched = true;
				let keysearch = this.search.replace(/ /g,'').toLowerCase();
				await this.GetAllShop(keysearch);
				this.tab = this.shops[0].id;
				await this.Product(1,keysearch);
				this.search_status = false;
				return this.$message({type:'success',message:'Đã quét hoàn thành'})
			},
			async UpdatePrice(e){
				this.edit_price_status = true;
				try{
					if(parseInt(e.price) === parseInt(e.price_new)) throw 'Giá mới và Giá cũ trùng nhau.';
					let {price_new,price,accountec_id,product_id,id,quantity,ec} = e;
					let {data} = await this.$axios.post('/api/edit/price',{price_new,accountec_id,product_id,ec});
					if(data.error) throw data.error;
					e.price_new = '';
					this.products = this.products.map(e=>{
						if(e.id === id) e.price = parseInt(price_new).toLocaleString();
						return e
					})
					this.$message({type:'success',message:'Chỉnh sửa giá thành công'})
				}catch(error){
					this.$message({type:'error',message:error,duration:error.length > 50 ? 15000 : 3000});
				};
				this.edit_price_status = false;
				return;

			},
			async Product(page = 1,search = null ){
				let {data} = await this.$axios.post('/api/product/get',{page,accountec_id:this.tab,search});
				this.products = data.map(e=>{
					e.visible_editor = false;
					return e;
				});
				return;
			}
		}
	}
</script>
<style>


</style>