<template>
	

	<el-row :gutter="20">
		<el-col :span="24" :offset="0">



			<el-card :body-style="{ padding: '0px' }" shadow="hover">
				<div slot="header">
					<el-row :gutter="20">
						<el-col :span="12" :offset="0">
							<el-button type="text" @click="goBack" icon="el-icon-back" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="medium" :disabled="false">
								<img style="margin-left: 15px;margin-bottom: -5px" :src="LoadImg('shopee')">
							</el-button>
						</el-col>
						<el-col :span="12" align="right" :offset="0">
							<el-button @click="copy_visible = true" type="primary" icon="el-icon-view" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="medium" :disabled="false">Sao chép sản phẩm</el-button>
						</el-col>
					</el-row>


				</div>
				<div style="padding: 14px;">
					<el-form @submit.native.prevent ref="form"  :rules="ruleForm" :model="formData"  status-icon label-width="auto" label-position="top" :inline="false" :disabled="false" :inline-message="false" show-message validate-on-rule-change size="small">
						<el-form-item label="Chọn cửa hàng:" prop="shops" align="left">

							<el-checkbox v-model="checkAll" @change="selectAllShop" :indeterminate="checkAll" >Chọn tất cả</el-checkbox>
							<div style="margin: 15px 0;"></div>
							<el-checkbox v-for="(data,index) in shops" :key="index" v-model="formData.shops" :label="data" :border="false" :checked="false" :disabled="false">{{data.name}}</el-checkbox>
						</el-form-item>
						<el-alert
						v-show="formData.shops.length === 0"
						title="Quý khách vui lòng chọn ít nhất 1 cửa hàng muốn đăng để tiếp tục"
						type="info"
						show-icon>
					</el-alert>

					<template v-if="formData.shops.length > 0">

						<el-form-item label="Tên sản phẩm:" prop="name" align="left">
							<el-row :gutter="20">
								<el-col :span="24" :offset="0">
									<el-input  placeholder="Nhập tên sản phẩm" @change="SameValueInput" v-model="formData.name" size="medium" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
								</el-col>

							</el-row>
							<el-collapse>
								<el-collapse-item name="1">
									<template slot="title">
										<center>
											<i style="color:green" class="el-icon-caret-right"></i> Thêm tên khác
										</center>
									</template> 
									<div v-for="(data,index) in ShopCustom" :key="index" style="margin-bottom: 20px">
										<div style="display: block;margin-bottom: 10px">
											Tên sản phẩm : <el-tag type="success" :closable="false" effect="light" size="mini" :disable-transitions="false">{{data.name}}</el-tag>
										</div>
										<el-input placeholder="Nhập tên sản phẩm" v-model="data.value" size="small"  type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>

									</div>
								</el-collapse-item>
							</el-collapse>

						</el-form-item>

						<el-form-item prop="category" align="left">

							<el-row style="margin-bottom:10px" :gutter="20">
								<el-col :span="12" align="left" :offset="0">
									<span class="attr_text">Chọn danh mục: </span> 
								</el-col>
								<el-col :span="12" align="right" :offset="0">
									<span>Tự động </span>
									<el-switch @change="GetSuggesstionCategory" v-model="auto_category" :active-value="true" :inactive-value="false" active-color="#13ce66" inactive-color="#ff4949" :disabled="false"></el-switch>
								</el-col>
							</el-row>



							<el-cascader size="medium" v-if="SuggesstionCategory.length === 0" @change="GetAttribute" style="width: 100%" v-model="formData.category" :props="LoadCategory"></el-cascader>

							<el-breadcrumb v-if="SuggesstionCategory.length > 0" style="margin-top:20px" separator-class="el-icon-arrow-right">
								<el-breadcrumb-item v-for="(data,index) in SuggesstionCategory" :key="index">{{data.name}}</el-breadcrumb-item>
								<el-button class="change_button" type="default"  @click="SuggesstionCategory = [],auto_category=false" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Thay đổi</el-button>
							</el-breadcrumb>

						</el-form-item>


						<el-form-item label="Hình ảnh sản phẩm:" align="left">
							<el-upload
							action="/api/up/image"
							list-type="picture-card"
							:on-preview="handlePictureCardPreview"
							:on-success="handleSuccess"
							:on-remove="handleRemove"
							:file-list="imgList"

							>
							<i class="el-icon-plus"></i>



						</el-upload>
						<el-dialog :visible.sync="dialogVisible">
							<img width="100%" :src="dialogImageUrl" alt="">
						</el-dialog>
					</el-form-item>

					<el-form-item label="Mô tả:" prop="description" align="left">

						<el-input v-model="formData.description" type="textarea" :rows="6" :autosize="false" placeholder="Nhập mô tả chi tiết sản phẩm ... "></el-input>

					</el-form-item>

					<el-form-item  align="left">
						<el-row :gutter="20">
							<el-col :span="12" align="left" :offset="0">

								<span class="attr_text">Đặc tính:</span>

							</el-col>
							<el-col :span="12" align="right" :offset="0">
								<span style="margin-right: 5px;">{{attr_sub?'Ẩn tiêu chí phụ':'Hiển thị tiêu chí phụ'}}</span>
								<el-switch v-model="attr_sub" :active-value="true" :inactive-value="false" active-color="#13ce66" inactive-color="#ff4949" :disabled="false"></el-switch>

							</el-col>
						</el-row>
						<br>

						<template v-if="attr('COMBO_BOX').length > 0">

							<div v-for="(top,index) in Math.ceil((attr('COMBO_BOX').length)/4)" :key="index">
								<el-row :gutter="20">

									<el-col v-for="(attribute,index2) in attr('COMBO_BOX').slice(index*4,(index*4)+4)" :key="index2" :span="6" :offset="0" >
										<el-badge :hidden="!attribute.is_mandatory" is-dot class="item">
											<el-select filterable v-model="attribute.select" size="medium" :placeholder="attribute.attribute_name">
												<el-option v-for="(data,index3) in attribute.options" :key="index3" :label="data" :value="data" :disabled="false"></el-option>
											</el-select>
										</el-badge>
									</el-col>
								</el-row>
								<br v-if="attr('COMBO_BOX').length > 4">
							</div>
							<el-divider direction="horizontal"></el-divider>

						</template>

						<template v-if="attr('DROP_DOWN').length > 0">

							<div v-for="(top,index) in Math.ceil((attr('DROP_DOWN').length)/4)" key="index">
								<el-row :gutter="20">



									<el-col v-for="(attribute,index2) in attr('DROP_DOWN').slice(index*4,(index*4)+4)" :key="index2" :span="6" :offset="0" >
										<el-badge :hidden="!attribute.is_mandatory" is-dot class="item">
											<el-select filterable v-model="attribute.select" size="medium" :placeholder="attribute.attribute_name">
												<el-option v-for="(data,index3) in attribute.options" :key="index3" :label="data" :value="data" :disabled="false"></el-option>
											</el-select>
										</el-badge>
									</el-col>
								</el-row>
								<br v-if="attr('DROP_DOWN').length > 4">
							</div>
							<el-divider direction="horizontal"></el-divider>

						</template>
						<template v-if="attr('TEXT_FILED').length > 0">

							<div v-for="(top,index) in Math.ceil((attr('TEXT_FILED').length)/4)" :key="index">

								<el-row :gutter="20">
									<el-col v-for="(attribute,index2) in attr('TEXT_FILED').slice(time*4,(time*4)+4)" :key="index2" :span="6" :offset="0">
										<span>{{attribute.attribute_name}} :</span> 
										<br>
										<el-badge :hidden="!attribute.is_mandatory" is-dot class="item">
											<el-input :placeholder="attribute.name" v-model="attribute.attribute_values[0].value" size="medium" type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
										</el-badge>
									</el-col>
								</el-row>
								<br v-if="attr('TEXT_FILED').length > 4">
							</div>
							<el-divider direction="horizontal"></el-divider>
						</template>

						<template v-if="attr_sub">
							<el-col :span="6" :offset="0">
								<el-form-item label="Chiều cao (cm):" align="left">
									<el-input-number v-model="formData.height" controls-position="right"  :min="0" :max="100000"></el-input-number>

								</el-form-item>
							</el-col>
							<el-col :span="6" :offset="0">
								<el-form-item label="Chiều dài (cm):" align="left">
									<el-input-number v-model="formData.length" controls-position="right"  :min="0" :max="100000"></el-input-number>
								</el-form-item>
							</el-col>
							<el-col :span="6" :offset="0">
								<el-form-item label="Chiều rộng (cm):" align="left">
									<el-input-number v-model="formData.width" controls-position="right"  :min="0" :max="100000"></el-input-number>
								</el-form-item>
							</el-col>
						</template>
					</el-form-item>


					<el-row v-show="attr(null,true).length === 0" :gutter="20">

						<el-col :span="6" :offset="0">
							<el-form-item label="Số lượng:" align="left">
								<el-input-number v-model="formData.stock" controls-position="right"  :min="1" :max="100000"></el-input-number>
							</el-form-item>

						</el-col>

					</el-row>

					<el-card :body-style="{ padding: '0px' }" shadow="hover">
						<div slot="header">
							Thông tin gói hàng:
						</div>
						<div style="padding: 22px;">
							<el-row :gutter="20">
								<el-col :span="6" :offset="0">
									<el-form-item label="Khối lượng (g):" align="left">
										<el-input-number v-model="formData.weight" controls-position="right"  :min="0" :max="100000"></el-input-number>
									</el-form-item>
								</el-col>

								<el-col :span="18" :offset="0">

									<el-form-item label="Nhà vận chuyển:" prop="" align="left">
										<el-select @remove-tag="removeShiping" @change="updateShiping" style="width: 100%" placeholder="Lựa chọn nhà vận chuyển" v-model="formData.logistics" filterable :multiple="true">
											<el-option v-for="(data,index) in shiper" :key="index" :label="data.logistic_name" :value="data.logistic_id+'-'+data.logistic_name">{{data.logistic_name}}</el-option>
										</el-select>
									</el-form-item>
								</el-col>


							</el-row>
						</div>
					</el-card>
					<br>
					<el-checkbox v-model="vari_show" label="Thiết lập Phân loại hàng" border></el-checkbox>
					<br><br>
					<el-card v-if="vari_show" :body-style="{ padding: '0px' }" shadow="hover">
						<div slot="header">

							Tên phân loại:
						</div>



						<div style="padding: 22px;">

							<el-select style="width:100%" v-model="cols_select" placeholder="Lựa chọn tên phân loại" filterable :allow-create="true" :multiple="true" :multiple-limit="2"  :clearable="true" :disabled="false">
								<el-option v-for="(data,index) in cols" :key="index" :label="data" :value="data" :disabled="false"></el-option>
							</el-select>

							<div v-if="cols_select.length > 0" style="margin-top: 20px">
								<el-table :data="variation_data" :border="true" :highlight-current-row="true" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="light" style="width: 100%">
									<el-table-column v-for="(name,index) in cols_select" :key="index" :label="name"  align="center" :sortable="false" :fixed="false" :width="cols_select.length === 1 ? 360 : 180">
										<template slot-scope="scope">
											<el-input  v-model="scope.row[name]" size="medium" type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
										</template>
									</el-table-column>
									<el-table-column label="Giá" align="center" :sortable="false" :fixed="false" width="180">
										<template slot-scope="scope">
											<Money :max='1000000000' size="mini" :min='0' :fixed='0' v-model="scope.row.price" clearable></Money>
										</template>

									</el-table-column>
									<el-table-column label="Kho hàng" align="center" :sortable="false" :fixed="false" width="210">
										<template slot-scope="scope">
											<el-input-number v-model="scope.row.stock" controls-position="right" :min="1" :max="100000000"></el-input-number>
										</template>
									</el-table-column>
									<el-table-column label="SKU phân loại" align="center" :sortable="false" :fixed="false" width="180">
										<template slot-scope="scope">
											<el-input  v-model="scope.row.variation_sku" size="medium" type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
										</template>
									</el-table-column>
									<el-table-column align="center" :sortable="false" :fixed="false" width="180">
										<template slot-scope="scope">
											<el-button type="primary" @click="remove_price(scope.row.index)" :loading="false" :plain="true" :round="false" :circle="false" :autofocus="false" size="small" :disabled="false">Xoá</el-button>
										</template>
									</el-table-column>

								</el-table>
								<br>
								<el-row :gutter="20">
									<el-col :span="24" align="center" :offset="0">
										<el-button @click="push_price" type="info" icon="" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="medium" :disabled="false">Thêm giá</el-button>
									</el-col>
								</el-row>
							</div>
						</div>
					</el-card>


					<el-form-item v-if="!vari_show" label="Giá sản phẩm:" align="left">
						<el-row v-if="attr('CheckBox',true).length === 0" :gutter="20">
							<el-col :span="4" :offset="0">
								<Money :max='1000000000' size="mini" :min='0' :fixed='0' v-model="formData.price" clearable></Money>
							</el-col>
						</el-row>

						<el-tabs v-if="attr('CheckBox',true).length > 0 "  type="card" tab-position="top" :closable="false" :addable="false" :editable="false" :stretch="false">
							<el-tab-pane label="Đồng giá">
								<el-table  v-if="sample_variants.length > 0"  :data="sample_variants" :border="false" :highlight-current-row="true" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="light" style="width: 100%">

									<el-table-column v-for="(data,index) in sample_variants[0].variant_attributes" :key="index" :label="data.attribute_name" align="center" width="115">
										<template slot-scope="scope">
											{{scope.row.variant_attributes.find(e=>e.attribute_id == data.attribute_id).option_value}}
										</template>
									</el-table-column>
									<el-table-column label="Giá" align="center" width="180">

										<template slot-scope="scope">
											<Money @change="sync_price" :max='1000000000' :min='0' :fixed='0' v-model="scope.row.variant_price" clearable></Money>

										</template>
									</el-table-column>
									<el-table-column label="Giá KM" align="center" width="180">
										<template slot-scope="scope">
											<Money @change="sync_price" :max='1000000000' :min='0' :fixed='0' v-model="scope.row.variant_special_price" clearable></Money>


										</template>
									</el-table-column>
									<el-table-column label="Ngày KM" align="center" width="180">
										<template slot-scope="scope">
											<el-date-picker @change="sync_price" style="width:140px" v-model="scope.row.variant_promotion_start_date" type="date" placeholder="Ngày bắt đầu" format="dd/MM/yyyy">
											</el-date-picker>
											<br>
											<el-date-picker @change="sync_price" style="width:140px" v-model="scope.row.variant_promotion_end_date" type="date" placeholder="Ngày kết thúc" format="dd/MM/yyyy">
											</el-date-picker>
										</template>
									</el-table-column>
									<el-table-column label="Tồn kho" align="center" width="180">
										<template slot-scope="scope">
											<el-input-number @change="sync_price" v-model="scope.row.variant_quantity" :step="1" controls-position="right" ></el-input-number>
										</template>
									</el-table-column>
									<el-table-column label="SKU" align="center" width="180">
										<template slot-scope="scope">
											<el-input @change="sync_price" v-model="scope.row.variant_sku" autocomplete="off"></el-input>
										</template>
									</el-table-column>
								</el-table>
							</el-tab-pane>
							<el-tab-pane label="Giá riêng biệt">
								<div v-for="(shop,index) in ShopCustom" :key="index" style="margin-bottom:20px">
									<el-tag type="primary" :closable="false" effect="light" size="medium" :disable-transitions="false">
										<i class="el-icon-s-home"></i>
									{{shop.name}}</el-tag>
									<el-table v-if="shop.variants.length > 0"  :data="shop.variants" :border="false" :highlight-current-row="true" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="light" style="width: 100%">

										<el-table-column v-for="(data,index) in shop.variants[0].variant_attributes" :key="index" :label="data.attribute_name" align="center" width="115">
											<template slot-scope="scope">
												{{scope.row.variant_attributes.find(e=>e.attribute_id == data.attribute_id).option_value}}
											</template>
										</el-table-column>
										<el-table-column label="Giá" align="center" width="180">

											<template slot-scope="scope">

												<Money :max='1000000000' :min='0' :fixed='0' v-model="scope.row.variant_price" clearable></Money>


											</template>
										</el-table-column>
										<el-table-column label="Giá KM" align="center" width="180">
											<template slot-scope="scope">
												<Money :max='1000000000' :min='0' :fixed='0' v-model="scope.row.variant_special_price" clearable></Money>



											</template>
										</el-table-column>
										<el-table-column label="Ngày KM" align="center" width="180">
											<template slot-scope="scope">
												<el-date-picker style="width:140px" v-model="scope.row.variant_promotion_start_date" type="date" placeholder="Ngày bắt đầu" format="dd/MM/yyyy">
												</el-date-picker>
												<br>
												<el-date-picker style="width:140px" v-model="scope.row.variant_promotion_end_date" type="date" placeholder="Ngày kết thúc" format="dd/MM/yyyy">
												</el-date-picker>
											</template>
										</el-table-column>
										<el-table-column label="Tồn kho" align="center" width="180">
											<template slot-scope="scope"> 
												<el-input-number v-model="scope.row.variant_quantity" :step="1" controls-position="right"></el-input-number>
											</template>
										</el-table-column>
										<el-table-column label="SKU" align="center" width="180">
											<template slot-scope="scope">
												<el-input v-model="scope.row.variant_sku" autocomplete="off"></el-input>
											</template>
										</el-table-column>
									</el-table>

								</div>
							</el-tab-pane>
						</el-tabs>





					</el-form-item>
					<br>
					<el-form-item align="center">
						<el-button @click="up_show_action" type="primary" :loading="loadingForm" size="medium">Đăng Sản Phẩm</el-button>
					</el-form-item>
				</template>
			</el-form>

		</div>
	</el-card>


