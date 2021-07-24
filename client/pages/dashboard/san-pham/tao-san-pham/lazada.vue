<template>
	

	<el-row :gutter="20">
		<el-col :span="24" :offset="0">



			<el-card :body-style="{ padding: '0px' }" shadow="hover">
				<div slot="header">
					<el-row :gutter="20">
						<el-col :span="12" :offset="0">
							<el-button type="text" @click="goBack" icon="el-icon-back" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="medium" :disabled="false">
								<img style="margin-left: 15px;margin-bottom: -5px" :src="LoadImg('lazada')">
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
							<el-checkbox v-for="(data,index) in shops" :key="index" @change="selectShop" v-model="formData.shops" :label="data" :border="false" :checked="false" :disabled="false">{{data.name}}</el-checkbox>
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
							<el-collapse v-if="formData.shops.length > 1">
								<el-collapse-item name="1">
									<template slot="title">
										<center>
											<i style="color:green" class="el-icon-caret-right"></i> Thêm tên khác
										</center>
									</template> 
									<div v-for="(data,index) in formData.shops" :key="index" style="margin-bottom: 20px">
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
						<ckeditor :editor="editor" v-model="formData.description" :config="editorConfig"></ckeditor>
						
					</el-form-item>

					
					<el-form-item v-if="attr(null,false).length > 0" align="left">
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
						

						<template v-if="attr('singleSelect').length > 0">
							<el-row :gutter="20">
								<el-col v-if="attr('singleSelect').find(({name})=>name === 'brand')" :span="6" :offset="0">
									<el-badge :hidden="!attr('singleSelect').find(({name})=>name === 'brand').is_mandatory" is-dot class="item">
										<el-autocomplete
										v-model="formData.brand"
										:fetch-suggestions="querySearchAsyncBrand"
										placeholder="Nhập tên thương hiệu"
										size="medium"
										></el-autocomplete>
									</el-badge>
								</el-col>
							</el-row>

							<br v-if="attr('singleSelect').find(({name})=>name === 'brand')">
							<div v-for="(top,index) in Math.ceil((attr_normal('singleSelect').length)/4)" :key="index">
								
								<el-row :gutter="20">
									

									<el-col v-for="(attribute,index2) in attr_normal('singleSelect').slice(index*4,(index*4)+4)" :key="index2" :span="6" :offset="0" >
										
										<el-badge :hidden="!attribute.is_mandatory" is-dot class="item">

											<el-select filterable v-model="attribute.select" size="medium" :placeholder="TranslateText(attribute.label)">
												<el-option v-for="(data,index3) in attribute.options" :key="index3" :label="data.name" :value="data.name" :disabled="false">{{TranslateText(data.name)}}</el-option>
											</el-select>
										</el-badge>
									</el-col>
								</el-row>
								<br v-if="attr_normal('singleSelect').length > 4">
							</div>
							<el-divider direction="horizontal"></el-divider>

						</template>

						<template v-if="attr_normal('multiSelect').length > 0">

							<div v-for="(top,index) in Math.ceil((attr_normal('multiSelect').length)/4)">
								<el-row :gutter="20">



									<el-col v-for="(attribute,index2) in attr_normal('multiSelect').slice(index*4,(index*4)+4)" :key="index2" :span="6" :offset="0" >
										<el-badge :hidden="!attribute.is_mandatory" is-dot class="item">
											<el-select filterable v-model="attribute.select" size="medium" :placeholder="TranslateText(attribute.label)">
												<el-option v-for="(data,index3) in attribute.options" :key="index3" :label="data.name" :value="data.name" :disabled="false">{{TranslateText(data.name)}}</el-option>
											</el-select>
										</el-badge>
									</el-col>
								</el-row>
								<br v-if="attr_normal('multiSelect').length > 4">
							</div>
							<el-divider direction="horizontal"></el-divider>

						</template>
						<template v-if="attr_normal('enumInput').length > 0">

							<div v-for="(top,index) in Math.ceil((attr_normal('enumInput').length)/4)">
								<el-row :gutter="20">



									<el-col v-for="(attribute,index2) in attr_normal('enumInput').slice(index*4,(index*4)+4)" :key="index2" :span="6" :offset="0" >
										<el-badge :hidden="!attribute.is_mandatory" is-dot class="item">
											<el-select filterable v-model="attribute.select" size="medium" :placeholder="TranslateText(attribute.label)">
												<el-option v-for="(data,index3) in attribute.options" :key="index3" :label="data.name" :value="data.name" :disabled="false">{{TranslateText(data.name)}}</el-option>
											</el-select>
										</el-badge>
									</el-col>
								</el-row>
								<br v-if="attr_normal('enumInput').length > 4">
							</div>
							<el-divider direction="horizontal"></el-divider>

						</template>
						<template v-if="attr_normal('text').length > 0">

							<div v-for="(top,index) in Math.ceil((attr_normal('text').length)/4)">

								<el-row :gutter="20">
									<el-col v-for="(attribute,index2) in attr_normal('text').slice(index*4,(index*4)+4)" :key="index2" :span="6" :offset="0">
										<span>{{TranslateText(attribute.label)}} :</span> 
										<br>
										<el-badge :hidden="!attribute.is_mandatory" is-dot class="item">
											<el-input :placeholder="TranslateText(attribute.label)" v-model="attribute.selectText" size="medium" type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
										</el-badge>
									</el-col>
								</el-row>
								<br v-if="attr_normal('text').length > 4">
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


					
					<el-row :gutter="20">
						<el-col :span="6" :offset="0">
							<el-form-item label="Khối lượng (g):" align="left">
								<el-input-number v-model="formData.weight" style="width: 60%" controls-position="right"  :min="0" :max="100000"></el-input-number>
							</el-form-item>
						</el-col>
						<el-col :span="6" :offset="0">
							<el-form-item label="Chiều dài (cm):" align="left">
								<el-input-number v-model="formData.length" style="width: 60%"  controls-position="right"  :min="0" :max="100000"></el-input-number>
							</el-form-item>
						</el-col>
						<el-col :span="6" :offset="0">
							<el-form-item label="Chiều rộng (cm):" align="left">
								<el-input-number v-model="formData.width" style="width: 60%"  controls-position="right"  :min="0" :max="100000"></el-input-number>
							</el-form-item>
						</el-col>
						<el-col :span="6" :offset="0">
							<el-form-item label="Chiều cao (cm):" align="left">
								<el-input-number v-model="formData.height" style="width: 60%"  controls-position="right"  :min="0" :max="100000"></el-input-number>
							</el-form-item>
						</el-col>




					</el-row>
					<el-divider direction="horizontal"></el-divider>

					<el-row :gutter="20">
						<el-col :span="12" :offset="0">
							Thiết lập giá bán:
						</el-col>
						<el-col align="right" :span="12" :offset="0">
							Phân loại <el-switch v-model="variation_mode" active-color="#13ce66" inactive-color="#ff4949" :disabled="false"></el-switch>
						</el-col>
					</el-row>
					<br><br>

					<div v-if="!variation_mode">
						<el-row :gutter="20">
							<el-col :span="4" :offset="0">
								<span>Giá sản phẩm:</span><br><br>
								<Money :max='1000000000' :min='0' :fixed='0' v-model="indi_product.price" clearable></Money>

							</el-col>
							<el-col :span="4" :offset="0">
								<span>Giá khuyến mại:</span><br><br>
								<Money placeholder="Nhập giá khuyến mại" :max='1000000000' :min='0' :fixed='0' v-model="indi_product.special_price" clearable></Money>


							</el-col>
							<el-col :span="8" :offset="0">
								<span>Thời gian khuyến mại:</span><br><br>
								<el-row :gutter="20">
									<el-col :span="12" :offset="0">
										<el-date-picker style="width:100%" v-model="indi_product.special_from_date" type="date" placeholder="Ngày bắt đầu" format="dd/MM/yyyy">
										</el-date-picker>
									</el-col>
									<el-col :span="12" :offset="0">
										<el-date-picker style="width: 100%" v-model="indi_product.special_to_date" type="date" placeholder="Ngày kết thúc" format="dd/MM/yyyy"></el-date-picker>
									</el-col>
								</el-row>
								

								
							</el-col>
							<el-col :span="4" :offset="0">
								<span>Tồn kho:</span><br><br>
								<el-input-number style="width: 100%" v-model="indi_product.quantity" :step="1" controls-position="right"></el-input-number>
							</el-col>
							<el-col :span="4" :offset="0">
								<span>SKU:</span><br><br>
								<el-input size="medium" style="width: 100%" v-model="indi_product.SellerSku" autocomplete="off"></el-input>
							</el-col>
						</el-row>

					</div>

					<div v-if="variation_mode">
						<el-row :gutter="20">

							<el-col v-for="(data,index) in variation_list" :key="index" :span="6" :offset="0">
								<el-badge :hidden="!data.is_mandatory" is-dot class="item">
									<el-select @change="get_list_property" style="width:100%" v-model="data.select" allow-create multiple filterable default-first-option :placeholder="data.label">
										<el-option v-for="(item,index) in data.options" :key="index" :label="item.name"  :value="item.name"></el-option>
									</el-select>
								</el-badge>
							</el-col>
						</el-row>
						<br>
						<center v-show="variation_list.length === 0" style="color:#b3b3b3">Không có dữ liệu</center>
						<el-row v-if="list_property.length > 0" :gutter="20">

							<el-col :span="24" :offset="0">

								<el-tabs v-model="tab_name" @tab-click="syncPriceActive" type="border-card" tab-position="top" :closable="false" :addable="false" :editable="false" :stretch="false">
									<el-tab-pane name="a" label="Thiết lập giá chung">
										<el-table :data="list_property" :border="true" :highlight-current-row="true" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="light" style="width: 100%">


											<el-table-column v-for="(data,index) in variation_list" :key="index" :label="data.label" :prop="data.name" align="center" :sortable="false" :fixed="false" width="137"/>

											<el-table-column label="Giá" align="center" width="150">

												<template slot-scope="scope">

													<Money @change="syncPrice('price')" :max='1000000000' :min='0' :fixed='0' v-model="scope.row.price" clearable></Money>


												</template>
											</el-table-column>
											<el-table-column label="Giá KM" align="center" width="150">
												<template slot-scope="scope">
													<Money @change="syncPrice('special_price')" :max='1000000000' :min='0' :fixed='0' v-model="scope.row.special_price" clearable></Money>



												</template>
											</el-table-column>
											<el-table-column label="Ngày KM" align="center" width="200">
												<template slot-scope="scope">
													<el-date-picker @change="syncPrice('special_from_date')" style="width:150px" v-model="scope.row.special_from_date" type="date" placeholder="Ngày bắt đầu" format="dd/MM/yyyy">
													</el-date-picker>
													<br>
													<el-date-picker @change="syncPrice('special_to_date')" style="width:150px" v-model="scope.row.special_to_date" type="date" placeholder="Ngày kết thúc" format="dd/MM/yyyy">
													</el-date-picker>
												</template>
											</el-table-column>
											<el-table-column label="Tồn kho" align="center" width="160">
												<template slot-scope="scope"> 
													<el-input-number @blur="syncPrice('quantity')" style="width: 120px" v-model="scope.row.quantity" :step="1" controls-position="right"></el-input-number>
												</template>
											</el-table-column>
											<el-table-column label="SKU" align="center" width="150">
												<template slot-scope="scope">
													<el-input size="small" style="width: 100%" @change="syncPrice('SellerSku')" v-model="scope.row.SellerSku" autocomplete="off"></el-input>
												</template>
											</el-table-column>

										</el-table>
									</el-tab-pane>
									<el-tab-pane name="b" label="Thiết lập giá theo cửa hàng">
										<div v-for="(shop,index) in formData.shops" :key="index" style="margin-bottom:20px">

											<el-tag type="primary" :closable="false" effect="light" size="medium" :disable-transitions="false">
												<i class="el-icon-s-home"></i>
											{{shop.name}}</el-tag>

											<el-table v-if="shop.variants.length > 0"  :data="shop.variants" :border="true " :highlight-current-row="true" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="light" style="width: 100%">
												<el-table-column v-for="(data,index) in variation_list" :key="index" :label="data.label" :prop="data.name" align="center" :sortable="false" :fixed="false" width="137"/>

												<el-table-column label="Giá" align="center" width="150">

													<template slot-scope="scope">

														<Money :max='1000000000' :min='0' :fixed='0' v-model="scope.row.price" clearable></Money>


													</template>
												</el-table-column>
												<el-table-column label="Giá KM" align="center" width="150">
													<template slot-scope="scope">
														<Money :max='1000000000' :min='0' :fixed='0' v-model="scope.row.special_price" clearable></Money>



													</template>
												</el-table-column>
												<el-table-column label="Ngày KM" align="center" width="200">
													<template slot-scope="scope">
														<el-date-picker style="width:150px" v-model="scope.row.special_from_date" type="date" placeholder="Ngày bắt đầu" format="dd/MM/yyyy">
														</el-date-picker>
														<br>
														<el-date-picker style="width:150px" v-model="scope.row.special_to_date" type="date" placeholder="Ngày kết thúc" format="dd/MM/yyyy">
														</el-date-picker>
													</template>
												</el-table-column>
												<el-table-column label="Tồn kho" align="center" width="160">
													<template slot-scope="scope"> 
														<el-input-number style="width: 120px" v-model="scope.row.quantity" :step="1" controls-position="right"></el-input-number>
													</template>
												</el-table-column>
												<el-table-column label="SKU" align="center" width="150">
													<template slot-scope="scope">
														<el-input size="small" style="width: 100%" v-model="scope.row.SellerSku" autocomplete="off"></el-input>
													</template>
												</el-table-column>
											</el-table>
										</div>
									</el-tab-pane>
								</el-tabs>

							</el-col>
						</el-row>


					</div>


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

		<el-table :data="result_info" height="300" :border="true" :highlight-current-row="true" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="light" style="width: 100%">

			<el-table-column label="Tên cửa hàng" align="left" width="300">
				<template slot-scope="scope">
					{{ scope.row.accountec_name }}
				</template>
			</el-table-column>
			<el-table-column label="Tình trạng" align="center" width="300">
				<template slot-scope="scope">
					<el-tag  type="success" v-if="scope.row.success" :closable="false" effect="dark" size="medium" :disable-transitions="false">Đăng thành công</el-tag>
					<el-tag  type="danger" v-if="scope.row.error" :closable="false" effect="dark" size="mini" :disable-transitions="false">{{scope.row.error}}</el-tag>

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
<el-dialog title="Nhập URL sản phẩm trên LAZADA" :visible.sync="copy_visible" :center="false" :fullscreen="false" top="25vh" width="45%">
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
<el-input @keyup.enter.native = "copy_product" placeholder="Dán link sản phẩm tại đây ..." size="medium" v-model="copy_url" type="text" autocomplete="off"></el-input>
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
	let CkEditor_Align

	if (process.client) {
		ClassicEditor = require('@ckeditor/ckeditor5-build-classic')
		CKEditor = require('@ckeditor/ckeditor5-vue')
		//CkEditor_Align = require('@ckeditor/ckeditor5-alignment');
	} else {
		CKEditor = { component : {template:'<div></div>'}}
	}
	
	export default {
		components:{Money,
			ckeditor: CKEditor.component
		},
		data(){
			return {
				property:[],
				indi_product:{
					price:'',
					special_price:'',
					special_from_date:'',
					special_to_date:'',
					quantity:undefined,
					SellerSku:''
				},
				
				field_required:['name','short_description','description','SellerSku','name_en','quantity','__images__','package_height','package_width','package_length','package_weight','package_content','delivery_option_economy','special_to_date','special_from_date','description_en','delivery_option_express','special_price','price'],
				checkAll:false,
				up_show:false,
				vari_show:false,
				cols:['Kích thước','Màu sắc','Công suất'],
				cols_select:[],
				editor: ClassicEditor,
				editorData: '<p>Content of the editor.</p>',
				editorConfig: {
					//plugins: [CkEditor_Align],
					placeholder:'Nhập mô tả sản phẩm tại đây ...',
					alignment: {
						options: [ 'left', 'right' ]
					}
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
					brand:'No Brand',
					
					attribute:[],
					images:[],
					stock:1,
					height:undefined,
					length:undefined,
					width:undefined,
					weight:undefined,
					
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
				
				price_invi:false,
				shiper:[],
				variation_data:[{...this.cols_select,price:'',stock:'',variation_sku:'',index:Date.now()}],
				stop:false,
				list_property:[],
				price_of_shop:false,
				tab_name:'a',
				result_info:[],
				translate:[],
				variation_list:[],
				variation_mode:false,
				
				
			}
		},
		created:async function(){
			return await this.selectEc();
		},
		
		computed:{
			
			

			
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
			
			
		},

		methods:{
			
			make_variation_list(data){
				

				return this.variation_list = data.filter(({is_sale_prop})=>is_sale_prop).map(e=>{
					e.select = [];
					return e;
				})
			},
			async MakeTranslate(category_id){
				let {data} = await this.$axios.post('/api/category/translate-lazada',{category_id});
				return this.translate = (data.length === 0) ? [] : data[0].data.map(e=>{
					e.en_code = e.en.toLowerCase().replace(/ /g,'');
					return e;
				});
			},
			TranslateText(str){
				let str_code = str.toLowerCase().replace(/ /g,'');
				let find_vi = this.translate.find(({en_code})=>en_code === str_code);
				return find_vi ? find_vi.vi : str;
			},
			DateFormat(datetime){
				let time = new Date(datetime);
				let date = time.getDate();
				let month = time.getMonth()+1;
				let year = time.getFullYear();
				return year+'-'+((month.toString().length === 1) ? '0'+month : month)+'-'+((date.toString().length === 1) ? '0'+date : date)+' 00:15'
			},
			syncPriceActive({name}){
				if(name === 'b') this.price_of_shop = true;
			},
			syncPrice(col){
				
				let _ = this;
				if(!_.price_of_shop){
					return this.formData.shops.map(e=>{
						e.variants = e.variants.map(i=>{
							
							i[col] = JSON.parse(JSON.stringify(_.list_property))[0][col];
							return i
						});
						return e;
					})
				}else{
					this.$confirm('Bạn có muốn đồng bộ giá trị này sang các cửa hàng ?', 'Thay đổi giá trị', {
						confirmButtonText: 'OK',
						cancelButtonText: 'Cancel',
						type: 'warning'
					}).then(() => {
						_.price_of_shop = false;
						return this.syncPrice(col);
					}).catch(() => {
						this.$message({
							type: 'info',
							message: 'Giá trị chưa thay đổi'
						});          
					});
				}
			},
			Make_Result(){
				let _ = this;
				let list_attribute  = [..._.attr_normal('singleSelect'),..._.attr_normal('multiSelect'),..._.attr_normal('text')].filter(({select,selectText})=>(select.length > 0) || selectText).map(e=>{
					let obj = {};
					obj[e.name] = (e.input_type === 'text') ? [e.selectText] : [e.select];
					return obj;
				}).reduce(((previous,current)=>({...current,...previous})),{});

				return _.formData.shops.map(e=>{
					let accountec_id = e.id;
					let accountec_name = e.name;
					let Skus = [];
					if(e.variants.length === 0){
						Skus = [{
							"Sku": [{
								price:_.indi_product.price,
								special_price:_.indi_product.special_price,
								special_from_date:_.DateFormat(_.indi_product.special_from_date),
								special_to_date:_.DateFormat(_.indi_product.special_to_date),
								quantity:_.indi_product.quantity,
								SellerSku:_.indi_product.SellerSku,
								"package_length": [_.formData.length],
								"package_height": [_.formData.height],
								"package_weight": [_.formData.weight/1000],
								"package_width": [_.formData.width],
								"package_content": [e.value],
								"Images": [{"Image": _.formData.images.map(url=>url).slice(0,7)}]
							}]
						}]
					}else{
						Skus = e.variants.map(i=>{

							let sku_property = Object.keys(i).map(key=>{
								let obj = {};
								obj[key] = [i[key]];
								return obj;
							});

							let list_property_value = sku_property.reduce(((previous,current)=>({...current,...previous})),{});

							if(list_property_value['special_from_date'][0]) list_property_value['special_from_date'][0] = _.DateFormat(list_property_value['special_from_date'][0]);
							if(list_property_value['special_to_date'][0]) list_property_value['special_to_date'][0] = _.DateFormat(list_property_value['special_to_date'][0]);

							return {
								"Sku": [{
									...list_property_value,
									"package_length": [_.formData.length],
									"package_height": [_.formData.height],
									"package_weight": [_.formData.weight/1000],
									"package_width": [_.formData.width],
									"package_content": [e.value],
									"Images": [{"Image": _.formData.images.map(url=>url).slice(0,7)}]
								}]
							}
						})
					}
					let data =  {
						"Request": {
							"Product": [{
								"PrimaryCategory": [_.formData.category.slice(-1)[0]],
								"SPUId": [""],
								"AssociatedSku": [""],
								"Attributes": [{
									"name": [e.value],
									"short_description": [e.value],
									"description": [_.formData.description],
									"brand":[_.formData.brand],
									...list_attribute
								}],
								Skus
								
								
							}]
						}
					};

					return {accountec_id,accountec_name,ec:'lazada',data,loading_up:false}
					
				})
				
			},
			selectShop(){
				let _ = this;
				return this.formData.shops.map(e=>{
					e.variants = !e.variants ? JSON.parse(JSON.stringify(_.list_property)) : e.variants;
					return e;
				})
			},
			get_list_property(){
				
				let _ = this;
				let property_select = _.variation_list.map(({name,select})=>select.map(val=>{
					let obj = {};
					obj[name] = val;
					return obj;
				}));
				let result = [];
				let limit = (property_select.length > 1) ? property_select.length-1 : property_select.length;
				for(let i = 0;i<limit;i++){
					let first_array = (result.length === 0) ?  property_select[i] : result;
					let second_array = property_select[i+1];
					let data = [];

					for(let obj of first_array){


						if(property_select.length === 1){
							data.push({...obj})
						}else{
							for(let obj2 of second_array){
								data.push({...obj,...obj2})
							}
						}
						
					};
					result = data;

				}
				
				
				let full_property = result.map(e=>{
					e.SellerSku = '';
					e.quantity = '';
					e.price = '';
					e.special_price = '';
					e.special_from_date = '';
					e.special_to_date = '';
					return e;

				});
				this.list_property = full_property;
				this.formData.shops.map(e=>{
					e.variants = JSON.parse(JSON.stringify(full_property));
					return e;
				});
				return;

				
			},
			async querySearchAsyncBrand(keyword,cb){
				
				let {data} = await this.$axios.post('/api/product/brand-lazada',{keyword});
				
				let result = data.map(e=>{
					e.value = e.name_en;
					return e;
				});
				result.unshift({label:'Không có thương hiệu',value:'No Brand'})
				
				return cb(result);
			},
			async selectEc(){
				

				let {data} = await this.$axios.post('/api/accountec/get',{ec:'lazada'});
				if(data.error) throw data.error;
				this.shops = data.map(e=>{
					e.value = '';
					return e
				});
				
				
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
				this.result_info = this.Make_Result();

				for(let obj of this.result_info){
					
					obj.loading_up = true;
					let {data} = await this.$axios.post('/api/product/up',obj);
					obj.success = data === 'OK' ? true : false;
					obj.error = data.error;
					obj.loading_up = false;
					if(this.stop) break;

				}
			},
			
			selectAllShop(){
				this.formData.shops = (this.checkAll ? this.shops : []);
				return this.selectShop();

			},
			remove_price(index){
				return this.variation_data = this.variation_data.filter(e=>e.index !== index)
			},
			push_price(){
				this.variation_data.push({price:'',stock:'',sku:'',index:Date.now()})
			},
			async Submit(){
				let result = this.Make_Result();
				
				for(let e of result){
					try{
						if((e.data.price === 0) && (e.data.variation.length === 0)) throw 'Giá sản phẩm không được để trống.';
						e.data.price = (e.data.price === 0) ? e.data.variation[0].price : e.data.price;
						let {data} = await this.$axios.post('/api/product/up',{accountec_id:e.accountec_id,data:e.data,ec:'lazada'});
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
					this.formData.description = data.mo_ta.replace(/\n/g, "<br />");
					this.formData.images = data.full_img_product;
					let category_suggess = this.copy_url.includes('lazada.vn') ? data.danh_muc : [];
					await this.SameValueInput(data.ten_san_pham,category_suggess,this.copy_url.includes('lazada.vn') ? null : (this.copy_url.includes('sendo.vn') ? data.danh_muc.pop().name : (this.copy_url.includes('shopee.vn') ? data.danh_muc.pop().name : null)));

					/*
					this.formData.attribute = this.formData.attribute.map(e=>{
						let find_attr = data.attributes.filter(({id})=>id == e.attribute_id);
						e.select = find_attr.length > 0 ? find_attr[0].value : '';
						return e;
					});
					*/
					
					
				}catch(error){
					this.$message({type:'error', message:error})
				}
				this.loading_copy = false;
				this.copy_visible = false;
				this.copy_url = '';
				return;
				
			},
			sync_price(){
				let _ = this;
				let value = _.sample_variants;
				_.ShopCustom = _.ShopCustom.map(e=>{
					e.variants = JSON.parse(JSON.stringify(_.sample_variants));
					return e;
				});
				
				
			},
			async SameValueInput(value,category = [],keyword = undefined){
				
				let _ = this;
				_.formData.shops = _.formData.shops.map(e=>{
					if(e.value.trim().length === 0 ) e.value = value;
					return e;
				});
				if(category.length === 0){
					await this.GetSuggesstionCategory(keyword);

				} else{
					this.SuggesstionCategory = category;
					this.formData.category = category.map(({category_id})=>category_id);
					await this.GetAttribute();
				}
				
			},
			
			attr(type_attr = null,required = false){
				let _ = this;
				
				let list_attribute = _.formData.attribute.filter(({name,input_type,options,is_mandatory,label,attribute_type})=>(type_attr ? (input_type === type_attr) : true) && ((!_.attr_sub ||  required) ? is_mandatory : true));
				
				return list_attribute;

			},
			

			attr_normal(type_attr = null,required = false){
				let _ = this;
				return _.attr(type_attr,required).filter(({name,is_sale_prop})=>(name !== 'brand') && !is_sale_prop && !_.field_required.includes(name));
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

				let {data} = await this.$axios.post('/api/category/get',{ec:'lazada',parent_id:level ? value : '1'});

				return resolve(data.map(({category_id,name,leaf})=>({label:name,value:category_id,leaf}))) ;
			},
			
			async GetAttribute(){
				let category_id = this.formData.category.slice(-1)[0].toString();
				
				let {data} = await this.$axios.post('/api/category/attribute-lazada',{category_id});
				await this.MakeTranslate(category_id);

				this.formData.attribute = data.map(e=>{
					e.select = [];
					return e;
				});
				this.make_variation_list(data);
				return;
				
				
			},
			async GetSuggesstionCategory(keyword){
				keyword = keyword ? keyword : this.formData.name;
				try{
					if(!keyword) return;
					let {data} = await this.$axios.post('/api/category/suggestion-lazada',{keyword});
					if(data.error) throw data.error;

					this.SuggesstionCategory = data;
					this.formData.category = data.map(({category_id})=>category_id);

					await this.GetAttribute();
					
				}catch(error){
					this.$message({type:'error',message:error});
				};
				return;
				
				
			},
			async handleRemove(file, fileList) {
				this.formData.images = this.formData.images.filter(url=>file.url !== url);
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