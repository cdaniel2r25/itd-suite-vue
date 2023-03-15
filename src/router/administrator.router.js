const WhatsappActiveQueue = () =>
  import('@/views/modules/administrator/WhatsappActiveQueue.vue')
const WhatsappConnectors = () =>
  import('@/views/modules/administrator/WhatsappConnectors.vue')
const CreateConnector = () =>
  import('@/views/modules/administrator/CreateConnector.vue')
const SystemStatus = () =>
  import('@/views/modules/administrator/SystemStatus.vue')
const WhatsappPending = () =>
  import('@/views/modules/administrator/WhatsappPending.vue')
const SenderForm = () => import('@/views/modules/administrator/SenderForm.vue')
const View404 = () => import('@/views/View404.vue')

// TODO: add permissions to the views
const meta = {
  layout: 'SuiteLayout',
  title: 'administrator',
  insideModule: true,
}
const routes = [
  {
    path: '',
    name: 'Administrator',
    component: SystemStatus,
    meta: {
      moduleTab: 'status',
      ...meta,
    },
  },
  {
    path: 'whatsapp-activequeue',
    name: 'WhatsappActiveQueue',
    component: WhatsappActiveQueue,
    meta: {
      moduleTab: 'queue',
      ...meta,
    },
  },
  {
    path: 'whatsapp-connectors',
    name: 'WhatsappConnectors',
    component: WhatsappConnectors,
    meta: {
      moduleTab: 'connectors',
      ...meta,
    },
  },
  {
    path: 'create-connector/:id',
    name: 'CreateConnector',
    component: CreateConnector,
    meta: {
      moduleTab: 'connectors',
      ...meta,
    },
  },
  {
    path: 'system-status',
    name: 'SystemStatus',
    component: SystemStatus,
    meta: {
      moduleTab: 'status',
      ...meta,
    },
  },
  {
    path: 'whatsapp-pending',
    name: 'WhatsappPending',
    component: WhatsappPending,
    meta: {
      moduleTab: 'status',
      ...meta,
    },
  },
  {
    path: 'sender-form/:id',
    name: 'SenderForm',
    component: SenderForm,
    meta: {
      moduleTab: 'connectors',
      ...meta,
    },
  },
  {
    path: ':unknown',
    name: 'administrator404',
    component: View404,
    meta,
  },
]

export default routes