</el-col>
<transition name="fade">
	<el-dialog title="Chọn cửa hàng" class="animate__pulse" :visible.sync="up_show" :center="false" :fullscreen="false" top="5vh" width="40%">

		<el-table :data="Result" height="300" :border="true" :highlight-current-row="true" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="light" style="width: 100%">

			<el-table-column label="Tên cửa hàng" align="left" width="300">
				<template slot-scope="scope">
					{{ scope.row.accountec_name }}
				</template>
			</el-table-column>
			<el-table-column label="Tình trạng" align="center" width="235">
				<template slot-scope="scope">
					<el-tag  type="success" v-if="scope.row.success" :closable="false" effect="dark" size="medium" :disable-transitions="false">Đăng thành công</el-tag>

					<el-tag  type="danger" v-if="scope.row.error" :closable="false" effect="dark" size="medium" :disable-transitions="false">{{scope.row.error}}</el-tag>
					<el-button type="primary" v-if="scope.row.loading_up" :loading="true" :plain="true" :round="false" :circle="true" :autofocus="false" size="mini" :disabled="false"></el-button>
					<el-tag  type="info" v-if="!scope.row.loading_up && !scope.row.error && !scope.row.success"  :closable="false" effect="dark" size="medium" :disable-transitions="false">Chuẩn bị</el-tag>
				</template>
			</el-table-column>


		</el-table>


		<span slot="footer">

			<el-button @click="stop = true" type="warning" icon="" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="small" :disabled="false">Dừng</el-button>

		</span>
	</el-dialog>
