const CreateReseller = () =>
  import('@/views/modules/settings/CreateReseller.vue')
const CreateUser = () => import('@/views/modules/settings/CreateUser.vue')
const EditUser = () => import('@/views/modules/settings/EditUser.vue')
const View404 = () => import('@/views/View404.vue')
const CreateClient = () => import('@/views/modules/settings/CreateClient.vue')
const Users = () => import('@/views/modules/settings/Users.vue')
const Resellers = () => import('@/views/modules/settings/Resellers.vue')
const Clients = () => import('@/views/modules/settings/Clients.vue')
const RolesAndPermissions = () =>
  import('@/views/modules/settings/RolesAndPermissions.vue')
const CreateRole = () => import('@/views/modules/settings/CreateRole.vue')

const Connectors = () => import('@/views/modules/settings/Connectors.vue')
const ConnectorsCrud = () =>
  import('@/views/modules/settings/ConnectorsCrud.vue')
const SettingsLayout = () => import('@/layouts/modules/SettingsLayout.vue')

const meta = { layout: 'SuiteLayout', title: 'settings', insideModule: true }
const routes = [
  {
    path: '',
    name: 'Settings',
    component: Users,
    meta: { permission: 'VIEW_SETTINGS', moduleTab: 'users', ...meta },
  },
  {
    path: 'users',
    component: SettingsLayout,
    meta: { permission: 'VIEW_USERS', moduleTab: 'users', ...meta },
    children: [
      {
        path: '/',
        name: 'Users',
        component: Users,
        meta: {
          permission: 'VIEW_USERS',
          moduleTab: 'users',
          ...meta,
        },
      },
      {
        path: 'create',
        name: 'CreateUser',
        component: CreateUser,
        meta: {
          permission: 'CREATE_USERS',
          moduleTab: 'users',
          ...meta,
        },
      },
      {
        path: 'edit/:id',
        name: 'EditUser',
        component: EditUser,
        meta: {
          permission: 'CREATE_USERS',
          moduleTab: 'users',
          ...meta,
        },
      },
    ],
  },
  {
    path: 'resellers',
    name: 'Resellers',
    component: Resellers,
    meta: { permission: 'VIEW_RESELLERS', moduleTab: 'resellers', ...meta },
  },
  {
    path: 'create-reseller',
    name: 'CreateReseller',
    component: CreateReseller,
    meta: { permission: 'CREATE_RESELLERS', moduleTab: 'resellers', ...meta },
  },
  {
    path: 'clients',
    component: SettingsLayout,
    meta: {
      permission: 'VIEW_SETTINGS',
      moduleTab: 'clients',
      ...meta,
    },
    children: [
      {
        path: '/',
        name: 'Clients',
        component: Clients,
        meta: {
          permission: 'VIEW_CLIENTS',
          moduleTab: 'clients',
          ...meta,
        },
      },
      {
        path: 'create',
        name: 'CreateClient',
        component: CreateClient,
        meta: {
          permission: 'CREATE_CLIENTS',
          moduleTab: 'clients',
          ...meta,
        },
      },
      {
        path: 'edit/:id',
        name: 'EditClient',
        component: CreateClient,
        meta: {
          permission: 'CREATE_CLIENTS',
          moduleTab: 'clients',
          ...meta,
        },
      },
    ],
  },
  {
    path: 'roles',
    component: SettingsLayout,
    meta: {
      permission: 'VIEW_ROLES',
      moduleTab: 'roles',
      ...meta,
    },
    children: [
      {
        path: '/',
        name: 'Roles',
        component: RolesAndPermissions,
        meta: {
          permission: 'VIEW_ROLES',
          moduleTab: 'roles',
          ...meta,
        },
      },
      {
        path: 'create-roles',
        name: 'CreateRole',
        component: CreateRole,
        meta: { permission: 'CREATE_ROLES', moduleTab: 'roles', ...meta },
      },
    ],
  },
  {
    path: 'connectors',
    name: 'Connectors',
    component: Connectors,
    meta: { permission: 'VIEW_CONNECTORS', moduleTab: 'connectors', ...meta },
  },
  {
    path: 'connector-crud/:id',
    name: 'ConnectorsCrud',
    component: ConnectorsCrud,
    meta: { permission: 'VIEW_CONNECTORS', moduleTab: 'connectors', ...meta },
  },
  {
    path: ':unknown',
    name: 'Settings404',
    component: View404,
    meta,
  },
]

export default routes
