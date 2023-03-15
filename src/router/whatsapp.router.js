const WhatsappCreateCampaign = () =>
  import('@/views/modules/whatsapp/CreateWhatsappCampaign.vue')
const WhatsappCampaigns = () =>
  import('@/views/modules/whatsapp/WhatsappCampaigns.vue')
const Chats = () => import('@/views/modules/whatsapp/Chats.vue')
const AgentsProperties = () =>
  import('@/views/modules/whatsapp/AgentsProperties.vue')
const Labels = () => import('@/views/modules/whatsapp/Labels.vue')
const SendersSettings = () =>
  import('@/views/modules/whatsapp/SendersSettings.vue')
const TemplatesSettings = () =>
  import('@/views/modules/whatsapp/TemplatesSettings.vue')
const RestrictionsSettings = () =>
  import('@/views/modules/whatsapp/RestrictionsSettings.vue')
const CreateTemplates = () =>
  import('@/views/modules/whatsapp/CreateTemplates.vue')
const WhatsappOutgoingMessagesReports = () =>
  import('@/views/modules/whatsapp/WhatsappOutgoingMessagesReports.vue')
const WhatsappReceivedMessagesReports = () =>
  import('@/views/modules/whatsapp/WhatsappReceivedMessagesReports.vue')
const WhatsappSessionsReports = () =>
  import('@/views/modules/whatsapp/WhatsappSessionsReports.vue')
const WhatsappCampaignsReports = () =>
  import('@/views/modules/whatsapp/WhatsappCampaignsReports.vue')
const WhatsappSelectedCampaignMessagesReports = () =>
  import('@/views/modules/whatsapp/WhatsappSelectedCampaignMessagesReports.vue')
const WhatsappLayout = () => import('@/layouts/modules/WhatsappLayout.vue')

const WebhooksSettings = () =>
  import('@/views/modules/whatsapp/WebhooksSettings.vue')
const Autoresponses = () => import('@/views/modules/whatsapp/Autoresponses.vue')
const Contacts = () => import('@/views/modules/whatsapp/Contacts/Contacts.vue')
const ImportContacts = () =>
  import('@/views/modules/whatsapp/Contacts/ImportContacts.vue')
const ContactsLists = () =>
  import('@/views/modules/whatsapp/Contacts/ContactsLists.vue')

const View404 = () => import('@/views/View404.vue')

