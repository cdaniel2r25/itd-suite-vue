<template>
  <v-card width="330">
    <div style="text-align: right">
      <v-btn icon color="grey" @click="$emit('change-model', false)">
        <v-icon small>mdi-close</v-icon>
      </v-btn>
    </div>
    <v-card-text>
      <div class="d-flex align-center">
        <v-btn class="ml-2" fab color="primary">
          {{ initials() }}
        </v-btn>
        <div>
          <div class="ml-4">
            <div class="accent--text font-weight-bold">
              {{ user.firstname }}
              {{ user.lastname }}
            </div>
            <div class="primary--text">
              {{ user.email }}
            </div>
            <div class="mt-2">
              <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                  <div
                    class="primary--text style-chip"
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ user.roleName }}
                  </div>
                </template>
                <span>{{ user.roleDescription }}</span>
              </v-tooltip>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-14 mr-6">
        <div class="caption primary--text mx-4">Conectado como:</div>
        <client-list class="mx-4" style="width: 100%" />
      </div>
      <div class="mt-10 mb-6" style="text-align: center">
        <v-btn class="ma-2 px-8" outlined color="primary">
          <v-icon primary left> mdi-account </v-icon>
          mi perfil
        </v-btn>
        <v-btn class="ma-2 px-5" outlined color="gray300" @click="logout()">
          cerrar sesión
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import ClientList from '@/components/navbar/ClientList.vue'

export default {
  name: 'UserInfoModal',
  components: { ClientList },
  model: {
    prop: 'menuUser',
    event: 'change-model',
  },
  props: {
    menuUser: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin,
      })
    },
    initials() {
      const ini =
        this.user.firstname.substr(0, 1) + this.user.lastname.substr(0, 1)
      return ini
    },
  },
}
</script>

<style scoped>
.style-chip {
  text-align: center;
  background-color: var(--v-primary100-base);
  border-radius: 16px;
  font-size: 14px;
  line-height: 20px;
  padding: 6px 12px;
  height: 32px;
  max-width: 180px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
