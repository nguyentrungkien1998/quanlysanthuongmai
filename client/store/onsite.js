export const strict = false;
export const state = ()=> ({
	aside:false,
	count:{sendo:0,lazada:0,tiki:0,shopee:0},

});
export const mutations = {
	change_aside(state,val){
		state.aside = val;
	},
	setCount(state,val){
		state.count = val;
	}
	
};
export const getters = {
	getCount:(state)=>ec=>{
		return state.count[ec.toLowerCase()];
	}
};
export const actions =  {

	async getCountAccountEc({ commit }){
		
		let {data} = await this.$axios.post('/api/accountec/countAll');
		return commit('setCount',data.count);
	}
};