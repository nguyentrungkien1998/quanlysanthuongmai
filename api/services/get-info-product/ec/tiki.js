const request = require('request-promise');
module.exports = async function(url){
    if(!url){
        return null
    }
    let SPID = '';

    let end = url.indexOf('.html');
    let start = url.lastIndexOf('p',end)+1;
    let ID_product = url.slice(start,end);

    let spid_position = url.indexOf('spid=');
    if(spid_position > 0){
        SPID = url.slice(spid_position+5)
    }





    let options = {
        url:'https://tiki.vn/api/v2/products/'+ID_product+'?include=tag,images,gallery,promotions,badges,stock_item,variants,product_links,discount_tag&spid='+SPID,
        method : 'get',
        headers : {
            'user-agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36',

        }
    };
   

    let responseText = await request(options);
    let {id,sku,name,url_path,price,list_price,categories,discount_rate,stock_item:{qty},brand,configurable_products,current_seller,images,rating_average,review_count,description,specifications} = JSON.parse(responseText);



    let itemId = current_seller?current_seller.product_id:null;
    let ten_san_pham = name;
    let attributes = specifications[0].attributes;

    let ten_cua_hang = current_seller?current_seller.name:null;
    let phan_tram = parseInt(discount_rate) || 0;
    let gia_cu = parseInt(list_price) || 0;
    let gia_moi = parseInt(price) || 0;
    let skuId = current_seller.sku;
    let link_san_pham = 'https://tiki.vn/'+url_path;
    let thuong_hieu = brand.name;
    let rating = {
        score:parseFloat(rating_average) || 0,
        total:parseInt(review_count) || 0
    };
    delete categories.is_leaf;
    let danh_muc = [categories];
    let mo_ta = description;

    let so_luong_con_lai =  parseInt(qty) || null;
    let so_luong_da_ban =  null;
    let tong_so_luong = so_luong_con_lai+so_luong_da_ban || null;
    let doanh_thu_du_kien = gia_moi*tong_so_luong || null;
    let doanh_thu_dat_duoc = gia_moi*so_luong_da_ban || null;

    let link_shop = 'https://tiki.vn/cua-hang/'+current_seller?current_seller.slug:null;
    let full_img_product = (configurable_products || []).length > 0 ? configurable_products[0].images.map(e=>e.large_url) : images.map(e=>e.large_url);

    return {itemId,skuId,ten_san_pham,danh_muc,mo_ta,so_luong_con_lai,so_luong_da_ban,tong_so_luong,doanh_thu_du_kien,doanh_thu_dat_duoc,rating,thuong_hieu,ten_cua_hang,phan_tram,gia_cu,gia_moi,link_shop,link_san_pham,full_img_product,ec:'tiki',attributes}

};