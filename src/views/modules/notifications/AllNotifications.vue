<template>
  <v-container fluid fill-height>
    <v-col class="fill-height">
      <v-row no-gutters>
        <v-col cols="12">
          <h1>Todas las notificaciones</h1>
          <P class="my-2"> Revisa listado de notificaciones. </P>
        </v-col>
      </v-row>
      <div>
        <notifications-all-table :client-id="clientId" />
      </div>
    </v-col>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import NotificationsAllTable from '@/components/modules/notifications/NotificationsAllTable.vue'

export default {
  name: 'AllNotifications',
  components: { NotificationsAllTable },
  computed: {
    ...mapGetters(['clientId']),
  },
  mounted() {
    this.switchRghtWhatsapp()
  },
  beforeDestroy() {
    document.getElementById('no-left').style.marginLeft = '0px'
  },
  methods: {
    switchRghtWhatsapp() {
      const elemento = document.getElementById('no-left')
      const ancho = `${window.innerWidth - 100}px`
      elemento.style.marginLeft = ancho
    },
  },
}
</script>
