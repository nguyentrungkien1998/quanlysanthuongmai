const AttrLazada = require('./lazada');
(async ()=>{
	let data = await AttrLazada('6399','50000901900f174b8debIeasqDdFEU6OxYhHkSgwIqsBHb9tTFuwxxQv1H0bo5Dg');
	console.log(data.map(({is_mandatory,input_type,attribute_type,label,is_sale_prop})=>({is_mandatory,input_type,attribute_type,label,is_sale_prop})).filter(({is_mandatory})=>is_mandatory));
	//console.log(data.find(({label})=>label === 'Color Family'))
})();