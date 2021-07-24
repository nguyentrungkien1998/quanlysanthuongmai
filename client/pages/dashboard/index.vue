<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="24" :offset="0">
				<h1>Tổng quan</h1>
			</el-col>
		</el-row>
		<br>
		<el-row :gutter="20">

			<el-col :span="6" :offset="0">
				<el-card :body-style="{ padding: '14px','text-align':'center' ,'font-size':'30px'}" shadow="hover">
					<div class="header-card" slot="header">
						DOANH THU THÁNG NÀY
					</div>
					<div>
						
						116,500,000
					</div>
				</el-card>
			</el-col>
			<el-col :span="6" :offset="0">
				<el-card :body-style="{ padding: '14px','text-align':'center' ,'font-size':'30px'}" shadow="hover">
					<div class="header-card" slot="header">
						DOANH THU HÔM NAY
					</div>
					<div>
						
						23,000,000
					</div>
				</el-card>
			</el-col>
			<el-col :span="6" :offset="0">
				<el-card :body-style="{ padding: '14px','text-align':'center' ,'font-size':'30px'}" shadow="hover">
					<div class="header-card" slot="header">
						ĐƠN HÀNG HÔM NAY
					</div>
					<div>
						43
					</div>
				</el-card>
			</el-col>
			<el-col :span="6" :offset="0">
				<el-card :body-style="{ padding: '14px','text-align':'center' ,'font-size':'30px'}" shadow="hover">
					<div class="header-card" slot="header">
						ĐƠN HÀNG CHỜ XỬ LÍ
					</div>
					<div>
						22
					</div>
				</el-card>
			</el-col>
			
		</el-row>
		
	</div>
</template>
<script>
	
	export default {
		data(){
			return {
				message:'',
				roomName:'',
				history:[],
				online:false
			}
		},
		mounted:async function(){
			
			
			


			this.$socket.get('/api/user/subscribe',function(res){
				console.log(res);
			})
			


			this.$socket.on('user',function(data){

				console.log(data);
			})

			
		},
		
		methods:{
			
			async send(){
				let {data} = await this.$axios.post('/api/user/updateUser', { id:'5f26715fcbaca506b1998f9f',name: 'deptraivl' });

			},
			async create_user(){
				this.$socket.post('/api/user/createUser',{name:'asdffasdfdfdsfsdsdfdf'},function(res){
					//console.log(res);
				})
			},
			
			goBack(){
				alert('hello world');
			}
		}
	}
</script>
<style scoped>

</style>