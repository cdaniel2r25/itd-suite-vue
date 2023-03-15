import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import View404 from '@/views/View404.vue'
import { authGuard } from '@/auth'

import SettingsRoutes from '@/router/settings.router'
import MailingRoutes from '@/router/mailing.router'
import WhatsappRoutes from '@/router/whatsapp.router'
import DatabaseRoutes from '@/router/database.router'
import permissionsMixin from '@/mixins/permissionsMixin'
import AutomationRoutes from '@/router/automation.router'
import AdministratorRoutes from '@/router/administrator.router'
import NotificationsRouter from '@/router/notifications.router'
import SurveysRoutes from '@/router/surveys.router'

const SettingsLayout = () => import('@/layouts/modules/SettingsLayout.vue')
const MailingLayout = () => import('@/layouts/modules/MailingLayout.vue')
const WhatsappLayout = () => import('@/layouts/modules/WhatsappLayout.vue')
const DatabaseLayout = () => import('@/layouts/modules/DatabaseLayout.vue')
const AutomationLayout = () => import('@/layouts/modules/AutomationLayout.vue')
const SurveysLayout = () => import('@/layouts/modules/SurveysLayout.vue')
const NotificationsLayout = () =>
  import('@/layouts/modules/NotificationsLayout.vue')
const AdministratorLayout = () =>
  import('@/layouts/modules/AdministratorLayout.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: authGuard,
    meta: { layout: 'SuiteLayout', title: 'Home' },
  },
  {
    path: '/settings',
    component: SettingsLayout,
    children: SettingsRoutes,
    beforeEnter: authGuard,
  },
  {
    path: '/mailing',
    component: MailingLayout,
    children: MailingRoutes,
    beforeEnter: authGuard,
  },
  {
    path: '/whatsapp',
    component: WhatsappLayout,
    children: WhatsappRoutes,
    beforeEnter: authGuard,
  },
  {
    path: '/database',
    component: DatabaseLayout,
    children: DatabaseRoutes,
    beforeEnter: authGuard,
  },
  {
    path: '/automation',
    component: AutomationLayout,
    children: AutomationRoutes,
    beforeEnter: authGuard,
  },
  {
    path: '/administrator',
    component: AdministratorLayout,
    children: AdministratorRoutes,
    beforeEnter: authGuard,
  },
  {
    path: '/notifications',
    component: NotificationsLayout,
    children: NotificationsRouter,
    beforeEnter: authGuard,
  },
  {
    path: '/surveys',
    component: SurveysLayout,
    children: SurveysRoutes,
    beforeEnter: authGuard,
  },
  {
    path: '/:invalidRoute',
    name: 'View404',
    component: View404,
    meta: { layout: 'BlankLayout', title: 'ITD 404' },
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeResolve(async (to, from, next) => {
  // if (
  //   localStorage.getItem('accessToken') &&
  //   localStorage.getItem('bearerToken')
  // ) {
  //   const { getters } = router.app.$store
  //   if (!getters.userPermissions) {
  //     if (!getters.userDefaultClient) {
  //       await router.app.$store.dispatch('getClientInfo')
  //     }
  //     await router.app.$store.dispatch('getUserPermissions')
  //   }
  // }
  if (
    !to.meta.permission ||
    permissionsMixin.methods.can(to.meta.permission, to.meta.title)
  ) {
    next()
  } else {
    next('/')
  }
})

export default router
