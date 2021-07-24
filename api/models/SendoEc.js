/**
 * SendoEc.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

 module.exports = {

  attributes: {
    id_user:{
        type:'string',
        required:true
    },
    name:{
        type:'string'
    },
    active:{
        type:'boolean',
        defaultsTo:true
    },
    token:{
        type:'string'
    },
    
    shop_key:{
        type:'string',
        required:true
    },
    secret_key:{
        type:'string',
        required:true
    }


}

};

