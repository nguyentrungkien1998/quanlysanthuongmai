<template>
	
	
	<el-col align="left" :span="24" :offset="0">
		<el-link @click="change_aside(!aside)" style="margin-top:20px;margin-left:10px" type="warning" :underline="false" icon="el-icon-s-fold" size="medium" :disabled="false"></el-link>

		<el-breadcrumb style="float:right" separator=" ">
			

			<el-breadcrumb-item>
				<el-popover placement="bottom-start" trigger="click" title="Thông báo" width="200" transition="el-fade-in-linear">
					hello
					<template slot="reference">
						<el-badge :hidden="notification_count === 0" :value="notification_count" :max="100" :is-dot="false" type="danger">
							<el-button style="margin-top:10px" type="text" :plain="true" :circle="true" size="medium" icon="el-icon-message-solid"></el-button>
						</el-badge>
					</template>

				</el-popover>
			</el-breadcrumb-item>
			<el-breadcrumb-item>
				<el-dropdown style="margin-top: 10px" @command="" placement="bottom-end" size="small" trigger="click" :hide-on-click="true" :split-button="true">
					<span>
						<i class="el-icon-user-solid"></i> 
						Anonymous
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item  :divided="false" :disabled="false">


							<el-link class="link" icon="el-icon-user" type="text" :underline="false" href="/dashboard/profile">Profile</el-link>


						</el-dropdown-item>

						<el-dropdown-item  :divided="true" :disabled="false">
							<el-link icon="el-icon-key" type="text" :underline="false" @click="turnOn_dialog" :disabled="false">Cài đặt</el-link>
						</el-dropdown-item>


						<el-dropdown-item :divided="true" :disabled="false">
							<el-link icon="el-icon-switch-button" @click="logout" type="text" :underline="false" :disabled="false">Đăng xuất</el-link>
						</el-dropdown-item>

					</el-dropdown-menu>
				</el-dropdown>




			</el-breadcrumb-item>

		</el-breadcrumb>


		<DialogChangePassword/>

	</el-col>



	

</template>
<script>
	import { mapState,mapGetters,mapMutations,mapActions } from 'vuex';
	import DialogChangePassword from '~/components/dashboard/change-password';

	export default {
		data(){
			return {
				username:'anonymous',
				notification_count:5,
				keyword:''
			}
		},
		components:{DialogChangePassword},
		computed:{
			...mapState('onsite',['aside'])
		},
		methods:{
			...mapMutations('change-password',['turnOn_dialog']),
			...mapMutations('onsite',['change_aside']),
			async logout(){
				await this.$axios.post('/api/account/logout',{device:'1'});
				window.location.href = "/";
				
			}

		}
	}
</script>
<style scoped>
.username{
	margin-top:-40px;
	margin-left: 20px;
	margin-right: 30px;
}
.link{
	color:#606266;
}
.link:hover{
	color:#409EFF;
}


</style>