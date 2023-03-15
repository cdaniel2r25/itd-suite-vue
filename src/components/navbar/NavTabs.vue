<template>
  <v-tabs
    v-model="tab"
    align-with-title
    background-color="lightcyan"
    class="mt-1"
    height="46"
  >
    <v-tab
      v-for="(item, index) in modulesTabsToShow"
      :key="index"
      :href="`#${item.id}`"
      link
      :class="item.children ? 'px-0' : ''"
      @change="$router.push(item.link)"
    >
      <v-menu
        v-if="item.children"
        offset-y
        open-on-hover
        bottom
        right
        close-delay="100"
      >
        <template v-slot:activator="{ on, attrs }">
          <div class="tab-submenu" v-bind="attrs" v-on="on">
            {{ item.name }} <v-icon class="pl-2">mdi-menu-down</v-icon>
          </div>
        </template>

        <v-card class="py-1">
          <v-list class="white">
            <v-list-item
              v-for="child in item.children"
              :key="child.id"
              class="px-4"
              @click="routerHandler(child.link.name)"
            >
              <v-list-item-title>{{ child.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
      <div v-else>{{ item.name }}</div>
    </v-tab>
  </v-tabs>
</template>
<script>
const MODULES_TABS = {
  whatsapp: [
    {
      id: 'campaigns',
      name: 'Campañas',
      link: { name: 'WhatsappCampaigns' },
    },
    {
      id: 'chats',
      name: 'Chats',
      link: { name: 'Chats' },
    },
    {
      id: 'contacts',
      name: 'Contactos',
      link: { name: 'Contacts' },
      children: [
        {
          id: 'allContacts',
          name: 'Todos mis contactos',
          link: { name: 'Contacts' },
        },
        {
          id: 'contactsList',
          name: 'Listas de contactos',
          link: { name: 'ContactsLists' },
        },
      ],
    },
    {
      id: 'autoresponses',
      name: 'Autorrespuestas',
      link: { name: 'Autoresponses' },
    },
    {
      id: 'labels',
      name: 'Etiquetas',
      link: { name: 'Labels' },
    },
    {
      id: 'reports',
      name: 'Reportes',
      link: { name: 'WhatsappOutgoingMessagesReports' },
      children: [
        {
          id: 'outgoing',
          name: 'Salientes',
          link: { name: 'WhatsappOutgoingMessagesReports' },
        },
        {
          id: 'received',
          name: 'Recibidos',
          link: { name: 'WhatsappReceivedMessagesReports' },
        },
        {
          id: 'sessions',
          name: 'Sesiones',
          link: { name: 'WhatsappSessionsReports' },
        },
        {
          id: 'campaigns',
          name: 'Campañas',
          link: { name: 'WhatsappCampaignsReports' },
        },
      ],
    },
    {
      id: 'settings',
      name: 'Configuración',
      link: { name: 'SendersSettings' },
      children: [
        {
          id: 'senders',
          name: 'Remitentes',
          link: { name: 'SendersSettings' },
        },
        {
          id: 'templates',
          name: 'Plantillas',
          link: { name: 'TemplatesSettings' },
        },
        {
          id: 'webhooks',
          name: 'Webhooks',
          link: { name: 'WebhooksSettings' },
        },
        {
          id: 'restriction',
          name: 'Restricciones',
          link: { name: 'RestrictionsSettings' },
        },
        {
          id: 'agents-properties',
          name: 'Propiedades agentes',
          link: { name: 'AgentsProperties' },
        },
      ],
    },
  ],
  database: [
    {
      id: 'databases',
      name: 'Base de datos',
      link: { name: 'Databases' },
      children: [
        {
          id: 'databases',
          name: 'Base de datos',
          link: { name: 'Databases' },
        },
        {
          id: 'modeling',
          name: 'Modelo base de datos',
          link: { name: 'DataModels' },
        },
      ],
    },
  ],
  automation: [
    {
      id: 'automation',
      name: 'Automatización',
      link: { name: 'Automation' },
    },
  ],
  administrator: [
    {
      id: 'status',
      name: 'Estado del sistema',
      link: { name: 'SystemStatus' },
      children: [
        {
          id: 'status',
          name: 'Estado del sistema',
          link: { name: 'SystemStatus' },
        },
        {
          id: 'whatsapp-pending',
          name: 'Whatsapp pendientes',
          link: { name: 'WhatsappPending' },
        },
      ],
    },
    {
      id: 'queue',
      name: 'Cola activa',
      link: { name: 'WhatsappActiveQueue' },
      children: [
        {
          id: 'queue',
          name: 'Whatsapp',
          link: { name: 'WhatsappActiveQueue' },
        },
      ],
    },
    {
      id: 'connectors',
      name: 'Conectores',
      link: { name: 'WhatsappConnectors' },
      children: [
        {
          id: 'connectors',
          name: 'Whatsapp',
          link: { name: 'WhatsappConnectors' },
        },
      ],
    },
  ],
  settings: [
    {
      id: 'accounts',
      name: 'Cuentas',
      link: { name: 'Users' },
      children: [
        {
          id: 'users',
          name: 'Usuarios',
          link: { name: 'Users' },
        },
        {
          id: 'clients',
          name: 'Clientes',
          link: { name: 'Clients' },
        },
        {
          id: 'resellers',
          name: 'Resellers',
          link: { name: 'Resellers' },
        },
        {
          id: 'roles',
          name: 'Roles y permisos',
          link: { name: 'Roles' },
        },
      ],
    },
    {
      id: 'connectors',
      name: 'Conectores',
      link: { name: 'Connectors' },
    },
  ],
  surveys: [
    {
      id: 'surveys',
      name: 'Encuestas',
      link: { name: 'Surveys' },
    },
  ],
}

export default {
  computed: {
    modulesTabsToShow() {
      return MODULES_TABS[this.$route.meta.title]
    },
    tab: {
      set() {},
      get() {
        return this.$route.meta.moduleTab
      },
    },
  },
  methods: {
    routerHandler(routeName) {
      if (this.$route.name !== routeName) this.$router.push({ name: routeName })
    },
  },
}
</script>
<style scoped>
.tab-submenu {
  padding: 14.625px 16px;
}
</style>
