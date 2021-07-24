const {server:{port}} = require('../../nuxt.config.js');
module.exports = {
  datastores: {
    default: {
     adapter: 'sails-mongo',
     url: 'mongodb://localhost:27017/nuxt',
   },
 },

 models: {
   migrate: 'safe',


   schema: true,

   attributes: {
    createdAt: { type: 'number', autoCreatedAt: true, },
    updatedAt: { type: 'number', autoUpdatedAt: true, },
    id:{type:'string',unique:true}

  },
  dataEncryptionKeys: {
    default: 'tVdQbq2JptoPp4oXGT94kKqF72iV0VKY/cnt7kasbdf89273grbisb9873goaisdiuosdfbiaisdfkuosdgfSjL7Ik='
  },
},

blueprints: {
  shortcuts: false,
},

security: {
  cors: {
   allowOrigins: []
 },
},

session: {
  secure:false
},

sockets: {
  onlyAllowOrigins:['https://seu.vn'],
  transports: ['polling', 'websocket'],

  grant3rdPartyCookie: true,

},

log: {
  level: 'debug'
},

http: {
    cache: 365.25 * 24 * 60 * 60 * 1000, // One year

    trustProxy: false,

  },

  port,


  ssl:{
  key:require('fs').readFileSync(__dirname+'/ssl/key.pem','UTF-8'),
  cert:require('fs').readFileSync(__dirname+'/ssl/cert.crt','UTF-8')
},

custom: {

}
};
