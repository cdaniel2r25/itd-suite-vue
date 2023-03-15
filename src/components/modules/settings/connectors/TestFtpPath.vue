<template>
  <v-row dense class="d-flex flex-row my-2">
    <div>
      <v-btn
        v-if="!pathLoadingStatus && !pathResponseStatus"
        outlined
        color="accent"
        @click="testPath(selectedPath)"
      >
        probar ruta
      </v-btn>
      <v-icon v-if="pathLoadingStatus && !pathResponseStatus">
        mdi-spin mdi-loading
      </v-icon>
      <v-sheet
        v-if="!pathLoadingStatus && pathResponseStatus"
        outlined
        rounded
        dense
        :color="pathStatus ? 'success' : 'error'"
      >
        <v-row
          v-if="!pathLoadingStatus && pathResponseStatus"
          class="white pa-1 rounded accent--text text-button font-weight-bold"
          dense
          max-width="10"
          no-gutters
        >
          <v-icon class="pr-1" :color="pathStatus ? 'success' : 'error'">
            {{ pathStatus ? 'mdi-check-circle' : 'mdi-close-circle' }}
          </v-icon>
          {{ pathStatus ? 'ruta habilitada' : 'ruta deshabilitada' }}
        </v-row>
      </v-sheet>
    </div>
    <div class="d-flex align-center px-5">
      <v-btn
        v-if="!pathLoadingStatus && pathResponseStatus && !pathStatus"
        text
        color="primary"
        @click="dialogActivator = true"
      >
        deseas crear?
      </v-btn>
    </div>
    <v-dialog v-model="dialogActivator" persistent max-width="30%">
      <v-card>
        <div class="d-flex justify-end mb-n8">
          <v-btn
            class="ml-15"
            color="grey"
            plain
            style="font-size: 1rem"
            @click="dialogActivator = false"
          >
            <v-icon color="grey">mdi-close</v-icon>
          </v-btn>
        </div>
        <div class="pa-10">
          <v-card-title
            class="text-h5 lighten-2 d-flex justify-space-between mt-n4"
          >
            <v-spacer />
            <div class="accent--text">Crear ruta</div>
            <v-spacer />
          </v-card-title>
          <v-card-subtitle class="d-flex justify-center my-5 accent--text">
            Comprueba si ruta está habilitada
          </v-card-subtitle>
          <v-card-text align="center">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="selectedPath.name"
                  label="Nombre"
                  placeholder="Nombre ruta"
                  outlined
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="selectedPath.path"
                  label="Ruta"
                  placeholder="carpeta/carpeta/documento"
                  outlined
                />
              </v-col>
            </v-row>
            <v-row class="justify-center mt-2" no-gutters>
              <v-sheet
                v-if="isPathCreatingResponse && pathCreationResponse !== null"
                outlined
                rounded
                :color="pathStatus ? 'success' : 'error'"
              >
                <v-row
                  class="white pa-2 rounded accent--text text-button font-weight-bold"
                  dense
                  max-width="10"
                  no-gutters
                >
                  <v-icon
                    class="pr-1"
                    :color="pathStatus ? 'success' : 'error'"
                  >
                    {{ pathStatus ? 'mdi-check-circle' : 'mdi-close-circle' }}
                  </v-icon>
                  {{
                    pathStatus
                      ? 'Se ha creado la ruta con éxito.'
                      : 'No se ha podido crear. Revise la información.'
                  }}
                </v-row>
              </v-sheet>
            </v-row>
          </v-card-text>
        </div>
        <v-card-actions class="justify-center pb-10">
          <v-btn
            large
            outlined
            color="primary"
            @click="dialogActivator = false"
          >
            CERRAR
          </v-btn>
          <v-btn
            v-if="!pathStatus"
            large
            color="primary"
            depressed
            class="ml-5"
            @click="createPath()"
          >
            CREAR
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import connectorsMixin from '@/mixins/services/connectorsMixin'

export default {
  name: 'TestFtpPath',
  mixins: [connectorsMixin],
  model: {
    prop: 'selectedPathAux',
    event: 'change-model',
  },
  props: {
    selectedPath: {
      type: Object,
      default: () => ({}),
    },
    selectedPathAux: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      pathCreationResponse: null,
      dialogActivator: false,
      pathStatus: false,
      isPathCreatingResponse: false,
      pathLoadingStatus: false,
      pathResponseStatus: false,
    }
  },

  methods: {
    async testPath(selectedPath) {
      this.pathLoadingStatus = true
      this.pathStatus = await this.testFtpPath(selectedPath)
      // TODO: eliminar es solo de prueba la línea de abajo
      // this.pathStatus = false
      this.pathLoadingStatus = false
      this.pathResponseStatus = true
      this.$emit('selected-path-index')
    },
    async createPath() {
      this.pathCreationResponse = await this.createFtpPath(this.selectedPath)
      this.selectedPath.id = this.pathCreationResponse
      this.selectedPathAux.id = this.pathCreationResponse
      this.selectedPathAux.name = this.selectedPath.name
      this.selectedPathAux.path = this.selectedPath.path
      if (
        this.pathCreationResponse &&
        this.pathCreationResponse !== '' &&
        this.pathCreationResponse !== '-1'
      )
        this.pathStatus = true
      else this.pathStatus = false
      this.isPathCreatingResponse = true
      this.pathResponseStatus = true
      this.pathLoadingStatus = false
    },
  },
}
</script>
