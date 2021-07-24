let allow_path = ['/dang-ki','/gioi-thieu','/dieu-khoan','/dang-nhap','/'];
export default async function ({route:{path},$auth, store, redirect }) {
	try{
		
		let {data} = await store.$axios.get('/api/account/info');
		let isLogged = data.id;
		let dashboard_path = !allow_path.includes(path);



		if(isLogged && dashboard_path){
			return;
		}else if(isLogged && !dashboard_path){
			return redirect('/dashboard');
		}else if(!isLogged && dashboard_path){
			return redirect('/dang-nhap')
		}else if(!isLogged && !dashboard_path){
			return;
		}
		return;
	}catch(error){
		console.log(error);
	}
	

}