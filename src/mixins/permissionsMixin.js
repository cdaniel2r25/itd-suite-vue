import store from '@/store'

export default {
  methods: {
    can(permission, module) {
      // TODO: check if user has super admin permission
      console.log(permission, module, store)
      // if (store.getters.userPermissions)
      //   return store.getters.userPermissions[module].includes(permission)
      return true
    },
  },
}
