const Databases = () => import('@/views/modules/database/Databases.vue')
const DatabaseView = () => import('@/views/modules/database/DatabaseView.vue')
const AddRecords = () => import('@/views/modules/database/AddRecords.vue')
const ImportDatabase = () =>
  import('@/views/modules/database/ImportDatabase.vue')
const DataModels = () => import('@/views/modules/database/DatabaseModeling.vue')
const View404 = () => import('@/views/View404.vue')

// TODO: add permissions to the views
const meta = { layout: 'SuiteLayout', title: 'database', insideModule: true }
const routes = [
  {
    path: 'list-database',
    name: 'Databases',
    component: Databases,
    meta,
  },
  {
    path: 'database-view/:id',
    name: 'DatabaseView',
    component: DatabaseView,
    meta,
  },
  {
    path: 'import-database',
    name: 'ImportDatabase',
    component: ImportDatabase,
    meta,
  },
  {
    path: 'add-records/:id',
    name: 'AddRecords',
    component: AddRecords,
    meta,
  },
  {
    path: 'modeling',
    name: 'DataModels',
    component: DataModels,
    meta,
  },
  {
    path: ':unknown',
    name: 'Database404',
    component: View404,
    meta,
  },
]

export default routes
