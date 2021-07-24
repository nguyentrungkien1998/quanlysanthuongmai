/**
 * Order.js
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
    time:{
        type:'number'
    },
    order_id:{
        type:'string',
        required:true
    },
    name:{
        type:'string'
    },
    address:{
        type:'string'
    },
    phone:{
        type:'string'
    },
    items:{
        type:'json'
    },
    price:{
        type:'number'
    },
    payment_fee:{
        type:'number'
    },
    payment_method:{
        type:'string'
    },
    status:{
        type:'string'
    },
    ec:{
        type:'string'
    }
  },

};

