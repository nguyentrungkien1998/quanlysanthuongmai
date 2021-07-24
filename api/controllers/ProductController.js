
const Lazada = require('../services/product/lazada.js');
const Sendo = require('../services/product/sendo.js');
const Tiki = require('../services/product/tiki.js');
const Shopee = require('../services/product/shopee.js');

const fs = require('fs');

const InfoCopy = require('../services/get-info-product/product.js');

const CreateProductSendo = require('../services/CreateProduct/sendo.js');
const CreateProductShopee = require('../services/CreateProduct/shopee.js');
const CreateProductLazada = require('../services/CreateProduct/lazada.js');

const ShipShopee = require('../services/shiping-shopee/shiper.js');
const UpdateShipShopee = require('../services/shiping-shopee/update.js');

module.exports = {
	
	'brand-lazada':async function(req,res){

		let {keyword} = req.body;
		keyword = keyword || '';
		keyword = keyword.toLowerCase();
		let data = await BrandLazada.find({global_identifier:{contains:keyword}}).limit(10);
		return res.send(data);


	},
	'pending':async  function(req,res){
		
	},
	'search':async function(req,res){
		let {id_user} = req;
		let {keyword,accountec_id} = req.body;

		let keyword_part = keyword.split(' ').filter(e=>e.length > 0).map(e=>e.toLowerCase());
		let list = [];
		for(let key of keyword_part){
			let where = {id_user,name_alias:{contains:key}};
			if(accountec_id) where.accountec_id = accountec_id;
			if(list.length === 0) list = await Product.find(where);
			list = list.filter(e=>e.name_alias.includes(key));
		}
		return res.send(list);
	},
	'get':async function(req,res){
		let {id_user} = req;
		let {page,accountec_id,search} = req.body;
		page = page || 1;
		let condition = {id_user};
		if(accountec_id) condition.accountec_id = accountec_id;
		if(search) condition.name_alias = {contains:search};
		let data = await Product.find({where:condition,limit:10,skip:(page-1)*10,omit:['id_user']});

		return res.send(data);
	},
	'up':async function(req,res){
		try{
			let {id_user} = req;
			let {accountec_id,data,ec} = req.body;
			
			if(!accountec_id || !data) throw 'Không đủ dữ kiện thực thi';
			
			if(ec === 'sendo'){
				let account = await SendoEc.find({id_user,id:accountec_id});
				if(account.length === 0) throw 'Không tìm thấy tài khoản liên kết';
				await CreateProductSendo(account[0].token,data);
			}else if(ec === 'shopee'){
				let account = await ShopeeEc.find({id_user,id:accountec_id});
				if(account.length === 0) throw 'Không tìm thấy tài khoản liên kết';
				await CreateProductShopee(account[0].shopid,data);
			}else if(ec === 'lazada'){
				let account = await LazadaEc.find({id_user,id:accountec_id});
				if(account.length === 0) throw 'Không tìm thấy tài khoản liên kết';
				await CreateProductLazada(account[0].access_token,data);
			}else{
				
				throw 'Không tìm thấy nơi đăng';
			}
			
			return res.ok();

		}catch(error){
			
			return res.send({error});
		}
		
		
	},
	'ship-shopee':async function(req,res){
		try{
			let {id_user} = req;
			let find_account = await ShopeeEc.find({id_user,active:true});
			if(find_account.length === 0) throw 'Không tìm thấy tài khoản Shopee nào được liên kết';
			let {shopid} = find_account[0];
			let data = await ShipShopee(shopid);
			return res.send(data);
		}catch(error){
			return res.send({error});
		}
	},
	'update-shiping-shopee':async function(req,res){
		try{
			let {id_user} = req;
			let {logistic_id,enabled} = req.body;
			if(!logistic_id) throw 'Không tìm thấy logistic_id';
			let find_account = await ShopeeEc.find({id_user,active:true});
			if(find_account.length === 0) throw 'Không tìm thấy tài khoản Shopee nào được liên kết';
			let {shopid} = find_account[0];
			let data = await UpdateShipShopee(logistic_id,shopid,enabled);
			return res.send(data);
		}catch(error){
			
			return res.send({error});
		}
	},
	'copy':async function(req,res){
		try{
			let {url} = req.body;
			if(!url) throw 'Không tìm thấy url';
			let data = await InfoCopy(url);
			return res.send(data);
		}catch(error){
			console.log(error)
			return res.send({error});
		}
	},
	'reload':async function(req,res){
		try{
			let {id_user} = req;
			let {id,ec} = req.body;
			
			if(ec === 'lazada'){
				let find_acc = await LazadaEc.find({id_user,id});
				if(find_acc.length === 0) throw 'Không tìm thấy tài khoản sàn Lazada';
				await Lazada(id_user,id,find_acc[0].access_token);
			}else if(ec === 'tiki'){
				let find_acc = await TikiEc.find({id_user,id});
				if(find_acc.length === 0) throw 'Không tìm thấy tài khoản sàn Tiki';
				await Tiki(id_user,id,find_acc[0].access_token);
			}else if(ec === 'shopee'){
				let find_acc = await ShopeeEc.find({id_user,id});
				if(find_acc.length === 0) throw 'Không tìm thấy tài khoản sàn Shopee';
				await Shopee(id_user,id,find_acc[0].shopid);
			}else if(ec === 'sendo'){
				let find_acc = await SendoEc.find({id_user,id});
				if(find_acc.length === 0) throw 'Không tìm thấy tài khoản sàn Shopee';
				await Sendo(id_user,id,find_acc[0].token);
			}else{
				throw 'Không nhận dạng sàn.'
			}
			return res.ok();
		}catch(error){
			console.log(error);
			return res.send({error});
		}
	},
	
	'count':async function(req,res){
		let {id_user} = req;
		let {accountec_id,search} = req.body;
		let where = {id_user,accountec_id};
		if(search) where.name_alias = {contains:search};
		let count = await Product.count({where});
		return res.send({count})
	},
	

};