const meta = { layout: 'SuiteLayout', title: 'whatsapp', insideModule: true }
const routes = [
  {
    path: '',
    name: 'Whatsapp',
    component: WhatsappCampaigns,
    meta: {
      permission: 'VIEW_WHATSAPP_CAMPAIGN',
      moduleTab: 'campaigns',
      ...meta,
    },
  },
  {
    path: 'campaigns',
    name: 'WhatsappCampaigns',
    component: WhatsappCampaigns,
    meta: {
      permission: 'VIEW_WHATSAPP_CAMPAIGN',
      moduleTab: 'campaigns',
      ...meta,
    },
  },
  {
    path: 'create-campaign/:id',
    name: 'WhatsappCreateCampaign',
    component: WhatsappCreateCampaign,
    meta: {
      permission: 'CREATE_WHATSAPP_CAMPAIGN',
      moduleTab: 'campaigns',
      ...meta,
    },
  },
  {
    path: 'chats',
    name: 'Chats',
    component: Chats,
    meta: {
      permission: 'VIEW_WHATSAPP_CHATS',
      moduleTab: 'chats',
      ...meta,
    },
  },
  {
    path: 'autoresponses',
    name: 'Autoresponses',
    component: Autoresponses,
    meta: {
      permission: 'VIEW_WHATSAPP_CHATS',
      moduleTab: 'autoresponses',
      ...meta,
    },
  },
  {
    path: 'labels',
    name: 'Labels',
    component: Labels,
    meta: {
      permission: 'VIEW_WHATSAPP_AGENTS_LABELS',
      moduleTab: 'labels',
      ...meta,
    },
  },
  {
    path: 'senders',
    name: 'SendersSettings',
    component: SendersSettings,
    meta: {
      permission: 'VIEW_WHATSAPP_SETTINGS',
      moduleTab: 'settings',
      ...meta,
    },
  },
  {
    path: 'templates',
    component: WhatsappLayout,
    meta: {
      permission: 'VIEW_WHATSAPP_SETTINGS',
      moduleTab: 'settings',
      ...meta,
    },
    children: [
      {
        path: '/',
        name: 'TemplatesSettings',
        component: TemplatesSettings,
        meta: {
          permission: 'VIEW_WHATSAPP_SETTINGS',
          moduleTab: 'settings',
          ...meta,
        },
      },
      {
        path: 'create',
        name: 'CreateTemplates',
        component: CreateTemplates,
        meta: {
          permission: 'VIEW_WHATSAPP_SETTINGS',
          moduleTab: 'settings',
          ...meta,
        },
      },
      {
        path: 'edit/:id',
        name: 'EditTemplate',
        component: CreateTemplates,
        meta: {
          permission: 'VIEW_WHATSAPP_SETTINGS',
          moduleTab: 'settings',
          ...meta,
        },
      },
    ],
  },
  {
    path: 'reports',
    component: WhatsappLayout,
    meta: {
      permission: 'VIEW_WHATSAPP_SETTINGS',
      moduleTab: 'reports',
      ...meta,
    },
    children: [
      {
        path: 'outgoing',
        name: 'WhatsappOutgoingMessagesReports',
        component: WhatsappOutgoingMessagesReports,
        meta: {
          permission: 'VIEW_WHATSAPP_REPORTS',
          moduleTab: 'reports',
          ...meta,
        },
      },
      {
        path: 'received',
        name: 'WhatsappReceivedMessagesReports',
        component: WhatsappReceivedMessagesReports,
        meta: {
          permission: 'VIEW_WHATSAPP_REPORTS',
          moduleTab: 'reports',
          ...meta,
        },
      },
      {
        path: 'sessions',
        name: 'WhatsappSessionsReports',
        component: WhatsappSessionsReports,
        meta: {
          permission: 'VIEW_WHATSAPP_REPORTS',
          moduleTab: 'reports',
          ...meta,
        },
      },
      {
        path: 'campaigns',
        name: 'WhatsappCampaignsReports',
        component: WhatsappCampaignsReports,
        meta: {
          permission: 'VIEW_WHATSAPP_REPORTS',
          moduleTab: 'reports',
          ...meta,
        },
      },
      {
        path: 'reports-selected-campaign-messages/:campaign',
        name: 'WhatsappSelectedCampaignMessagesReports',
        component: WhatsappSelectedCampaignMessagesReports,
        meta: {
          permission: 'VIEW_WHATSAPP_REPORTS',
          moduleTab: 'reports',
          ...meta,
        },
      },
    ],
  },
  {
    path: 'restriction',
    name: 'RestrictionsSettings',
    component: RestrictionsSettings,
    meta: {
      permission: 'VIEW_WHATSAPP_SETTINGS',
      moduleTab: 'settings',
      ...meta,
    },
  },
  {
    path: 'webhooks',
    name: 'WebhooksSettings',
    component: WebhooksSettings,
    meta: {
      permission: 'VIEW_WHATSAPP_SETTINGS',
      moduleTab: 'settings',
      ...meta,
    },
  },
  {
    path: 'agents-properties',
    name: 'AgentsProperties',
    component: AgentsProperties,
    meta: {
      permission: 'VIEW_WHATSAPP_AGENTS_PROPERTIES',
      moduleTab: 'settings',
      ...meta,
    },
  },
  {
    path: 'contacts',
    component: WhatsappLayout,
    meta: {
      permission: 'VIEW_WHATSAPP_SETTINGS',
      moduleTab: 'contacts',
      ...meta,
    },
    children: [
      {
        path: '/',
        name: 'Contacts',
        component: Contacts,
        meta: {
          permission: 'VIEW_WHATSAPP_SETTINGS',
          moduleTab: 'contacts',
          ...meta,
        },
      },
      {
        path: 'import',
        name: 'ImportContacts',
        component: ImportContacts,
        meta: {
          permission: 'VIEW_WHATSAPP_SETTINGS',
          moduleTab: 'contacts',
          ...meta,
        },
      },
      {
        path: 'lists',
        name: 'ContactsLists',
        component: ContactsLists,
        meta: {
          permission: 'VIEW_WHATSAPP_SETTINGS',
          moduleTab: 'contacts',
          ...meta,
        },
      },
    ],
  },
  {
    path: ':unknown',
    name: 'Whatsapp404',
    component: View404,
    meta,
  },
]

export default routes
