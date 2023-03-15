<template>
  <section v-if="!isFetching" class="fill-height">
    <nav-bar :inside-module="insideModule" />
    <!-- <v-container pa-0 fluid fill-height>
      <router-view />
    </v-container> -->
    <router-view />
    <help-button />
    <snack-bar />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import NavBar from '@/components/navbar/NavBar.vue'
import HelpButton from '@/components/HelpButton.vue'
import adminBffMixin from '@/mixins/services/adminBffMixin'
import SnackBar from '@/components/util/SnackBar.vue'

export default {
  name: 'SuiteLayout',
  components: {
    NavBar,
    HelpButton,
    SnackBar,
  },
  mixins: [adminBffMixin],
  data: () => ({
    isFetching: true,
  }),
  computed: {
    ...mapGetters(['loader']),
    insideModule() {
      return this.$route.meta.insideModule
    },
  },
  created() {
    const loader = this.$loading.show(this.loader)
    if (this.$auth.isAuthenticated) {
      this.setInitialInfo(loader)
    } else {
      this.cleanLocalStorage(loader)
    }
  },
  methods: {
    // TODO: refactor this method to call 1 api from bff with all info
    async setInitialInfo(loader) {
      const accessToken = await this.$auth.getTokenSilently()
      const claims = await this.$auth.getIdTokenClaims()

      // eslint-disable-next-line no-underscore-dangle
      const bearerToken = claims.__raw

      localStorage.setItem('bearerToken', bearerToken)
      localStorage.setItem('accessToken', accessToken)
      const userInfo = await this.getUserInfo()

      if (userInfo.enabled) {
        this.$store.commit('setUser', userInfo)
        this.$store.commit('setUserClientsList', userInfo.clients)
        this.$store.commit('setReseller', userInfo.reseller)
        this.$store.commit(
          'setAvailableModules',
          userInfo.availablesApplication
        )
        this.$store.commit('setClient', userInfo.client)
        this.$store.commit('setUserPermissions', userInfo.role.permission)
        this.$store.commit('setRole', userInfo.role)
        this.isFetching = false
      } else {
        this.logout()
      }
      loader.hide()
    },
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin,
      })
    },
    cleanLocalStorage(loader) {
      localStorage.removeItem('bearerToken')
      localStorage.removeItem('accessToken')
      loader.hide()
    },
  },
}
</script>
