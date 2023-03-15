<template>
  <div>
    <v-dialog
      v-model="show"
      persistent
      fullscreen
      hide-overlay
      :retain-focus="false"
      transition="dialog-bottom-transition"
    >
      <v-card class="container">
        <v-toolbar>
          <v-btn text color="primary" @click="$emit('btn-close-action')">
            <v-icon class="mr-2">mdi-arrow-left</v-icon>
            volver a tracking
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-title>{{ selectedAutomation.name }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <div class="d-flex flex-column">
            <div class="d-flex align-center">
              <v-btn
                outlined
                rounded
                color="gray300"
                class="mr-6"
                @click="activateStopped()"
              >
                Detenido
                <v-icon class="ml-2">mdi-circle</v-icon>
              </v-btn>
              <v-btn
                color="gray300"
                class="mr-6 white--text"
                @click="activateExecute()"
              >
                <v-icon class="mr-2">mdi-play</v-icon>
                ejecutar
              </v-btn>
            </div>
          </div>
        </v-toolbar>
        <div class="all-screen" style="overflow: hidden">
          <v-container fluid class="px-0 py-0">
            <div class="p-10 center-column">
              <div v-if="activeCard" class="card-position">
                <v-sheet outlined color="primary" rounded>
                  <v-card elevation="5" width="300" outlined color="lightcyan">
                    <v-card-title
                      class="subtitle-1 gray300--text border-bottom-color"
                    >
                      <v-icon
                        size="20"
                        color="grey"
                        class="btn-close-card"
                        @click="activeCard = !activeCard"
                      >
                        mdi-close
                      </v-icon>
                      <div class="accent--text">
                        <v-icon color="primary"> mdi-file-document </v-icon>
                        Resumen ejecución
                        <div class="d-flex ml-7">
                          <span class="mt-1">ID #</span>
                          <v-select
                            v-model="selectSummary"
                            hide-details
                            solo
                            dense
                            flat
                            background-color="lightcyan"
                            :items="summaryItems"
                            style="width: 30px"
                            @change="changeSelectItem()"
                          />
                        </div>
                      </div>
                    </v-card-title>
                    <v-card-text class="mt-4 ml-4 py-0">Inicio:</v-card-text>
                    <v-card-title class="ml-4 py-0 accent--text">
                      {{ selectedAutomation.item.startDate }}
                    </v-card-title>
                    <v-card-text class="mt-4 ml-4 py-0">Fin:</v-card-text>
                    <v-card-title class="ml-4 py-0 accent--text">
                      {{ selectedAutomation.item.endDate }}
                    </v-card-title>
                    <v-card-text class="mt-4 ml-4 py-0">Estado:</v-card-text>
                    <v-card-title
                      class="ml-4 py-0 mb-4"
                      :class="selectedAutomation.color"
                    >
                      {{ selectedAutomation.state }}
                    </v-card-title>
                  </v-card>
                </v-sheet>
              </div>
            </div>
          </v-container>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'SeeDetailDialog',
  model: {
    prop: 'show',
    event: 'change-model',
  },
  props: {
    selectedAutomation: {
      type: Object,
      default: () => {},
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeCard: true,
      selectSummary: '3254',
      summaryItems: ['3254', '3255', '3256', '3257'],
      runSummaryList: [
        {
          id: 3254,
        },
        {
          id: 3255,
        },
        {
          id: 3256,
        },
        {
          id: 3257,
        },
      ],
    }
  },
  methods: {
    activateExecute() {},
    activateStopped() {},
    btnCloseCard() {},
    changeSelectItem() {
      console.log(this.summaryItems[0])
    },
  },
}
</script>
<style scoped>
.center-column {
  position: relative;
  padding: 10px;
  width: 100%;
  height: calc(100vh - 65px) !important;
  max-height: calc(100vh - 65px) !important;
  overflow-y: auto;
}
.all-screen {
  width: 100%;
  background-color: var(--v-gray-base);
  height: calc(100vh - 64px) !important;
}
.card-position {
  position: absolute;
  width: 300px;
  height: 500px;
  top: 20px;
  left: 20px;
}
.btn-close-card {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 1rem;
}
.border-bottom-color {
  border-bottom: 1px solid var(--v-primary-base) !important;
}
</style>
