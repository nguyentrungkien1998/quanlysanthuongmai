/**
 * Translate.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    category_id:{
        type:'string',
        required:true
    },
    data:{
        type:'json',
        defaultsTo:[]
    }
  },

};

