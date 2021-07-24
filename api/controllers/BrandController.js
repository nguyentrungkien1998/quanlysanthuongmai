/**
 * BrandController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 module.exports = {
 	search:async function(req,res){
 		try{
 			let {keyword} = req.body;
 			if(!keyword) throw 'Quý khách chưa nhập từ khóa';
 			keyword = keyword.toLowerCase().replace(/[ -_&\/\\#,+()$~%.'":*?<>{}]/g,'');
 			let list_brand = await Brand.find({alias:{contains:keyword}}).limit(30);
 			return res.send(list_brand);
 		}catch(error){
 			return res.send({error});
 		}
 	}
 };

