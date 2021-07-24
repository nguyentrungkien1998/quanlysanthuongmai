const Product = require('../services/get-info-product/product');
let find_newest_product = async (id_user,link_san_pham)=>{
	let list_data = await TrendProduct.find({where:{id_user,link_san_pham},omit:['id_user']}).sort('createdAt DESC').limit(2);
	if(list_data.length === 2){
		let data_new = list_data[0];
		let data_old = list_data[1];
		return {...data_new,increase_price:data_new.gia_moi - data_old.gia_moi,increase_stock:data_new.so_luong_da_ban - data_old.so_luong_da_ban}
	}else if(list_data.length === 1){
		return {...list_data[0],increase_price:0,increase_stock:0}
	}else{
		return {}
	}
	
};

module.exports = {
	'get-all-link':async function(req,res){
		let {id_user} = req;
		let {ec,page} = req.body;
		let list_link = await TrendProductLink.find({where:{id_user,ec},omit:['id_user']}).sort('createdAt DESC').limit(8).skip((page-1)*8)
		let product_list_map = list_link.map(({link_san_pham})=>find_newest_product(id_user,link_san_pham));
		let data = await Promise.all(product_list_map)
		return res.send(data);
	},
	'search':async function(req,res){
		let {id_user} = req;
		let {keysearch} = req.body;
		keysearch = keysearch.replace(/ /g,'').toLowerCase();
		let list_link = await TrendProductLink.find({where:{ten_san_pham_alias:{contains:keysearch}}});
		let product_list_map = list_link.map(({link_san_pham})=>find_newest_product(id_user,link_san_pham));
		let data = await Promise.all(product_list_map)
		return res.send(data);

	},
	'add':async function(req,res){
		try{
			let {id_user} = req;
			let {url} = req.body;
			if(!url.includes('sendo.vn') && !url.includes('tiki.vn') && !url.includes('lazada.vn') && !url.includes('shopee.vn')) throw 'Link không đúng định dạng';
			let exists = await TrendProductLink.findOne({link_san_pham:url,id_user});
			if(exists) throw 'Link đã tồn tại'
				let data = await Product(url);
			data.id_user = id_user;
			await TrendProduct.create(data);
			await TrendProductLink.create(data);
			return res.send(data);
		}catch(error){
			console.log(error);
			return res.send({error});
		}
	},
	'remove':async function(req,res){
		let {id_user} = req;
		let {link_san_pham} = req.body;
		await TrendProductLink.destroy({id_user,link_san_pham});
		await TrendProduct.destroy({id_user,link_san_pham});
		return res.ok();
	},
	'count-link':async function(req,res){
		let {id_user} = req;
		let {ec} = req.body;
		let count = await TrendProductLink.count({id_user,ec});
		return res.send({count})
	}
};

