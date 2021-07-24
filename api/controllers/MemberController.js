/**
 * MemberController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	list:async function(req,res){
		let {limit,skip} = req.query;
		limit = limit || 30;
		skip = skip || 0;
		let data = await Account.find({omit:['pass_hash','logs'],limit,skip});
		data = data.filter(({fullname})=>fullname !== 'admin');
		return res.send(data);
	},
	count:async function(req,res){
		let data = await Account.count();
		return res.send({count:data-1});
	},

	update:async function(req,res){
		try{
			let {id,permission_name} = req.body;
			if(!permission) throw 'Không tìm thấy permission phù hợp.';
			let data = await Account.findOne({id});
			if(!data) throw 'Không tìm thấy thành viên.';
			let {permission} = data;
			permission.push(permission_name);
			let data_update = await Account.update({id}).set({permission});
			return res.send(data_update);
		}catch(error){
			return res.send({error});
		}
	},
	remove:async function(req,res){
		try{
			let {id} = req.body;
			if(!id) throw true;
			let data = await Account.destroy({id}).fetch();
			return res.send(data);
		}catch(error){
			return res.send({error:'Không tìm thấy ID.'})
		}
	}
};

