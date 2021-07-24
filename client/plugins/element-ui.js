import Vue from 'vue'
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/vi'
locale.el.datepicker.year = '';
Vue.use(Element, { locale })
