const AllNotifications = () =>
  import('@/views/modules/notifications/AllNotifications.vue')
const View404 = () => import('@/views/View404.vue')

// TODO: add permissions to the views
const meta = {
  layout: 'SuiteLayout',
  title: 'notifications',
  insideModule: true,
}
const routes = [
  {
    path: 'all-notifications',
    name: 'AllNotifications',
    component: AllNotifications,
  },
  {
    path: ':unknown',
    name: 'notifications404',
    component: View404,
    meta,
  },
]

export default routes
