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
          <div>
            <v-btn text color="primary" @click="exitParameters()">
              <v-icon class="mr-2">mdi-arrow-left</v-icon>
              VOLVER
            </v-btn>
          </div>
          <v-spacer></v-spacer>
          <v-toolbar-title v-if="databaseParameters" class="primary--text">
            Parámetros de {{ databaseParameters.name }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <div class="d-flex align-center">
            <div class="d-flex flex-column">
              <v-btn
                color="primary"
                :class="{ 'change-btn': changes }"
                @click="saveParameters()"
              >
                CARGAR PARÁMETROS
              </v-btn>
              <v-progress-linear
                v-if="progressSave"
                indeterminate
                color="primary darken-2"
                class="pr-6"
              />
            </div>
          </div>
        </v-toolbar>
        <div class="pa-6 all-screen">
          <v-skeleton-loader v-if="loading" type="table" />
          <v-data-table
            :headers="headers"
            :items="listParameters.list"
            dense
            class="striped-table"
            :footer-props="{
              'show-current-page': true,
              'show-first-last-page': true,
              'items-per-page-text': 'Elementos por página',
              'items-per-page-options': [5, 10, 15, 20, 25],
            }"
          >
            <template v-slot:[`item.isNull`]="{ item }">
              <v-simple-checkbox
                v-model="item.isNull"
                hide-details
                @click="changes = true"
              />
            </template>
            <template v-slot:[`item.ignoreColumn`]="{ item }">
              <v-simple-checkbox
                v-model="item.ignoreColumn"
                hide-details
                @click="changes = true"
              />
            </template>
            <template v-slot:[`item.transformation`]="{ item }">
              <v-select
                v-model="item.transformation"
                :items="itemsTransformation"
                hide-details
                class="caption"
                @change="changes = true"
              />
            </template>
            <template v-slot:[`item.error`]="{ item }">
              <v-select
                v-model="item.error"
                :items="itemsError"
                hide-details
                class="caption"
                @change="changes = true"
              />
            </template>
            <template v-slot:[`item.default`]="{ item }">
              <v-text-field
                v-model="item.default"
                hide-details
                class="caption"
              />
            </template>
          </v-data-table>
        </div>
      </v-card>
    </v-dialog>
    <base-dialog
      v-model="changesDialog"
      text-alert="Tienes cambios sin guardar, ¿Estás seguro de salir? "
      primary-btn-text="Sí, Salir"
      @primary-btn-action="exitDefParameters()"
    />
  </div>
</template>

<script>
import automationBffMixin from '@/mixins/services/automationBffMixin'
import BaseDialog from '@/components/util/BaseDialog.vue'

export default {
  name: 'GenerateParameters',
  components: { BaseDialog },
  mixins: [automationBffMixin],
  model: {
    prop: 'show',
    event: 'change-model',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    processId: {
      type: String,
      default: '',
    },
    atomationId: {
      type: String,
      default: '',
    },
    clientId: {
      type: String,
      default: '',
    },
    listParameters: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      changes: false,
      progressSave: false,
      changesDialog: false,
      itemsTransformation: ['N/A', 'Default'],
      itemsError: ['N/A', 'Ignorar valor', 'Ignorar campo', 'Reemplazar'],
      databaseParameters: null,
      headers: [
        { text: 'Campo', value: 'name', align: 'start' },
        { text: 'Tipo', value: 'type', align: '' },
        { text: 'Formato', value: 'format', align: '', width: '150' },
        { text: 'Longitud', value: 'length', align: '', width: '100' },
        { text: 'Es nulo', value: 'isNull', align: '', width: '100' },
        {
          text: 'Ignorar columna',
          value: 'ignoreColumn',
          align: '',
          width: '100',
        },
        { text: 'Transformación', value: 'transformation', align: '' },
        { text: 'Default', value: 'default', align: '' },
        { text: 'Error', value: 'error', align: '' },
      ],
      loading: false,
      isLoaded: false,
    }
  },
  methods: {
    async saveParameters() {
      this.progressSave = true
      const saveItem = {
        clientId: this.clientId,
        processId: this.processId,
        atomationId: this.atomationId,
        dataList: this.databaseParameters,
      }
      const response =
        await this.modifyParametersByClientIdProcessIdAndAtomationId(saveItem)
      if (response) {
        this.changes = false
        this.isLoaded = true
        this.exitParameters()
      }
      this.progressSave = false
    },
    exitParameters() {
      if (this.changes) {
        this.changesDialog = true
      } else {
        if (this.isLoaded) {
          this.$emit('is-loaded')
        }
        this.$emit('change-model', false)
      }
    },
    exitDefParameters() {
      this.changesDialog = false
      this.$emit('change-model', false)
    },
  },
}
</script>

<style scoped>
.all-screen {
  width: 100%;
  height: calc(100vh - 64px) !important;
}
.change-btn {
  animation: changeAnimation 3s ease 0s infinite normal none;
}
@keyframes changeAnimation {
  0% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.75;
  }
  100% {
    opacity: 1;
  }
}
</style>
