/**
 * RefreshEcController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
 const lazada = require('../services/refresh-token/lazada');
 const tiki = require('../services/refresh-token/tiki');
 const shopee = require('../services/refresh-token/shopee');
 const sendo = require('../services/refresh-token/sendo');

 module.exports = {
 	'sendo':async function(req,res){
 		try{
 			let {id_user,body:{id}} = req;

 			let account = await SendoEc.find({id_user,id});
 			if(account.length === 0) throw 'Không tìm thấy tài khoản sàn!';
 			let {shop_key,secret_key} = account[0];
 			let {token,name} = await sendo(shop_key,secret_key);
 			let data = await SendoEc.update({id_user,id}).set({token,name,active:true}).fetch();
 			return res.send({success:true,...data})

 		}catch(error){
 			return res.send({error});
 		}


 	},
 	'lazada':async function(req,res){
 		try{
 			let {id_user,body:{id}} = req;

 			let account = await LazadaEc.find({id_user,id});
 			if(account.length === 0) throw 'Không tìm thấy tài khoản LAZADA';
 			let {access_token,refresh_token,name} = await lazada(account[0].refresh_token);
 			let data = await LazadaEc.update({id_user,id}).set({access_token,refresh_token,name,active:true}).fetch();
 			return res.send({success:true,...data})

 		}catch(error){
 			return res.send({error});
 		}
 	},
 	'tiki':async function(req,res){
 		try{
 			let {id_user,body:{id}} = req;

 			let account = await TikiEc.find({id_user,id});
 			if(account.length === 0) throw 'Không tìm thấy tài khoản LAZADA';
 			let {access_token,refresh_token,name} = await tiki(account[0].refresh_token);
 			
 			let data = await TikiEc.update({id_user,id}).set({access_token,refresh_token,name,active:true}).fetch();
 			return res.send({success:true,...data})

 		}catch(error){
 			console.log(error);
 			return res.send({error});
 		}
 	},
 	'shopee':async function(req,res){
 		try{
 			let {id_user,body:{id}} = req;

 			let account = await ShopeeEc.find({id_user,id});
 			if(account.length === 0) throw 'Không tìm thấy tài khoản LAZADA';
 			let {shopid} = account[0];
 			let {name} = await shopee(shopid);
 			let data = await ShopeeEc.update({id_user,id}).set({name,active:true}).fetch();
 			let result = data[0];
 			delete result.id_user;
 			return res.send({success:true,...result})

 		}catch(error){
 			return res.send({error});
 		}
 	},
 };

