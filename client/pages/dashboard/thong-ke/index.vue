<template>
	<el-row :gutter="20">
	    <el-col :span="24" :offset="0">
				{{user}}
		</el-col>
	</el-row>
</template>
<script>
	export default {
		data(){
			return {

			}
		},
		methods:{
			
		},
		async asyncData({ $axios, $route }){
			let {data} = await $axios.get('/api/account/permission');
			let check = data.map(({slug})=>slug).includes('quan-li-tai-khoan');
			if(!check) return $route.push('/')
		}
	}
</script>
<style scoped>
	
</style>