</transition>
<el-dialog title="Nhập URL sản phẩm trên SENDO,TIKI,LAZADA,SHOPEE" :visible.sync="copy_visible" :center="false" :fullscreen="false" top="25vh" width="45%">
	<el-alert

	type="success">
	<template slot="title">
		Công cụ hỗ trợ sao chép lấy thông tin sản phẩm trên LAZADA,TIKI,SHOPEE,SENDO:
		<br>
		<el-tag style="margin-top: 2px" type="success" :closable="false" effect="dark" size="medium" :disable-transitions="false">1. Tên sản phẩm</el-tag> <br>
		<el-tag style="margin-top: 2px" type="success" :closable="false" effect="dark" size="medium" :disable-transitions="false">2. Mô tả sản phẩm</el-tag> <br>
		<el-tag style="margin-top: 2px" type="success" :closable="false" effect="dark" size="medium" :disable-transitions="false">3. Hình ảnh sản phẩm</el-tag>


	</template>
</el-alert>
<br>
<el-input @keyup.enter.native = "copy_product"  placeholder="Dán link sản phẩm tại đây ..." size="medium" v-model="copy_url" type="text" autocomplete="off"></el-input>
<br>

<span slot="footer">
	<el-button @click="copy_url = '',copy_visible = false">Cancel</el-button>
	<el-button :loading="loading_copy" @click="copy_product" type="primary">Lấy thông tin</el-button>
