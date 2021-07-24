<template>
	
	<el-menu :unique-opened="true" :router="true" active-text-color="white" :collapse-transition="true" :default-active="$route.path" :collapse="aside"  mode="vertical">
		<center>
			<el-image style="width: 50px" class="logo" src="https://res.cloudinary.com/doo4xi4rh/image/upload/v1596330699/seuvn_tysh5p.png"></el-image>
		</center>
		<center>
			<el-tag type="danger" :closable="false" effect="plain" size="small" :disable-transitions="false">Miễn Phí 365</el-tag>
		</center>
		<br>
		<el-menu-item :index="'/dashboard'">
			<i class="el-icon-pie-chart"></i>
			<span>Tổng Quan</span>
		</el-menu-item>

		<el-menu-item :index="'/dashboard/don-hang'">
			<i class="el-icon-finished"></i>
			
			<span>Đơn hàng</span> <el-badge style="margin-left:20px" class="mark" :value="12" />
			
		</el-menu-item>
		

		<el-submenu :index="'/dashboard/san-pham/'" :default-active="$route.path" :router="true">
			<template slot="title">
				<i class="el-icon-shopping-cart-2"></i>
				<span>Sản phẩm</span>
			</template>
			<el-menu-item-group title="Quản lí">
				<el-menu-item :index="'/dashboard/san-pham/tat-ca'" align="left">
					<span>Tất cả sản phẩm</span>
				</el-menu-item>
				<el-menu-item :index="'/dashboard/san-pham/tao-san-pham'" align="left">
					<span>Tạo mới</span>
				</el-menu-item>
				
			</el-menu-item-group>

		</el-submenu>

		<el-submenu :index="'/dashboard/ton-kho'" :default-active="$route.path" :router="true">
			<template slot="title">
				<i class="el-icon-sell"></i>
				<span>Tồn kho</span>
			</template>
			<el-menu-item-group title="Cập nhật">
				<el-menu-item :index="'/dashboard/ton-kho/dong-bo'" align="left">
					<span>Đồng bộ</span>
				</el-menu-item>
				<el-menu-item :index="'/dashboard/ton-kho/thiet-lap'" align="left">
					<span>Thiết lập</span>
				</el-menu-item>
			</el-menu-item-group>

		</el-submenu>

		<el-submenu :index="'/dashboard/ban-chay'" :default-active="$route.path" :router="true">
			<template slot="title">
				<i class="el-icon-s-data"></i>
				<span>Trending</span>
			</template>
			<el-menu-item-group title="Theo dõi">
				<el-menu-item :index="'/dashboard/ban-chay/link-san-pham'" align="left">
					<span>Sản phẩm</span>
				</el-menu-item>
				
			</el-menu-item-group>

		</el-submenu>


		
		<el-submenu :index="'/dashboard/san-thuong-mai'" :default-active="$route.path" :router="true">
			<template slot="title">
				<i class="el-icon-s-shop"></i>
				<span>Sàn Thương Mại</span>
			</template>
			<el-menu-item-group title="Tài khoản sàn">
				<el-menu-item v-for="(data,i) in ec" :index="data.path" :key="i" align="left">
					<span>{{data.name}}</span>
					<el-tag align="right" :type="getCount(data.name) > 0 ? 'success' : 'info'" class="tag-ec" :closable="false" effect="dark" size="mini" :disable-transitions="false">{{getCount(data.name)}}</el-tag>
				</el-menu-item>
			</el-menu-item-group>

		</el-submenu>
		<el-menu-item :index="'/dashboard/phan-quyen'">
			<i class="el-icon-s-custom"></i>
			<span>Phân quyền</span>
		</el-menu-item>

		<el-menu-item :index="'/dashboard/ho-tro'">
			<i class="el-icon-phone-outline"></i>
			<span>Hỗ trợ tư vấn</span>
		</el-menu-item>
		
	</el-menu>

</template>
<script>
	import { mapState,mapGetters,mapMutations,mapActions } from 'vuex';
	export default {
		props:['collapse'],
		data(){
			return {
				ec:[
				{name:'Lazada',path:'/dashboard/san-thuong-mai/lazada',color:'orange'},
				{name:'Shopee',path:'/dashboard/san-thuong-mai/shopee',color:'#fb7601'},
				{name:'Sendo',path:'/dashboard/san-thuong-mai/sendo',color:'red'},
				{name:'Tiki',path:'/dashboard/san-thuong-mai/tiki',color:'#489ee8'},

				]
			}
		},
		computed:{
			...mapState('onsite',['aside','count'])
		},
		created:async function(){
			return await this.getCountAccountEc();
		},
		methods:{
			...mapActions('onsite',['getCountAccountEc']),
			getCount(ec = '' ){
				return this.count[ec.toLowerCase()]
			}
		}
	}
</script>
<style>
.el-submenu__title:hover{
	background:#6c6e7b;
	color:white;
}
.el-menu-item:focus, .el-menu-item:hover{
	background-color:#6c6e7b;
	color:white;
}
.logo{
	margin-top:10px;
	margin-bottom: 10px;

	margin-right: 9px;

	
}
.el-menu{
	background-color: #21232f;
}
.el-menu-item{
	color:#bdbdbd;
}
.el-submenu__title{
	color:#bdbdbd;
}
.el-menu-item-group{
	color:#bdbdbd;
}
.tag-ec{
	font-size:14px;
}

</style>