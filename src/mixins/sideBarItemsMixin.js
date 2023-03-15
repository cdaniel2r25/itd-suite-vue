import permissionsMixin from '@/mixins/permissionsMixin'

const SIDEBAR_ITEMS = {
  settings: [
    {
      icon: 'mdi-cog',
      text: 'Configuraciones',
      link: { name: 'Settings' },
      permission: 'VIEW_SETTINGS',
    },
    {
      icon: 'mdi-account-group',
      text: 'Usuarios',
      link: { name: 'Users' },
      permission: 'VIEW_USERS',
    },
    {
      icon: 'mdi-account-multiple',
      text: 'Clientes',
      link: { name: 'Clients' },
      permission: 'VIEW_CLIENTS',
    },
    {
      icon: 'mdi-account-supervisor',
      text: 'Resellers',
      link: { name: 'Resellers' },
      permission: 'VIEW_RESELLERS',
    },
    {
      icon: 'mdi-account-lock',
      text: 'Roles y Permisos',
      link: { name: 'Roles' },
      permission: 'VIEW_ROLES',
    },
    {
      icon: 'mdi-power-plug',
      text: 'Connectores',
      link: { name: 'Connectors' },
      permission: 'VIEW_ROLES',
    },
  ],
  mailing: [
    {
      icon: 'mdi-email',
      text: 'Listado de Campañas',
      link: { name: 'MailingCampaigns' },
      permission: 'VIEW_MAILING_CAMPAIGN',
    },
  ],
  whatsapp: [
    {
      icon: 'mdi-whatsapp',
      text: 'Listado de Campañas',
      link: { name: 'WhatsappCampaigns' },
      permission: 'VIEW_WHATSAPP_CAMPAIGN',
      moduleTab: 'campaigns',
    },
    {
      icon: 'mdi-account-settings',
      text: 'Remitentes',
      link: { name: 'SendersSettings' },
      permission: 'VIEW_WHATSAPP_SETTINGS',
      moduleTab: 'settings',
    },
    {
      icon: 'mdi-message-text-outline',
      text: 'Plantillas',
      link: { name: 'TemplatesSettings' },
      permission: 'VIEW_WHATSAPP_SETTINGS',
      moduleTab: 'settings',
    },
    {
      icon: 'mdi-webhook',
      text: 'Webhooks',
      link: { name: 'WebhooksSettings' },
      permission: 'VIEW_WHATSAPP_SETTINGS',
      moduleTab: 'settings',
    },
    {
      icon: 'mdi-calendar-remove-outline',
      text: 'Restricciones',
      link: { name: 'RestrictionsSettings' },
      permission: 'VIEW_WHATSAPP_SETTINGS',
      moduleTab: 'settings',
    },
    {
      icon: 'mdi-account-wrench',
      text: 'Propiedades agentes',
      link: { name: 'AgentsProperties' },
      permission: 'VIEW_WHATSAPP_AGENTS_PROPERTIES',
      moduleTab: 'settings',
    },
    {
      icon: 'mdi-chart-arc',
      text: 'Salientes',
      link: { name: 'WhatsappOutgoingMessagesReports' },
      permission: 'VIEW_WHATSAPP_REPORTS',
      moduleTab: 'reports',
    },
    {
      icon: 'mdi-file-chart',
      text: 'Entrantes',
      link: { name: 'WhatsappReceivedMessagesReports' },
      permission: 'VIEW_WHATSAPP_REPORTS',
      moduleTab: 'reports',
    },
    {
      icon: 'mdi-account-settings',
      text: 'Sesiones',
      link: { name: 'WhatsappSessionsReports' },
      permission: 'VIEW_WHATSAPP_REPORTS',
      moduleTab: 'reports',
    },
    {
      icon: 'mdi-folder-open',
      text: 'Campañas',
      link: { name: 'WhatsappCampaignsReports' },
      permission: 'VIEW_WHATSAPP_REPORTS',
      moduleTab: 'reports',
    },
  ],
  reports: [
    {
      icon: 'mdi-chart-arc',
      text: 'Listado',
      link: { name: 'WhatsappOutgoingMessagesReports' },
    },
    {
      icon: 'mdi-chart-arc',
      text: 'Listado',
      link: { name: 'WhatsappReceivedMessagesReports' },
    },
  ],
  database: [
    {
      icon: 'mdi-database',
      text: 'Listado',
      link: { name: 'Databases' },
    },
    {
      icon: 'mdi-database-cog-outline',
      text: 'Modelo base de datos',
      link: { name: 'DataModels' },
    },
  ],
  automation: [
    {
      icon: 'mdi-file-tree-outline',
      text: 'Procesos',
      link: { name: 'ProcessesAutomation' },
    },
  ],
  administrator: [
    {
      icon: 'mdi-whatsapp',
      text: 'Whatsapp',
      link: { name: 'WhatsappActiveQueue' },
      moduleTab: 'queue',
    },
    {
      icon: 'mdi-whatsapp',
      text: 'Whatsapp',
      link: { name: 'WhatsappConnectors' },
      moduleTab: 'connectors',
    },
    {
      icon: 'mdi-database-eye',
      text: 'Estado del sistema',
      link: { name: 'SystemStatus' },
      moduleTab: 'status',
    },
    {
      icon: 'mdi-whatsapp',
      text: 'Whatsapp Pendientes',
      link: { name: 'WhatsappPending' },
      moduleTab: 'status',
    },
  ],
}
export default {
  mixins: [permissionsMixin],
  computed: {
    sideBarItems() {
      return SIDEBAR_ITEMS[this.$route.meta.title]
    },
    allowedSideBarItems() {
      return SIDEBAR_ITEMS[this.$route.meta.title].filter(
        (item) =>
          this.can(item.permission, this.$route.meta.title) &&
          (!item.moduleTab || item.moduleTab === this.$route.meta.moduleTab)
      )
    },
  },
}
