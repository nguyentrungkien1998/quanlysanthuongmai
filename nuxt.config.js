let port = 8080;
let host = 'http://localhost';

module.exports = {
	dev:true,
	
	ssr: false,
	env: {
		baseUrl: host
	},
	auth: {
		redirect: {
			login: '/dang-nhap',
			logout: '/',
			callback: '/dang-nhap',
			home: '/dashboard'
		}
	},
	server: {port,host},
	permission:[],
	code_update:'23t4fdfag56htrsfdjkfdg4334fslaasd93tedddfthgf4y533333tqfsdae',
	crypt:{
		key:'ibsd83ibu20isdbe043a89sdhf7wfh79feksdfhdu2erh9221ffb389fn920cdsn',
		index:43
	},
	axios:{
		baseURL:host+':'+port,
		https:false,
	},
	limit_log:50,
	router: {
		middleware: ['guest']
	},
	head: {
		title: 'SEU.VN Professional',
		meta: [
		{ charset: 'utf-8' },
		{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
		{ hid: 'description', name: 'description', content: 'Phần mềm quản lí bán hàng online SEU.VN' }
		],
		link: [
		{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
		{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
		],
		script: [
		{ src: '/ckeditor/ckeditor.js' }
		]
	},
	loading: { color: 'black' },
	srcDir: 'client/',
	css: [
	'element-ui/lib/theme-chalk/index.css'
	],
	modules: ['@nuxtjs/axios'],
	buildModules: [],
	plugins: [
	'@/plugins/element-ui',
	{ src: '@/plugins/vue-chart.js', ssr: false },
	{src: '@/plugins/socket.io.js', ssr:false,spa:true}
	],
	build: {
		transpile: [/^element-ui/],
		extend ( config, { isDev, isClient, isServer } ) {

		}
	}
};
