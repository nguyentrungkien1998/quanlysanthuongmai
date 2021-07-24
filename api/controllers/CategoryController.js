/**
 * CategoryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
 const SuggestionSendo = require('../services/category-suggestion/sendo');
 const SuggestionLazada = require('../services/category-suggestion/lazada');
 const SuggestionLazada2 = require('../services/category-suggestion/lazada2');
 const SuggestionShopee = require('../services/category-suggestion/shopee');

 const AttributeSendo = require('../services/optionform/sendo');
 const AttributeShopee = require('../services/optionform/shopee');
 const AttributeLazada = require('../services/optionform/lazada');


 module.exports = {
 	'get':async function(req,res){
 		try{
 			let {parent_id,ec} = req.body;
 			if(!parent_id) throw 'Không xác định được parent_id';
 			if(!ec) throw 'Không xác định được tên sàn';
 			let data = await Category.find({ec,parent_id});
 			return res.send(data);
 		}catch(error){
 			return res.send({error});
 		}
 		
 	},
 	'translate-lazada':async function(req,res){
 		let {category_id} = req.body;
 		let data = await Translate.find({category_id});
 		return res.send(data);
 	},
 	'attribute-sendo':async function(req,res){
 		try{
 			let {id_user} = req;
 			let {category_id} = req.body;
 			let account = await SendoEc.find({where:{id_user,active:true}});
 			if(account.length === 0) throw 'Không tìm thấy tài khoản Sendo nào được liên kết';
 			
 			let data = await AttributeSendo(category_id,account[0].token);
 			return res.send(data);
 		}catch(error){
 			
 			return res.send({error});
 		}
 		
 	},
 	'attribute-shopee':async function(req,res){
 		try{
 			let {id_user} = req;
 			let {category_id} = req.body;
 			let account = await ShopeeEc.find({where:{id_user,active:true}});
 			if(account.length === 0) throw 'Không tìm thấy tài khoản Shopee nào được liên kết';
 			
 			let data = await AttributeShopee(category_id,account[0].shopid);
 			
 			return res.send(data);
 		}catch(error){
 			
 			return res.send({error});
 		}
 	},
 	'attribute-lazada':async function(req,res){
 		try{
 			let {id_user} = req;
 			let {category_id} = req.body;
 			let account = await LazadaEc.find({where:{id_user,active:true}});
 			if(account.length === 0) throw 'Không tìm thấy tài khoản Lazada nào được liên kết';
 			
 			let data = await AttributeLazada(category_id,account[0].access_token);
 			
 			return res.send(data);
 		}catch(error){
 			
 			return res.send({error});
 		}
 	},
 	
 	'suggestion-sendo':async function(req,res){
 		try{
 			let {keyword} = req.body;
 			if(!keyword) throw 'Từ khóa không hợp lệ.';
 			let data = await SuggestionSendo(keyword);
 			return res.send(data);
 		}catch(error){
 			return res.send({error});
 		}
 	},
 	'suggestion-lazada':async function(req,res){
 		try{
 			let {id_user} = req;
 			let {keyword} = req.body;
 			let find_account_lazada = await LazadaEc.find({id_user,active:true});
 			if(find_account_lazada.length === 0) throw 'Chưa có tài khoản Lazada nào được liên kết.'
 			if(!keyword) throw 'Từ khóa không hợp lệ.';
 			let data = await SuggestionLazada2(keyword,find_account_lazada[0].access_token);
 			return res.send(data);
 		}catch(error){
 			console.log(error);
 			return res.send({error});
 		}
 	},
 	'suggestion-shopee':async function(req,res){
 		try{
 			let {keyword} = req.body;
 			if(!keyword) throw 'Từ khóa không hợp lệ.';
 			let data = await SuggestionShopee(keyword);
 			return res.send(data);
 		}catch(error){
 			return res.send({error});
 		}
 	},

 };

