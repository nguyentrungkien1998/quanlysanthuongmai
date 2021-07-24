<template>
	<el-row style="padding: 0px 10px;margin-top: 20px" v-if="!ec.select" :gutter="20">

		<el-col v-for="(data,index) in ec.list" :key="index" :span="8" :offset="0">

			<el-card @click.native="selectEc(data)"  class="card_ec" :body-style="{ padding: '0px' }" shadow="hover">
				<div slot="header" style="width: 100%;">
					<img style="height: 28px" :src="LoadImg(data)">

				</div>

			</el-card>
		</el-col>
	</el-row>
</template>
<script>
	export default {
		data(){
			return {
				ec:{
					list:['lazada','shopee','sendo'],
					select:null
				},
			}
		},
		created:async function(){

		},
		methods:{
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
			async selectEc(name_ec){
				
				return this.$router.push('/dashboard/san-pham/tao-san-pham/'+name_ec);
				
			},
		}
	}
</script>
<style scoped>
.card_ec{
	cursor: pointer;
}
</style>