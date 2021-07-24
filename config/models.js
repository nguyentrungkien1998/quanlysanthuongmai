const random = require('randomstring');

module.exports.models = {




	migrate: 'alter',

	schema: true,

	attributes: {
		createdAt: { type: 'number', autoCreatedAt: true, },
		updatedAt: { type: 'number', autoUpdatedAt: true, },
		id:{type:'string',unique:true}

	},
	dataEncryptionKeys: {
		default: 'tVdQbq2JptoPp4oXGT94kKqF72iV0VKY/cnt7kasbdf89273grbisb9873goaisdiuosdfbiaisdfkuosdgfSjL7Ik='
	},


};
