import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _050efc22 = () => interopDefault(import('../client/pages/dashboard.vue' /* webpackChunkName: "pages/dashboard" */))
const _3f426125 = () => interopDefault(import('../client/pages/dashboard/index.vue' /* webpackChunkName: "pages/dashboard/index" */))
const _490c0308 = () => interopDefault(import('../client/pages/dashboard/don-hang/index.vue' /* webpackChunkName: "pages/dashboard/don-hang/index" */))
const _b8d923aa = () => interopDefault(import('../client/pages/dashboard/ho-tro/index.vue' /* webpackChunkName: "pages/dashboard/ho-tro/index" */))
const _65f27496 = () => interopDefault(import('../client/pages/dashboard/phan-quyen/index.vue' /* webpackChunkName: "pages/dashboard/phan-quyen/index" */))
const _374e853f = () => interopDefault(import('../client/pages/dashboard/profile/index.vue' /* webpackChunkName: "pages/dashboard/profile/index" */))
const _0ce17553 = () => interopDefault(import('../client/pages/dashboard/thong-ke/index.vue' /* webpackChunkName: "pages/dashboard/thong-ke/index" */))
const _081336ed = () => interopDefault(import('../client/pages/dashboard/ban-chay/link-san-pham.vue' /* webpackChunkName: "pages/dashboard/ban-chay/link-san-pham" */))
const _0712596d = () => interopDefault(import('../client/pages/dashboard/san-pham/tao-san-pham.vue' /* webpackChunkName: "pages/dashboard/san-pham/tao-san-pham" */))
const _d4014ba0 = () => interopDefault(import('../client/pages/dashboard/san-pham/tao-san-pham/index.vue' /* webpackChunkName: "pages/dashboard/san-pham/tao-san-pham/index" */))
const _799c97eb = () => interopDefault(import('../client/pages/dashboard/san-pham/tao-san-pham/lazada.vue' /* webpackChunkName: "pages/dashboard/san-pham/tao-san-pham/lazada" */))
const _6ee87e76 = () => interopDefault(import('../client/pages/dashboard/san-pham/tao-san-pham/sendo.vue' /* webpackChunkName: "pages/dashboard/san-pham/tao-san-pham/sendo" */))
const _4b890ab0 = () => interopDefault(import('../client/pages/dashboard/san-pham/tao-san-pham/shopee.vue' /* webpackChunkName: "pages/dashboard/san-pham/tao-san-pham/shopee" */))
const _9f1c5696 = () => interopDefault(import('../client/pages/dashboard/san-pham/tat-ca.vue' /* webpackChunkName: "pages/dashboard/san-pham/tat-ca" */))
const _1c4cfabf = () => interopDefault(import('../client/pages/dashboard/san-thuong-mai/lazada.vue' /* webpackChunkName: "pages/dashboard/san-thuong-mai/lazada" */))
const _0799b371 = () => interopDefault(import('../client/pages/dashboard/san-thuong-mai/sendo.vue' /* webpackChunkName: "pages/dashboard/san-thuong-mai/sendo" */))
const _7cebdd7c = () => interopDefault(import('../client/pages/dashboard/san-thuong-mai/shopee.vue' /* webpackChunkName: "pages/dashboard/san-thuong-mai/shopee" */))
const _9ab97a0e = () => interopDefault(import('../client/pages/dashboard/san-thuong-mai/tiki.vue' /* webpackChunkName: "pages/dashboard/san-thuong-mai/tiki" */))
const _0e13311c = () => interopDefault(import('../client/pages/dashboard/ton-kho/dong-bo.vue' /* webpackChunkName: "pages/dashboard/ton-kho/dong-bo" */))
const _68fd7524 = () => interopDefault(import('../client/pages/dashboard/ton-kho/thiet-lap.vue' /* webpackChunkName: "pages/dashboard/ton-kho/thiet-lap" */))

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/dashboard",
    component: _050efc22,
    children: [{
      path: "",
      component: _3f426125,
      name: "dashboard"
    }, {
      path: "don-hang",
      component: _490c0308,
      name: "dashboard-don-hang"
    }, {
      path: "ho-tro",
      component: _b8d923aa,
      name: "dashboard-ho-tro"
    }, {
      path: "phan-quyen",
      component: _65f27496,
      name: "dashboard-phan-quyen"
    }, {
      path: "profile",
      component: _374e853f,
      name: "dashboard-profile"
    }, {
      path: "thong-ke",
      component: _0ce17553,
      name: "dashboard-thong-ke"
    }, {
      path: "ban-chay/link-san-pham",
      component: _081336ed,
      name: "dashboard-ban-chay-link-san-pham"
    }, {
      path: "san-pham/tao-san-pham",
      component: _0712596d,
      children: [{
        path: "",
        component: _d4014ba0,
        name: "dashboard-san-pham-tao-san-pham"
      }, {
        path: "lazada",
        component: _799c97eb,
        name: "dashboard-san-pham-tao-san-pham-lazada"
      }, {
        path: "sendo",
        component: _6ee87e76,
        name: "dashboard-san-pham-tao-san-pham-sendo"
      }, {
        path: "shopee",
        component: _4b890ab0,
        name: "dashboard-san-pham-tao-san-pham-shopee"
      }]
    }, {
      path: "san-pham/tat-ca",
      component: _9f1c5696,
      name: "dashboard-san-pham-tat-ca"
    }, {
      path: "san-thuong-mai/lazada",
      component: _1c4cfabf,
      name: "dashboard-san-thuong-mai-lazada"
    }, {
      path: "san-thuong-mai/sendo",
      component: _0799b371,
      name: "dashboard-san-thuong-mai-sendo"
    }, {
      path: "san-thuong-mai/shopee",
      component: _7cebdd7c,
      name: "dashboard-san-thuong-mai-shopee"
    }, {
      path: "san-thuong-mai/tiki",
      component: _9ab97a0e,
      name: "dashboard-san-thuong-mai-tiki"
    }, {
      path: "ton-kho/dong-bo",
      component: _0e13311c,
      name: "dashboard-ton-kho-dong-bo"
    }, {
      path: "ton-kho/thiet-lap",
      component: _68fd7524,
      name: "dashboard-ton-kho-thiet-lap"
    }]
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