</span>
</el-dialog>
</el-row>

</template>
<script>
	import Money from '~/components/dashboard/other/money';
	let ClassicEditor
	let CKEditor

	if (process.client) {
		ClassicEditor = require('@ckeditor/ckeditor5-build-classic')
		CKEditor = require('@ckeditor/ckeditor5-vue')
	} else {
		CKEditor = { component : {template:'<div></div>'}}
	}
	function htmlDecode(input) {
		var doc = new DOMParser().parseFromString(input, "text/html");
		return doc.documentElement.textContent;
	}
	
	export default {
		components:{Money,
			ckeditor: CKEditor.component
		},
		data(){
			return {
				checkAll:false,
				up_show:false,
				vari_show:false,
				cols:['Kích thước','Màu sắc','Công suất'],
				cols_select:[],
				editor: ClassicEditor,
				editorData: '<p>Content of the editor.</p>',
				editorConfig: {
					placeholder:'Nhập mô tả sản phẩm tại đây ...',
				},
				copy_visible:false,
				copy_url:'',
				loading_copy:false,
				attr_sub:false,
				
				unit:[
				{value:1,label:'Cái'},
				{value:2,label:'Bộ'},
				{value:3,label:'Chiếc'},
				{value:4,label:'Đôi'},
				{value:5,label:'Hộp'},
				{value:6,label:'Cuốn'},
				{value:7,label:'Chai'},
				{value:8,label:'Thùng'},

				],
				shops:[],
				loadingForm:false,
				formData:{
					shops:[],
					logistics:[],
					name:'',
					sku:'',
					price:0,
					category:[],
					description:'',
					
					attribute:[],
					images:[],
					stock:1,
					height:0,
					length:0,
					width:0,
					weight:0,
					unit_id:1
				},
				ruleForm:{

				},
				LoadCategory:{
					lazy:true,
					lazyLoad:this.lazyLoadAction

				},
				SuggesstionCategory:[],
				dialogImageUrl: '',
				dialogVisible: false,
				auto_category:true,
				date_picker:[],
				result:null,
				price_invi:false,
				shiper:[],
				variation_data:[{...this.cols_select,price:'',stock:'',variation_sku:'',index:Date.now()}],
				stop:false
				
			}
		},
		created:async function(){
			return await this.selectEc();
		},

		computed:{
			
			variation(){
				return JSON.parse(JSON.stringify(this.variation_data)).map(e=>{
					e.tier_index = this.tier_variation.map(({name,options})=>{
						let current_value = e[name];
						return options.indexOf(current_value);
					});
					return e;
				});
			},
			tier_variation(){

				let first = JSON.parse(JSON.stringify(this.variation_data[0]));
				delete first.stock;
				delete first.price;
				delete first.variation_sku;

				let list_name = Object.keys(first);



				return list_name.map(name=>{
					let options = this.variation_data.map(e=>e[name]);
					options = [...new Set(options)];
					return {
						name,
						options
					}
				})

				;
			},
			imgList(){
				return this.formData.images.map(url=>({url}))
			},
			sample_variants(){
				return this.variants().map(variant_attributes=>({
					variant_attributes,
					"variant_sku": "",
					"variant_price": '',
					"variant_promotion_start_date": null,
					"variant_promotion_end_date": null,
					"variant_special_price": '',
					"variant_quantity": 0
				}))
			},
			ShopCustom:{
				get:function(){
					let _ = this;
					return this.result ? this.result : _.formData.shops.map(e=>{
						e.variants = _.variants().map(variant_attributes=>({
							variant_attributes,
							"variant_sku": "",
							"variant_price": '',
							"variant_promotion_start_date": null,
							"variant_promotion_end_date": null,
							"variant_special_price": '',
							"variant_quantity": 0
						}))
						return e;
					});
				},
				set:function(newValue){
					
					return this.result = newValue;
				}
			},
			Result(){
				let _ = this;
				return _.ShopCustom.map(e=>{
					let accountec_id = e.id;
					let accountec_name = e.name;
					let data =  {
						"id":0,
						"sku":_.formData.sku,
						name:e.value,
						"price":_.formData.price,
						"stock":_.formData.stock,
						"description":_.formData.description,
						"category_id":_.formData.category.slice(-1)[0],
						"height":_.formData.height,
						"length":_.formData.length,
						"width":_.formData.width,
						"weight":_.formData.weight/1000,
						"logistics":_.formData.logistics.map(e=>({logistic_id:parseInt(e.split('-')[0]),enabled:true})),
						"attributes":_.attr().map(e=>{
							return {
								"attributes_id": e.attribute_id,
								"value": e.select,

							}
						}),
						variation:_.variation,
						tier_variation:_.tier_variation,
						
						//variants:e.variants,
						
						"images":_.formData.images.map(url=>({url})),
						
					};
					return {accountec_id,accountec_name,ec:'shopee',data,loading_up:false}
					
				})
			}
		},
		methods:{
			async selectEc(){
				

				let {data} = await this.$axios.post('/api/accountec/get',{ec:'shopee'});
				if(data.error) throw data.error;
				this.shops = data.map(e=>{
					e.value = '';
					return e
				});
				await this.GetShipping();
				
			},
			LoadImg(ec){
				if(ec === 'lazada'){
					return 'https://res.cloudinary.com/doo4xi4rh/image/upload/v1596352417/lazada_iwt280.png';
				}else if(ec === 'sendo'){
					return 'https://res.cloudinary.com/dtll0jawl/image/upload/v1601083584/ta%CC%89i_xuo%CC%82%CC%81ng_ezrkiq.png';
				}else if(ec === 'shopee'){
					return 'https://res.cloudinary.com/doo4xi4rh/image/upload/v1596620226/shopee_digvyt.png';
				}else if(ec === 'tiki'){
					return 'https://res.cloudinary.com/doo4xi4rh/image/upload/v1596678094/ta%CC%89i_xuo%CC%82%CC%81ng_ccxrej.png';
				}
			},
			async up_show_action(){
				this.up_show = true;
				for(let obj of this.Result){
					
					obj.loading_up = true;
					let {data} = await this.$axios.post('/api/product/up',obj);
					obj.success = data === 'OK' ? true : false;
					obj.error = data.error;
					obj.loading_up = false;
					if(this.stop) break;

				}
			},
			
			selectAllShop(){
				return this.formData.shops = this.checkAll ? this.shops : [];
			},
			remove_price(index){
				return this.variation_data = this.variation_data.filter(e=>e.index !== index)
			},
			push_price(){
				this.variation_data.push({price:'',stock:'',sku:'',index:Date.now()})
			},
			async removeShiping(logistic){

				return await this.$axios.post('/api/product/update-shiping-shopee',{logistic_id:logistic.split('-')[0],enabled:false});
				
			},
			async updateShiping(list_logistic){
				try{
					let {data} = await this.$axios.post('/api/product/update-shiping-shopee',{logistic_id:list_logistic.slice(-1)[0].split('-')[0],enabled:true});
					if(data.error) throw data.error;
					return;
				}catch(error){
					this.$message({type:'error',message:error});
				}
				
			},
			async Submit(){
				
				for(let e of this.Result){
					try{
						if((e.data.price === 0) && (e.data.variation.length === 0)) throw 'Giá sản phẩm không được để trống.';
						e.data.price = (e.data.price === 0) ? e.data.variation[0].price : e.data.price;
						let {data} = await this.$axios.post('/api/product/up',{accountec_id:e.accountec_id,data:e.data,ec:'shopee'});
						if(data.error) throw data.error;
						this.$message({type:'success',message:'SUCCESS'});
					}catch(error){
						this.$message({type:'error',message:error});
					}
					
				}
			},
			async copy_product(){
				this.loading_copy = true;
				try{
					let {data} = await this.$axios.post('/api/product/copy',{url:this.copy_url});

					if(data.error) throw data.error;
					this.formData.name = data.ten_san_pham;
					
					this.formData.sku = data.skuId;
					this.formData.description = htmlDecode(data.mo_ta.replace(/<[^>]+>/g, ''));
					this.formData.images = data.full_img_product;
					let category_suggess = this.copy_url.includes('https://shopee.vn') ? data.danh_muc : [];
					await this.SameValueInput(data.ten_san_pham,category_suggess);

					
					this.formData.attribute = this.formData.attribute.map(e=>{
						let find_attr = data.attributes.filter(({id})=>id == e.attribute_id);
						e.select = find_attr.length > 0 ? find_attr[0].value : '';
						return e;
					});
					
					
				}catch(error){
					this.$message({type:'error', message:error})
				}
				this.loading_copy = false;
				this.copy_visible = false;
				this.copy_url = '';
				
			},
			sync_price(){
				let _ = this;
				let value = _.sample_variants;
				_.ShopCustom = _.ShopCustom.map(e=>{
					e.variants = JSON.parse(JSON.stringify(_.sample_variants));
					return e;
				});
				
				
			},
			async SameValueInput(value,category = []){
				
				let _ = this;
				_.formData.shops = _.formData.shops.map(e=>{
					if(e.value.trim().length === 0 ) e.value = value;
					return e;
				});
				if(category.length === 0){
					await this.GetSuggesstionCategory();

				} else{
					this.SuggesstionCategory = category;
					this.formData.category = category.map(({category_id})=>category_id);
					await this.GetAttribute();
				}
				
			},
			async GetShipping(){
				let {data} = await this.$axios.post('/api/product/ship-shopee');
				this.shiper = data;
				this.formData.logistics = data.filter(({enabled})=>enabled).map(({logistic_id,logistic_name})=>logistic_id+'-'+logistic_name);
				return;
			},
			attr(type_attr = null,required = false){
				let _ = this;
				let list_attribute =  _.formData.attribute.filter(({attribute_id,attribute_name,attribute_type,input_type,is_mandatory,options})=>(type_attr ? input_type === type_attr : true) && ((!_.attr_sub ||  required) ? is_mandatory : true));
				
				return list_attribute;

			},
			get_variants(){
				
				let attr = [];
				let list_attribute = this.attr('CheckBox').filter(({is_required})=>is_required);
				
				for(let attribute of list_attribute){
					let attr_option = [];
					let {id,name,select} = attribute;
					for(let option of select){
						attr_option.push({attribute_id:id,attribute_name:name,option_id:option.id,option_value:option.value});
					}
					attr.push(attr_option);

				};
				return attr;

			},
			variants(varia_data = [],i = 0,result = []){

				varia_data = varia_data.length === 0 ? this.get_variants() : varia_data;
				if(varia_data.length === 0) return result;

				if(i === 0){
					result = varia_data[0].map(e=>[e]);
					
				}else{
					let result_now = [];
					
					for(let data of varia_data[i]){
						let push_data = result.map(e=>e.concat(data));
						result_now = result_now.concat(push_data);

					};

					result = result_now;
				}
				i+=1;
				if(!varia_data[i]) return result;

				return this.variants(varia_data,i,result);
			},
			async lazyLoadAction(node, resolve) {
				const { level,value,leaf } = node;

				let {data} = await this.$axios.post('/api/category/get',{ec:'shopee',parent_id:level ? value : '0'});

				return resolve(data.map(({category_id,name,leaf})=>({label:name,value:category_id,leaf}))) ;
			},
			
			async GetAttribute(){
				let category_id = this.formData.category.slice(-1)[0].toString();
				
				let {data} = await this.$axios.post('/api/category/attribute-shopee',{category_id});
				
				return this.formData.attribute = data.map(e=>{
					e.select = [];
					return e;
				});
				
				
			},
			async GetSuggesstionCategory(){
				try{
					if(!this.formData.name) throw null;
					let {data} = await this.$axios.post('/api/category/suggestion-shopee',{keyword:this.formData.name});
					if(data.error) throw data.error;

					this.SuggesstionCategory = data;
					this.formData.category = data.map(({category_id})=>category_id);

					await this.GetAttribute();
					
				}catch(error){
					this.$message({type:'error',message:error});
				}
				
				
			},
			async handleRemove(file, fileList) {
				this.formData.images = this.formData.images.filter(url=>url !== file.url)
				
				return await this.$axios.post('/api/up/remove-image',{public_id:file.public_id})
			},
			handleSuccess(file){
				return this.formData.images.push(file.secure_url);
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			goBack(){
				return this.$router.push('/dashboard/san-pham/tao-san-pham')
			}
			
		}
	}
</script>
<style scoped>

.attr_text{
	font-size:16px;
}
.change_button{
	margin-top:-10px;
}
.card_ec:hover{
	border: 1px solid blue;
	cursor: pointer;
}
</style>