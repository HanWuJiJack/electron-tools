import {
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router'
import Home from '../layout/Home.vue'
import Welcome from '../views/Welcome/GetProxy.vue'
import NotFound from '../views/404.vue'
import NProgress from 'nprogress' // 引入nprogress插件

const routes = [{
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    icon: "House",
    meta: {
      name: '工具管理',
      key: "100",
      menu: true,
      hide: false,
    },
    children: [{
        path: '/welcome',
        name: 'Welcome',
        component: Welcome,
        meta: {
          name: '获取代理',
          key: "101",
          menu: false,
          hide: false,
        }
      },
      {
        path: '/to-send',
        name: 'ToSend',
        component: () => import('../views/Welcome/ToSend.vue'),
        meta: {
          name: '代理请求',
          key: "102",
          menu: false,
          hide: false,
        }
      },
      {
        path: '/md5',
        name: 'MD5',
        component: () => import('../views/Welcome/MD5.vue'),
        meta: {
          name: '验证文件完整性',
          key: "103",
          menu: false,
          hide: false,
        }
      },
      {
        path: '/font',
        name: 'font',
        component: () => import('../views/Welcome/Font.vue'),
        meta: {
          name: '效果',
          key: "104",
          menu: false,
          hide: false,
        }
      },
    ]
  },
  {
    path: '/404',
    name: '404',
    component: NotFound,
    meta: {
      name: '404',
      key: 107,
      menu: false,
      hide: true,
    }
  }
];

const router = createRouter({
  history: createWebHashHistory("/"),
  scrollBehavior: () => ({
    y: 0
  }),
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.matched.length > 0) {
    next()
  } else {
    next('/404')
  }
})

router.afterEach(() => {
  NProgress.done()
})
export default router;
