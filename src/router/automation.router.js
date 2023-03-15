const Automation = () => import('@/views/modules/automation/Automation.vue')
const ProcessesAutomation = () =>
  import('@/views/modules/automation/Automation.vue')
const CreateAutomation = () =>
  import('@/views/modules/automation/AutomationCreation.vue')
const View404 = () => import('@/views/View404.vue')

// TODO: add permissions to the views
const meta = { layout: 'SuiteLayout', title: 'automation', insideModule: true }
const routes = [
  {
    path: '',
    name: 'Automation',
    component: Automation,
    meta,
  },
  {
    path: 'processes',
    name: 'ProcessesAutomation',
    component: ProcessesAutomation,
    meta: {
      moduleTab: 'automation',
      ...meta,
    },
  },
  {
    path: 'create-automation/:id',
    name: 'CreateAutomation',
    component: CreateAutomation,
    meta,
  },
  {
    path: ':unknown',
    name: 'Automation404',
    component: View404,
    meta,
  },
]

export default routes
