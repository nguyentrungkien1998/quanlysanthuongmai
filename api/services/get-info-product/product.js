const lazadaInfo = require('./ec/lazada');
const tikiInfo = require('./ec/tiki');
const shopeeInfo = require('./ec/shopee');
const sendoInfo = require('./ec/sendo');

module.exports = async function(url){
    if(url.includes('lazada.vn')) return await lazadaInfo(url);
    if(url.includes('tiki.vn')) return await tikiInfo(url);
    if(url.includes('shopee.vn')) return await shopeeInfo(url);
    if(url.includes('sendo.vn')) return await sendoInfo(url);
    throw 'Url sản phẩm phải thuộc Sendo,tiki,shopee,lazada';
   
};