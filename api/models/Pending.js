/**
 * Pending.js
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
    accountec_id:{
        type:'string',
        required:true
    },
    section:{
        type:'string',
        isIn:['product','order'],
        required:true
    }

  },

};

