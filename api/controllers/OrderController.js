const Lazada = require('../services/order/lazada');
const Sendo = require('../services/order/sendo');
const Tiki = require('../services/order/tiki');
const Shopee = require('../services/order/shopee');

module.exports = {
	'get':async function(req,res){
		let {id_user} = req;
		let {page,accountec_id} = req.body;
		page = page || 1;
		let where = {id_user,accountec_id};
		let data = await Order.find({where,limit:8,skip:(page-1)*8,omit:['id_user']}).sort('time DESC');
		return res.send(data);
	},
	'set':async function(req,res){
		let {id_user} = req;
		let {data} = req.body;
		
	},
	'count':async function(req,res){
		try{
			let {id_user} = req;
			let SendoShops = await SendoEc.find({id_user}).omit(['id_user','token','shop_key','secret_key']);
			let ShopeeShops = await ShopeeEc.find({id_user}).omit(['id_user','shopid']);
			let TikiShops = await TikiEc.find({id_user}).omit(['id_user','access_token','refresh_token']);
			let LazadaShops = await LazadaEc.find({id_user}).omit(['id_user','access_token','refresh_token']);



			let list_shop = [...SendoShops.map(e=>{e.ec = 'sendo';return e}),...ShopeeShops.map(e=>{e.ec = 'shopee';return e}),...TikiShops.map(e=>{e.ec = 'tiki';return e}),...LazadaShops.map(e=>{e.ec = 'lazada';return e})];

			let list_order_shop = list_shop.map(async e=>({...e,order_count:await Order.count({accountec_id:e.id})}));
			let result = await Promise.all(list_order_shop);
			return res.send(result)
		}catch(error){
			console.log(error);
			return res.send({error});
		}
		
	},
	'load':async function(req,res){
		try{
			let {id_user} = req;
			let {id,ec} = req.body;
			
			if(ec === 'lazada'){
				let account = await LazadaEc.find({id,id_user});
				if(account.length === 0) throw 'Không tìm thấy tài khoản sàn phù hợp';
				
				await Lazada(account[0].access_token,id,id_user);
			}else if(ec === 'sendo'){
				let account = await SendoEc.find({id,id_user});
				if(account.length === 0) throw 'Không tìm thấy tài khoản sàn phù hợp';
				let run_sendo = await Sendo(account[0].token,id,id_user);
				
			}else if(ec === 'tiki'){
				let account = await TikiEc.find({id,id_user});
				if(account.length === 0) throw 'Không tìm thấy tài khoản sàn phù hợp';
				await Tiki(account[0].access_token,id,id_user);
			}else if(ec === 'shopee'){
				let account = await ShopeeEc.find({id,id_user});
				if(account.length === 0) throw 'Không tìm thấy tài khoản sàn phù hợp';
				await Shopee(account[0].shopid,id,id_user);
			}else{
				throw 'Không tìm thấy sàn';
			}
			return res.ok();
		}catch(error){
			console.log(error);
			
			return res.send({error});
		}
	}

};

