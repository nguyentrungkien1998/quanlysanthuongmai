/**
 * TikiEc.js
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
    sid:{
        type:'string',
        required:true
    },
    access_token:{
        type:'string',
        required:true
    },
    refresh_token:{
        type:'string',
        required:true
    }

},

};

