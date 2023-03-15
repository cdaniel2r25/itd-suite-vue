const MailingCreateCampaign = () =>
  import('@/views/modules/mailing/CreateMailingCampaign.vue')
const MailingCampaigns = () =>
  import('@/views/modules/mailing/MailingCampaigns.vue')
const View404 = () => import('@/views/View404.vue')

const meta = { layout: 'SuiteLayout', title: 'mailing', insideModule: true }
const routes = [
  {
    path: '',
    name: 'Mailing',
    component: MailingCampaigns,
    meta: { permission: 'VIEW_MAILING', ...meta },
  },
  {
    path: 'campaigns',
    name: 'MailingCampaigns',
    component: MailingCampaigns,
    meta: { permission: 'VIEW_MAILING_CAMPAIGN', ...meta },
  },
  {
    path: 'create-campaign',
    name: 'MailingCreateCampaign',
    component: MailingCreateCampaign,
    meta: { permission: 'CREATE_MAILING_CAMPAIGN', ...meta },
  },
  {
    path: ':unknown',
    name: 'Mailing404',
    component: View404,
    meta,
  },
]

export default routes
