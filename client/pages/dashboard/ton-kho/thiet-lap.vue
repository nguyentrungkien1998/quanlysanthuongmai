<template>
	<div style="border: 1px solid #e4e4e4;border-radius: 5px;background-color: white">
		
		<el-row :gutter="20">
			<el-col :span="24" :offset="0">
				
				
				<div style="width: 100%;height: auto;background-color:#5f5858;margin-bottom: 20px;padding: 10px 0px;color:white;border-top-left-radius: 5px;border-top-right-radius:5px">
					<div style="margin-left:20px">
						<template v-if="$route.query.id">
							<router-link style="text-decoration: none;color:#e6a23b" to="/dashboard/ton-kho/dong-bo"> <i class="el-icon-back"></i> Quay lại</router-link>
							<span style="margin:0px 10px">|</span>
						</template>

						Thiết lập từ khoá liên kết <el-tag @close="reset" v-if="id" type="warning" style="background: none;margin-left:10px" :closable="true" effect="light" size="small" :disable-transitions="false">{{keyword}}</el-tag>
						<el-button style="float: right;margin-right: 10px;margin-top: -5px;background: none;color:white" type="success" icon="el-icon-tickets" :loading="false" :plain="true" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Hướng dẫn</el-button>
					</div>
				</div>
			</el-col>
		</el-row>
		<el-row :gutter="20">
		    <el-col :span="24" :offset="0">
					<el-alert title="Thiết lập từ khoá liên kết sản phẩm" type="success" closable show-icon :center="false" effect="light">
						- Liên kết các sản phẩm giống nhau ở các cửa hàng đang bán bằng Tên của sản phẩm (Từ khoá tìm kiếm sản phẩm) <br>
						- Nhập từ khoá vào ô tìm kiếm sau đó nhấn vào nút "Tìm kiếm" hệ thống sẽ tìm ở các cửa hàng tất cả các sản phẩm CÓ CHỨA từ khoá đó  <br>
						- Liên kết sản phẩm bằng cách Tick vào từng sản phẩm,sau đó nhấn vào nút "Ghép sản phẩm" ở dưới cùng là sản phẩm sẽ được liên kết chung 1 tồn kho. 
					</el-alert>
			</el-col>
		</el-row>
		<br>
		<div style="padding: 0px 10px">
			<el-row :gutter="20">
				<el-col :span="24" :offset="0">
					Danh sách từ khoá : <br> <br>
					<el-select v-model="keyword_obj" @change="select_keyword" placeholder="Chọn" filterable :allow-create="false" :multiple="false" :collapse-tags="false" :clearable="false" :disabled="false">
						<el-option v-for="(data,index) in list_keyword" :key="index" :label="data.keyword" :value="JSON.stringify(data)" :disabled="false">{{data.keyword}}</el-option>
					</el-select>
				</el-col>
			</el-row>
			<br>
			<el-row :gutter="20">
				<el-col align="center" :span="24" :offset="0">


					<el-input placeholder="Nhập từ khoá tên sản phẩm" @keyup.native.enter="Search" v-model="keyword" size="medium" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
					<br> <br>

					<el-button @click="Search" type="primary" icon="" :loading="loading_search" :plain="false" :round="false" :circle="false" :autofocus="false" size="small" :disabled="false">Tìm kiếm</el-button>
					<el-popconfirm title="Bạn có chắc chắn ?" @onConfirm="removeKeyword" confirmButtonText='OK' cancelButtonText='Không,cảm ơn.' icon="el-icon-info" iconColor="red">

						<el-button v-if="id" slot="reference" type="danger" icon="" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="small" :disabled="false">Xoá,gỡ bỏ</el-button>
					</el-popconfirm>
					

				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col align="right" :span="24" :offset="0">
					<el-switch v-model="show_empty" :disabled="false"></el-switch> Thu gọn
				</el-col>
			</el-row>

			<el-row :gutter="20">
				<el-col v-for="(shop,index) in list_shop" :key="index" v-if="shop.list.length > 0 ? true : !show_empty"  :span="4" :offset="0">
					<el-card style="margin-top: 20px;height: 300px;" :body-style="{ padding: '0px' }" shadow="hover">
						<div slot="header">
							<img style="width: 60px" :src="LoadImg(shop.ec)">
							<br>
							{{shop.name}}
						</div>
						<div>
							
							<el-autocomplete
							v-model="shop.push_key"
							@focus="SetShop(shop)"
							:fetch-suggestions="querySearchAsync"
							placeholder="Tìm kiếm ..."
							prefix-icon="el-icon-search"
							size="small"
							@select="push_option"
							></el-autocomplete>
							<div :style="'background-color:'+(shop.list.length > 0 ? 'white':'#f9f9f9')" style="height: 174px;padding-top: 10px;padding-left: 10px;overflow-x: scroll;overflow-y: scroll;">
								<div v-if="shop.list.length === 0" style="padding: 50px;color:#bfbfbf">
									<i class="el-icon-shopping-cart-2"></i>
									Trống
								</div>
								<el-checkbox-group v-model="select">


									<el-checkbox style="margin-bottom: 5px" v-for="(product,index) in shop.list" :key="index" :label="product" :disabled="product.keyword_combine" :value="product" :border="false">
										<el-tooltip :disabled="!product.keyword_combine" effect="dark" :content="`Đã liên kết với từ khoá: '`+product.keyword_combine+`'`" placement="left">

											<el-link target="_blank" type="primary" :underline="false" :disabled="product.keyword_combine">{{product.name}}</el-link>
										</el-tooltip>




										<el-link :href="product.url" icon="el-icon-view"  target="_blank" type="warning" :underline="false" :disabled="false"></el-link>

									</el-checkbox>

								</el-checkbox-group>
							</div>


						</div>
					</el-card>
				</el-col>
			</el-row>
			<br><br>
			<el-row :gutter="20">
				<el-col align="center" :span="24" :offset="0">
					<el-button @click="combine" type="primary" icon="el-icon-paperclip" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="medium" :disabled="false">Ghép sản phẩm</el-button>

				</el-col>
			</el-row>
			<br><br><br>
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
				stocksave:[],
				id:''
			}
		},
		created:async function(){

			await Promise.all([this.LoadAllAccountEc(),this.LoadAllKeyword(),this.LoadStockSave()]);
			let id = this.$route.query.id;

			if(id){
				let value = this.list_keyword.find(e=>e.id === id);
				if(value) this.select_keyword(value);
				this.id = id;
			};
			return ;
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
			
			async removeKeyword(){
				let _ = this;
				let {data} = await this.$axios.post('/api/stock/remove',{id:_.id});
				this.list_keyword = this.list_keyword.filter(e=>e.keyword !== _.keyword);
				this.stocksave = this.stocksave.filter(e=>e.keyword !== _.keyword);
				this.$router.push('/dashboard/ton-kho/thiet-lap');
				this.keyword = '';
				this.select = [];
				this.list_shop = this.list_shop.map(e=>{
					e.list = [];
					return e
				});
				return;


			},
			async LoadStockSave(){
				let {data} = await this.$axios.post('/api/stock/get-stocksave');
				return this.stocksave = data;
			},
			select_keyword(value){
				
				let {keyword,product,id} = (typeof value === 'object') ? value : JSON.parse(value);
				this.id = id;
				this.keyword = keyword;
				this.select = product;
				
				this.list_shop = this.list_shop.map(e=>{
					e.list = product.filter(i=>i.accountec_id === e.id);
					return e
				})
			},
			async combine(){
				try{
					let {data} = await this.$axios.post('/api/stock/set',{keyword:this.keyword,product:this.selected,id:this.id});
					if(data.error) throw data.error;
					this.list_keyword = this.list_keyword;
					this.list_keyword.push(data);
					
					this.LoadStockSave();
					this.$message({type:'success',message:'Ghép sản phẩm Thành công !'});
					this.$router.push('/dashboard/ton-kho/dong-bo');
					return;

				}catch(error){
					this.$message({type:'error',message:error});
				}
				

			},
			async LoadAllKeyword(){
				let {data} = await this.$axios.post('/api/stock/get');
				return this.list_keyword = data;
			},
			SetShop(shop){

				return this.accountec_id = shop.id;
			},
			querySearchAsync(queryString, cb){
				let _ = this;
				let list_id_procduct = _.list_shop.find(({id})=>_.accountec_id === id).list.map(e=>e.id);
				
				_.$axios.post('/api/product/search',{keyword:queryString,accountec_id:this.accountec_id}).then(({data})=>{
					data = _.check_combine(data);
					
					data = data.map(e=>{
						e.value = e.name;
						return e;
					}).filter(e=>!list_id_procduct.includes(e.id));
					
					return cb(data);

				});

			},
			push_option(data){
				let _ = this;
				_.list_shop.map(e=>{
					
					if(e.id === _.accountec_id){
						let find_element = e.list.find(e=>e.id === data.id);
						if(!find_element) e.list.push(data)

					};
				return e;
			})
				_.list_shop.map(e=>{
					if(e.id === _.accountec_id) e.push_key ='';
					return e;
				});


			},
			LoadImg(ec){
				if(ec === 'lazada'){
					return 'https://res.cloudinary.com/doo4xi4rh/image/upload/v1596352417/lazada_iwt280.png';
				}else if(ec === 'sendo'){
					return 'https://res.cloudinary.com/dtll0jawl/image/upload/v1601083584/ta%CC%89i_xuo%CC%82%CC%81ng_ezrkiq.png';
				}else if(ec === 'shopee'){
					return 'https://res.cloudinary.com/doo4xi4rh/image/upload/v1596620226/shopee_digvyt.png';
				}else if(ec === 'tiki'){
					return 'https://res.cloudinary.com/doo4xi4rh/image/upload/v1596678094/ta%CC%89i_xuo%CC%82%CC%81ng_ccxrej.png';
				}
			},
			async LoadAllAccountEc(){
				let {data} = await this.$axios.post('/api/accountec/get-all');
				return this.list_shop = data.map(e=>{
					e.select = [];
					e.list = [];
					e.push_key = '';
					return e;
				});
			},
			reset(){
				this.select = [] ;
				this.keyword = '';
				this.keyword_obj = null;
				this.id = '';
				return this.list_shop.map(e=>{
					e.list = [];
					e.select = [];
					return e;
				});
			},
			check_combine(data){
				let _ = this;
				return data.map(e=>{
					e.keyword_combine = _.stocksave.find(({product_id})=>e.id === product_id) ? _.stocksave.find(({product_id})=>e.id === product_id).keyword : false;
					return e;
				});

			},
			async Search(){
				let _ = this;
				_.loading_search = true;
				_.reset();
				let {data} = await _.$axios.post('/api/product/search',{keyword:_.keyword});
				data = _.check_combine(data);
				for(let product of data){
					_.list_shop.map(e=>{
						if(e.id === product.accountec_id){
							e.list.push(product);
							if(!product.keyword_combine) _.select.push(product)
						};
					return e;
				})
				};
				_.loading_search = false;
				
			}

		}
	}
</script>
<style scoped>

</style>