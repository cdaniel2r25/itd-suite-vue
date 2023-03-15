<template>
  <div class="pa-6">
    <div class="mb-6">Origen de archivo</div>
    <v-form ref="form" v-model="valid" lazy-validation>
      <div class="d-flex align-start">
        <v-select
          v-model="selectedActivity.config.directoryType"
          dense
          :items="directory"
          item-text="text"
          item-value="value"
          :rules="fieldRules"
          label="Tipo directorio"
          placeholder="Ingresar directorio"
          outlined
          @change="searchConnector(selectedActivity.config.directoryType)"
        />
        <tooltip
          message="Tipo de directorio donde se<br>hará búsqueda del archivo."
        />
      </div>
      <div v-if="selectedActivity.config.directoryType === 'FTP'">
        <div class="d-flex align-start">
          <v-select
            v-model="selectedActivity.config.connectorId"
            dense
            :items="connectorsList"
            item-text="name"
            item-value="id"
            :rules="fieldRules"
            label="Conexión"
            placeholder="Seleccionar conexión"
            outlined
            @change="changeConnectorsList()"
          />
          <tooltip
            message="Selección de conexión para<br>búsqueda de archivo."
          />
        </div>
        <div class="d-flex align-start">
          <v-select
            v-model="selectedActivity.config.routesValue"
            dense
            :items="routesList"
            :hint="`${selectedActivity.config.routesValue}`"
            item-text="name"
            item-value="path"
            :rules="fieldRules"
            label="Ruta origen"
            placeholder="Seleccionar ruta"
            outlined
            @change="$emit('change-element')"
          />
          <tooltip message="Ruta de ubicación del<br>archivo." />
        </div>
      </div>
      <div class="mb-6">Tipo de archivo</div>
      <div class="d-flex align-start">
        <v-text-field
          v-model="selectedActivity.config.prefix"
          :rules="textRules"
          label="Prefijo"
          placeholder="Coloque prefijo"
          outlined
          dense
          @change="$emit('change-element')"
        />
        <tooltip message="Prefijo asignado a archivo<br>para búsqueda." />
      </div>
      <div>Extensión de archivo</div>
      <div class="d-flex justify-space-between">
        <div class="caption d-flex flex-column justify-center">
          <v-checkbox
            v-model="selectedActivity.config.fileTypeCSV"
            hide-details
            @change="$emit('change-element')"
          />
          CSV
        </div>
        <div class="caption d-flex flex-column justify-center">
          <v-checkbox
            v-model="selectedActivity.config.fileTypeTXT"
            hide-details
            @change="$emit('change-element')"
          />
          TXT
        </div>
        <div class="caption d-flex flex-column justify-center">
          <v-checkbox
            v-model="selectedActivity.config.fileTypeXLS"
            hide-details
            @change="$emit('change-element')"
          />
          XLS
        </div>
        <div class="caption d-flex flex-column justify-center">
          <v-checkbox
            v-model="selectedActivity.config.fileTypeXLSX"
            hide-details
            @change="$emit('change-element')"
          />
          XLSX
        </div>
        <div class="caption d-flex flex-column justify-center">
          <v-checkbox
            v-model="selectedActivity.config.fileTypeOTHER"
            hide-details
            @change="$emit('change-element')"
          />
          OTRO
        </div>
      </div>
      <v-text-field
        v-if="selectedActivity.config.fileTypeOTHER"
        v-model="selectedActivity.config.extensionOTHER"
        :rules="textRules"
        label="Extensión de archivo"
        placeholder="Coloque extensión"
        outlined
        dense
        maxlength="3"
        class="mt-2"
        @change="$emit('change-element')"
      />
    </v-form>
  </div>
</template>

<script>
import automationBffMixin from '@/mixins/services/automationBffMixin'
import validationMixin from '@/mixins/validation/validationMixin'
import Tooltip from '@/components/util/Tooltip.vue'

export default {
  name: 'SearchFilesConfiguration',
  components: { Tooltip },
  mixins: [automationBffMixin, validationMixin],
  props: {
    selectedActivity: {
      type: Object,
      default: () => ({}),
    },
    clientId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      siShow: true,
      valid: false,
      directory: [
        { text: 'Directorio Local', value: 'LOCAL' },
        { text: 'Directorio FTP', value: 'FTP' },
      ],
      routesList: [],
      connectorsList: null,
    }
  },
  computed: {
    fieldRules() {
      return [(v) => this.isRequired(v, 'Campo')]
    },
    textRules() {
      return [(v) => this.isRequired(v, '')]
    },
  },
  created() {
    this.getConnectionList()
  },
  methods: {
    async getConnectionList(value) {
      if (this.selectedActivity.config.directoryType !== '') {
        this.connectorsList = []
        const list = await this.getAllTypesConnectorsByClientId(
          this.clientId,
          value
        )
        if (list.length !== 0) {
          list.data.forEach((item) => {
            const valor = {
              name: item.name,
              id: item.id,
              content: item.content,
            }
            this.connectorsList.push(valor)
          })
        }
        this.createRoutes()
      }
    },
    changeConnectorsList() {
      this.createRoutes()
      this.$emit('change-element')
    },
    createRoutes() {
      this.routesList = null
      let list = this.connectorsList
      list = list.filter(
        (record) => record.id === this.selectedActivity.config.connectorId
      )
      this.routesList = list[0].content
    },
    searchConnector(value) {
      this.$emit('change-element')
      this.getConnectionList(value)
    },
  },
}
</script>
