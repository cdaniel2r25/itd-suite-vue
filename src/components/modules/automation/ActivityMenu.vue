<template>
  <v-card elevation="5" width="260" class="mx-auto">
    <v-card-title class="subtitle-1 gray300--text border-bottom-color">
      <v-icon
        size="20"
        color="grey"
        class="btn-close-card"
        @click="$emit('close-menu')"
      >
        mdi-close
      </v-icon>
    </v-card-title>
    <div class="card-overflow">
      <v-card-text>
        <v-list-item-title>Actividad de datos</v-list-item-title>
        <v-list nav dense class="px-0">
          <v-list-item-group
            v-model="selectedDataActivitiesItem"
            color="primary"
          >
            <v-list-item
              v-for="(item, i) in addDataActivitiesItems"
              :key="i"
              @click="activitiesClick(item.value)"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-list-item-title>Actividad de control</v-list-item-title>
        <v-list nav dense class="px-0">
          <v-list-item-group
            v-model="selectedControlActivitiesItem"
            color="primary"
          >
            <v-list-item
              v-for="(item, i) in addControlActivitiesItems"
              :key="i"
              @click="activitiesClick(item.value)"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-list-item-title>Aplicaciones</v-list-item-title>
        <v-list nav dense class="px-0">
          <v-list-item-group v-model="selectedApplicationsItem" color="primary">
            <v-list-item
              v-for="(item, i) in addApplicationsItems"
              :key="i"
              @click="activitiesClick(item.value)"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card-text>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'ActivityMenu',
  data() {
    return {
      selectedDataActivitiesItem: -1,
      addDataActivitiesItems: [
        { text: 'Generar PDF', icon: 'mdi-file-pdf-box', value: 'generatePDF' },
        { text: 'Buscar archivos', icon: 'mdi-folder', value: 'searchFiles' },
        {
          text: 'Cargar archivo',
          icon: 'mdi-cloud-upload',
          value: 'fileUpload',
        },
        {
          text: 'Entregar archivo',
          icon: 'mdi-archive-arrow-up',
          value: 'deliverFile',
        },
        {
          text: 'Mover archivos',
          icon: 'mdi-database-refresh',
          value: 'moveFiles',
        },
      ],
      selectedControlActivitiesItem: -1,
      addControlActivitiesItems: [
        {
          text: 'Disparador',
          icon: 'mdi-lightning-bolt-circle',
          value: 'trigger',
        },
        { text: 'En espera', icon: 'mdi-timer-outline', value: 'onHold' },
        { text: 'Conexión', icon: 'mdi-file', value: 'connection' },
        { text: 'Inicio', icon: 'mdi-play', value: 'beginning' },
        { text: 'Condición', icon: 'mdi-code-tags', value: 'condition' },
        { text: 'Notificación', icon: 'mdi-bell', value: 'notification' },
      ],
      selectedApplicationsItem: -1,
      addApplicationsItems: [
        { text: 'Enviar email', icon: 'mdi-email', value: 'sendEmail' },
        { text: 'Enviar SMS', icon: 'mdi-message-text', value: 'sendSMS' },
      ],
    }
  },
  methods: {
    activitiesClick(type) {
      this.$emit('selection-activity', type)
    },
  },
}
</script>
<style scoped>
.btn-close-card {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
