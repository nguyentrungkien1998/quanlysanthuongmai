/**
 * PendingController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 module.exports = {
 	'create':async function(req,res){
 		let {id_user} = req;
 		let {accountec_id,section} = req.body;
 		let find_pending = await Pending.find({id_user,accountec_id,section});
 		if(find_pending.length === 0) await Pending.create({id_user,accountec_id,section});
 		return res.ok();
 	},
 	'get':async function(req,res){
 		let {id_user} = req;
 		let {section} = req.body;
 		let data = await Pending.find({section,id_user});
 		return res.send(data);
 	},

 	remove:async function(req,res){
 		let {id_user} = req;
 		let {accountec_id,section} = req;
 		await Pending.destroy({id_user,accountec_id,section});
 		return res.ok();
 	}

 };

