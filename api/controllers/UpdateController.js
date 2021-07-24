

 module.exports = {
 	'update-brand-lazada':async function(req,res){
 		let {brand_id,name,global_identifier,name_en} = req.body;
 		let find_brand = await BrandLazada.find({brand_id});
 		if(find_brand.length === 0){
 			await BrandLazada.create({brand_id,name,global_identifier,name_en})
 		};
 		return res.ok();
 	},
 	'update-attr-lazada':async function(req,res){
 		let {category_id,name,input_type} = req.body;
 		let find_option = await AttrLazada.find({category_id,name,input_type});
 		if(find_option.length === 0){
 			await AttrLazada.create(req.body)
 		};
 		return res.ok();
 	},
 	
 	'import-translate':async function(req,res){
 		let {category_id,data} = req.body;
 		
 		await Translate.create({category_id,data});
 		return res.ok();
 	},
 	'category-leaf-lazada':async function(req,res){
 		let data = await Category.find({ec:'lazada',leaf:true});

 		return res.send(data);
 	},
 	
 	

 	'category-leaf':async function(req,res){
 		try{
 			let {category_id,ec,leaf} = req.body;

 			if(!category_id) throw 'Không xác định được category_id';
 			if(!ec) throw 'Không xác định được tên sàn';
 			await Category.update({category_id,ec}).set({leaf});
 			return res.ok();
 		}catch(error){
 			return res.send({error});
 		}
 	},

 	'lastlevel-category':async function(req,res){
 		try{
 			let {ec} = req.body;
 			if(!ec) throw 'Không tìm thấy tên sàn.';
 			let categories = await Category.find({ec});
 			let list_parent_id = categories.map(({parent_id})=>parent_id);
 			let result = categories.filter(({category_id})=>!list_parent_id.includes(category_id));
 			return res.send(result);
 		}catch(error){
 			return res.send({error});
 		}
 	},
 	'attr-create-sendo':async function(req,res){
 		try{
 			
 			let save = await AttrSendo.create(req.body).fetch();
 			return res.send(save);
 		}catch(error){
 			return res.send({error});
 		}
 	},
 	'attr-destroy':async function(req,res){
 		try{
 			let {category_id,ec} = req.body;
 			if((category_id.toString().length === 0) || (ec.toString().length === 0)) throw 'Không tìm thấy Ec hoặc category ID';
 			let remove = await Optionform.destroy({category_id,ec}).fetch();
 			return res.send(remove);
 		}catch(error){
 			return res.send({error});
 		}
 	},





 	'category-set':async function(req,res){
 		try{
 			
 			let {parent_id,category_id,name,ec,level} = req.body;
 			
 			let find_category = await Category.findOne({category_id,ec});
 			if(!find_category) await Category.create(req.body)
 			return res.ok()
 		}catch(error){
 			return res.send({error});
 		}
 	},
 	'category-find':async function(req,res){
 		try{
 			let {ec,level} = req.body;
 			let data = await Category.find({ec,level});
 			return res.send(data);
 		}catch(error){
 			return res.send({error});
 		}
 	}



 };

