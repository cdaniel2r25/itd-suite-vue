<template>
  <div>
    <v-app-bar
      app
      clipped-left
      height="80"
      color="white"
      class="py-0 px-0"
      flat
      style="padding: 0 !important"
    >
      <v-container fluid px-0 py-0>
        <div class="d-flex align-center home-ini">
          <div class="primary d-flex justify-center align-center">
            <v-img
              max-height="48"
              max-width="74"
              :src="require('@/assets/logo_itd_blanco_mini.png')"
              style="cursor: pointer"
              @click="$router.push({ name: 'Home' })"
            />
          </div>
          <div class="d-flex justify-space-between">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon large color="primary">mdi-apps</v-icon>
                </v-btn>
              </template>
              <modules-list-modal
                v-if="availableModules"
                :modules="availableModules"
              />
            </v-menu>
            <v-scroll-x-transition>
              <v-text-field
                v-if="seekHelp"
                dense
                hide-details
                label="Ingresa tu búsqueda"
                clear-icon="mdi-close"
                prepend-inner-icon="mdi-magnify"
                clearable
                placeholder="Buscar aplicaciones, servicios, archivos..."
                class="ml-2 mt-2"
              />
            </v-scroll-x-transition>
          </div>
          <div class="d-flex justify-end">
            <v-btn icon @click="seekHelp = !seekHelp">
              <v-icon color="primary">mdi-magnify</v-icon>
            </v-btn>
            <v-menu
              v-model="menuNotification"
              offset-y
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-badge
                    :value="newNotificationMessages"
                    color="secondary"
                    bordered
                    dot
                    offset-x="10"
                    offset-y="10"
                  >
                    <v-icon color="primary">mdi-bell</v-icon>
                  </v-badge>
                </v-btn>
              </template>
              <notification-list-modal
                v-model="menuNotification"
                :notifications="notifications"
                @selection-notification="selectionNotification"
                @see-all-notifications="seeAllNotifications()"
                @mark-all-read="markAllRead()"
              />
            </v-menu>
            <v-btn icon>
              <v-icon color="primary">mdi-help-circle</v-icon>
            </v-btn>
            <v-hover v-slot="{ hover }">
              <v-card
                elevation="0"
                :color="hover ? 'lightcyan' : ''"
                class="d-flex align-center px-2 py-2"
              >
                <p class="primary--text mb-0 client-name">
                  {{ clientName }}
                </p>
                <v-menu
                  v-model="menuUser"
                  offset-y
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="ml-2"
                      fab
                      small
                      color="primary"
                      v-bind="attrs"
                      v-on="on"
                    >
                      {{ initials() }}
                    </v-btn>
                  </template>
                  <user-info-modal
                    v-model="menuUser"
                    :user="{
                      firstname: userGivenName,
                      lastname: userFamilyName,
                      email: $auth.user.email,
                      roleName: userRole.name,
                      roleDescription: userRole.description,
                    }"
                  />
                </v-menu>
              </v-card>
            </v-hover>
          </div>
        </div>
      </v-container>
      <template v-if="insideModule" v-slot:extension>
        <v-sheet flat class="menu-bar d-flex">
          <nav-tabs />
        </v-sheet>
      </template>
    </v-app-bar>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import sideBarItemsMixin from '@/mixins/sideBarItemsMixin'
import ModulesListModal from '@/components/navbar/ModulesListModal.vue'
import NavTabs from '@/components/navbar/NavTabs.vue'
import UserInfoModal from '@/components/navbar/UserInfoModal.vue'
import NotificationListModal from '@/components/navbar/NotificationListModal.vue'
import notificationsBffMixin from '@/mixins/services/notificationsBffMixin'

moment.locale('ES')

export default {
  name: 'NavBar',
  components: {
    NavTabs,
    ModulesListModal,
    UserInfoModal,
    NotificationListModal,
  },
  mixins: [sideBarItemsMixin, notificationsBffMixin],
  props: {
    insideModule: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    newNotificationMessages: false,
    menuUser: false,
    menuNotification: false,
    seekHelp: false,
    datetime: moment(new Date()).format('dddd DD [de] MMMM  H:mm:ss'),
    notifications: [],
  }),
  computed: {
    ...mapGetters([
      'clientId',
      'availableModules',
      'clientName',
      'userRole',
      'miniSideBar',
      'userGivenName',
      'userFamilyName',
    ]),
  },
  created() {
    const getLastDateTime = () => {
      setInterval(() => {
        this.datetime = moment(new Date()).format('dddd DD [de] MMMM  H:mm:ss')
      }, 600)
    }
    this.getListNotifications()
    getLastDateTime()
  },
  methods: {
    async getListNotifications() {
      const result = await this.getNotificationsNewsByClientId(this.clientId)
      if (result !== '') {
        this.newNotificationMessages = result.newNotificationMessages
        this.notifications = result.notifications
      }
    },
    initials() {
      const ini =
        this.userGivenName.substr(0, 1) + this.userFamilyName.substr(0, 1)
      return ini
    },
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin,
      })
    },
    seeAllNotifications() {
      this.menuNotification = false
      this.$router.push({ name: 'AllNotifications' })
    },
    async selectionNotification(itemNotification) {
      const items = {
        clientId: this.clientId,
        notificationId: [{ notificationId: itemNotification.id }],
      }
      const result = await this.markNotificationsAsReadByClientIdNotificationId(
        items
      )
      if (result) {
        const index = this.notifications.findIndex(
          (t) => t.id === itemNotification.id
        )
        this.notifications[index].notSeen = false
        this.newNotificationMessages = false
        this.notifications.forEach((item) => {
          if (item.notSeen) {
            this.newNotificationMessages = true
          }
        })
      }
    },
    async markAllRead() {
      const listItems = []
      this.notifications.forEach((item) => {
        if (item.notSeen) {
          const itemN = { notificationId: item.id }
          listItems.push(itemN)
        }
      })
      const items = {
        clientId: this.clientId,
        notificationId: listItems,
      }
      const result = await this.markNotificationsAsReadByClientIdNotificationId(
        items
      )
      if (result) {
        this.notifications.forEach((item) => {
          if (item.notSeen) {
            item.notSeen = false
          }
        })
        this.newNotificationMessages = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.datetime {
  font-size: 14px;
}
.home-ini {
  margin-left: -16px;
  margin-right: -16px;
  box-shadow: 0px 3px 5px -1px rgb(0 0 0 / 20%),
    0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%) !important;
}
.home-ini > div:nth-child(1) {
  min-height: 80px;
  width: 200px;
}
.home-ini > div:nth-child(2) {
  width: calc(calc(100% - 200px) * 40 / 100);
}
.home-ini > div:nth-child(3) {
  width: calc(calc(100% - 200px) * 60 / 100);
}
.menu-bar {
  margin: 0 -16px 0 -16px;
  width: calc(100vw);
  background: var(--v-lightcyan-base);
  box-shadow: inset 0px 4px 5px 0px rgb(0 0 0 / 14%);
}
@media (max-width: 930px) {
  .home-ini > div:nth-child(1) {
    width: 115px;
  }
  .home-ini > div:nth-child(2) {
    width: calc(100% - 115px - 210px);
  }
  .home-ini > div:nth-child(3) {
    width: 210px;
  }
  .client-name {
    display: none;
  }
}
</style>
