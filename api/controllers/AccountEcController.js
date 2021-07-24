const lazada = require('../services/ec/lazada');
const tiki = require('../services/ec/tiki');
const sendo = require('../services/ec/sendo');
const shopee = require('../services/ec/shopee');



module.exports = {
	'subscribe':async function(req,res){

		let {id_user} = req;
		AccountEc.subscribe(req.socket,[id_user]);
		return res.ok();
		
	},
	'get':async function(req,res){
		try{
			let {id_user} = req;
			let {ec} = req.body;
			let list_ec = ['sendo','tiki','shopee','lazada'];
			if(!list_ec.includes(ec)) throw 'Không tìm thấy sàn thương mại cần truy vấn';
			let data = [];
			if(ec === 'lazada'){
				data = await LazadaEc.find({id_user}).omit(['id_user']);
			}else if(ec === 'shopee'){
				data = await ShopeeEc.find({id_user}).omit(['id_user']);
			}else if(ec === 'sendo'){
				data = await SendoEc.find({id_user}).omit(['id_user']);
			}else if(ec === 'tiki'){
				data = await TikiEc.find({id_user}).omit(['id_user']);
			}
			return res.send(data);
		}catch(error){
			return res.send({error});
		}
	},
	'remove':async function(req,res){
		try{
			let {id_user} = req;
			let {id,ec} = req.body;
			let list_ec = ['sendo','tiki','shopee','lazada'];
			if(!list_ec.includes(ec)) throw 'Không tìm thấy sàn thương mại cần truy vấn';
			if(ec === 'lazada'){
				 await LazadaEc.destroy({id_user,id});
			}else if(ec === 'shopee'){
				 await ShopeeEc.destroy({id_user,id});
			}else if(ec === 'sendo'){
				 await SendoEc.destroy({id_user,id});
			}else if(ec === 'tiki'){
				 await TikiEc.destroy({id_user,id});
			}
			return res.ok();
		}catch(error){
			return res.send({error});
		}
	},
	'get-all':async function(req,res){
		let {id_user} = req;
		let sendo = await SendoEc.find({id_user}).omit(['id_user']);
		let lazada = await LazadaEc.find({id_user}).omit(['id_user']);
		let shopee = await ShopeeEc.find({id_user}).omit(['id_user']);
		let tiki = await TikiEc.find({id_user}).omit(['id_user']);
		return res.send({sendo,lazada,shopee,tiki})
	},
	'countAll':async function(req,res){
		try{
			let {id_user} = req;
			let sendo = await SendoEc.count({id_user});
			let lazada = await LazadaEc.count({id_user});
			let shopee = await ShopeeEc.count({id_user});
			let tiki = await TikiEc.count({id_user});
			return res.send({count:{sendo,lazada,shopee,tiki}})
		}catch(error){
			console.log(error);
			return res.send({error});
		}
	},
	
	
	'lazada':async function(req,res){
		let {id_user,body:{code}} = req;
		try{
			if(!code) throw 'Không nhận dạng được code';
			let {access_token,refresh_token,name,seller_id} = await lazada(code);
			await LazadaEc.destroy({id_user,seller_id});
			let data = await LazadaEc.create({id_user,access_token,refresh_token,seller_id,name}).fetch();
			AccountEc.publish([id_user],data);
			return res.ok();
		}catch(error){
			console.log(error);
			AccountEc.publish([id_user],{error});
			return res.send({error});
		}
	},
	'tiki':async function(req,res){
		let {id_user,body:{code}} = req;
		try{
			if(!code) throw 'Không nhận dạng được code';
			let data_tiki = await tiki(code);
			let {access_token,name,refresh_token,sid} = data_tiki;
			await TikiEc.destroy({id_user,sid});
			let data = await TikiEc.create({id_user,refresh_token,sid,access_token,name}).fetch();
			AccountEc.publish([id_user],data);
			return res.ok()
		}catch(error){
			console.log(error);
			AccountEc.publish([id_user],{error});
			return res.send({error});
		}

	},
	'sendo':async function(req,res){
		let {shop_key,secret_key} = req.body;
		let {id_user} = req;
		try{
			
			if(!shop_key || !secret_key) throw 'Mã Shop hoặc Mã bảo mật không chính xác .';
			let {token,name} = await sendo(shop_key,secret_key);
			await SendoEc.destroy({id_user,shop_key});
			let data = await SendoEc.create({id_user,token,name,shop_key,secret_key}).fetch();
			return res.send({success:true,...data})
		}catch(error){
			console.log(error)
			return res.send({error});
		}
	},
	'shopee':async function(req,res){
		
		let {id_user,body:{shopid}} = req;
		try{
			if(!shopid) throw 'Không nhận dạng được shopid';
			let data_shopee = await shopee(shopid);
			let {name} = data_shopee;
			await ShopeeEc.destroy({id_user,shopid});
			let data = await ShopeeEc.create({id_user,shopid,name}).fetch();
			AccountEc.publish([id_user],data);
			return res.ok()
		}catch(error){
			console.log(error);
			AccountEc.publish([id_user],{error});
			return res.send({error});
		}

	}
};

