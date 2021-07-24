/**
 * Brand.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    brand_id:{
        type:'string',
        required:true
    },
    name:{
        type:'string',
        required:true
    },
    ec:{
        type:'string',
        defaultsTo:'SEU'
    },
    alias:{
        type:'string',
        defaultsTo:''
    }

  },

};

