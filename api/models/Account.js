/**
 * Account.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

 module.exports = {
 	attributes: {
 		id_user:{
 			type:'string',
 			required:true,
 			unique:true
 		},
 		fullname:{
 			type:'string',
 			required:true,
 			minLength:2
 		},
 		phone:{
 			type:'string',
 			maxLength:10,
 			required:true,
 			regex: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
 			
 		},

 		pass_hash:{
 			type:'string',
 			required:true
 		},
 		active_phone:{
 			type:'boolean',
 			defaultsTo:false
 		},
 		active_email:{
 			type:'boolean',
 			defaultsTo:false
 		},
 		logs:{
 			type:'json',
 			defaultsTo:[]
 		},
 		address:{
 			type:'string',
 			defaultsTo:''
 		},
 		gender:{
 			type:'string',
 			defaultsTo:''
 		},
 		date_of_birth:{
 			type:'number'
 		},
 		permission:{
 			type:'json',
 			defaultsTo:[]
 		},
 		online:{
 			type:'boolean',
 			defaultsTo:false
 		}
 	}

 };

