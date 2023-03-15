const Surveys = () => import('@/views/modules/surveys/Surveys.vue')
const NewSurveys = () => import('@/views/modules/surveys/NewSurveys.vue')
const View404 = () => import('@/views/View404.vue')

// TODO: add permissions to the views
const meta = { layout: 'SuiteLayout', title: 'surveys', insideModule: true }
const routes = [
  {
    path: '',
    name: 'Surveys',
    component: Surveys,
    meta,
  },
  {
    path: 'new-surveys',
    name: 'NewSurveys',
    component: NewSurveys,
    meta,
  },
  {
    path: ':unknown',
    name: 'Surveys404',
    component: View404,
    meta,
  },
]

export default routes
