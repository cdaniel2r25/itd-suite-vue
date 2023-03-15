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
      <v-card color="gray" class="container">
        <v-toolbar>
          <div>
            <v-btn text color="primary" @click="$emit('close-dialog')">
              <v-icon class="mr-2">mdi-arrow-left</v-icon>
              volver a procesos
            </v-btn>
          </div>
          <v-divider vertical></v-divider>
          <v-spacer></v-spacer>
          <v-toolbar-title>Vista previa</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon color="primary" @click="previsualizacion('cell')">
            <v-icon>mdi-cellphone</v-icon>
          </v-btn>
          <v-btn icon color="primary" @click="previsualizacion('pc')">
            <v-icon>mdi-laptop</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container class="px-0 py-0">
          <div class="all-screen">
            <v-card
              outlined
              color="white"
              :width="containerWidth"
              class="ma-10 mx-auto all-screen-card"
            >
              <v-card-text class="d-flex">
                <v-icon color="gray100" class="mr-1">
                  mdi-checkbox-blank-circle-outline
                </v-icon>
                <v-icon color="gray100" class="mr-1">
                  mdi-checkbox-blank-circle-outline
                </v-icon>
                <v-icon color="gray100" class="mr-1">
                  mdi-checkbox-blank-circle-outline
                </v-icon>
              </v-card-text>
              <v-divider class="my-0"></v-divider>
              <v-card-text class="d-flex justify-center flex-column">
                <div v-html="htmlContent"></div>
              </v-card-text>
            </v-card>
          </div>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'ViewHtmlDialog',
  model: {
    prop: 'show',
    event: 'change-model',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    htmlContent: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      containerWidth: 'auto',
    }
  },
  methods: {
    previsualizacion(type) {
      if (type === 'cell') {
        this.containerWidth = '390'
      } else {
        this.containerWidth = 'auto'
      }
    },
  },
}
</script>

<style scoped>
.all-screen {
  height: calc(100vh - 64px) !important;
  position: relative;
  background-color: var(--v-gray-base);
}
.all-screen-card {
  height: calc(100vh - 130px) !important;
  overflow-y: auto;
}
</style>
