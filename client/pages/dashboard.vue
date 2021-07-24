<template>
	<el-container>
		
		
		<el-aside :width="aside ? 'auto': '220px'">
			<AsideSection/>
		</el-aside>
		<el-container>
			<el-header>
				<HeaderSection/>
			</el-header>
			<el-main>
				<nuxt/>
				
			</el-main>

		</el-container>
	</el-container>
	

</template>
<script>
	import HeaderSection from '~/components/dashboard/container/header';
	import AsideSection from '~/components/dashboard/container/aside';
	import { mapState,mapGetters,mapMutations,mapActions } from 'vuex';
	export default {
		data(){
			return {
				collapse:false
			}
		},
		computed:{
			...mapState('onsite',['aside'])
		},
		components:{HeaderSection,AsideSection}
	}
</script>
<style>

html,body,#app,.homeBox,.el-container{
         /*Set the internal fill to 0, there is no space between several layout elements*/
    padding: 0px !important;
         /*The same is true for external spacing*/
    margin: 0px !important;
         /*Set the height to 100%*/
    height: 100% !important;
    
  }
.el-aside{
	overflow: scroll;
	background-color: #21232f;
	min-height: 700px;
}
.el-header{
	padding: 0 0px;
	background-color: white;
}
.el-main{
	padding: 16px 20px;
	overflow: scroll;
	
	
	
}
.el-container{
	background-color: #dedede;
	
	margin: 0 0;
	padding: 0 0;
	
}
.elc{
	height: 100%;
}
.el-header{
	border-bottom: 1px solid #eaeaea;
}

.el-menu-item, .el-submenu__title,.el-tabs__item,.el-table,.el-link,.el-checkbox__label,.el-form-item__label{
	font-size:16px;
}
</style>

