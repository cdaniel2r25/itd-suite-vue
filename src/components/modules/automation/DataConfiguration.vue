<template>
  <div>
    <div class="px-6 mt-6">
      <v-select
        v-model="selectedActivity.config.dataConfiguration.filter"
        dense
        :items="listFilter"
        :rules="fieldRules"
        label="Filtro"
        placeholder="Seleccione filtro"
        outlined
        @change="$emit('change-element')"
      />
    </div>
    <div class="px-6 mt-4 font-weight-bold d-flex">
      Parámetros del archivo
      <tooltip
        message="Mapeo de variables de<br>archivo Jasper cargado en<br>directorio con columnas de<br>BBDD de origen."
      />
    </div>
    <div class="px-6 mt-1 caption">
      Asigna columnas de BBDD de origen a Parámetros de archivo (variables).
    </div>
    <div v-if="!activateAssignColumns" class="px-6 mt-10">
      <v-btn
        outlined
        block
        x-large
        color="primary"
        @click="activateAssignColumns = !activateAssignColumns"
      >
        <div class="d-flex flex-column py-2">
          <div class="d-flex">
            <v-icon left> mdi-view-list </v-icon>
            ASIGNAR COLUMNAS
          </div>
        </div>
      </v-btn>
    </div>
    <div v-else class="px-6 mt-6">
      <v-sheet outlined color="primary" rounded>
        <v-card class="overflow-y-auto" max-height="300">
          <v-card-text>
            <v-row>
              <v-col cols="6" class="caption">
                Parámetros de archivo (Variables)
              </v-col>
              <v-col cols="6" class="caption"> Corresponde a: </v-col>
            </v-row>
            <div
              v-for="(itemCol, i) in selectedActivity.config.dataConfiguration
                .listColumns"
              :key="i"
            >
              <v-row class="align-center">
                <v-col cols="5">{{ itemCol.variable }}</v-col>
                <v-col cols="1" class="text-center">
                  <v-icon color="gray300"> mdi-arrow-right </v-icon>
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="itemCol.column"
                    dense
                    :items="listVariablesTemplate"
                    label="Columna"
                    placeholder="Seleccione"
                    outlined
                    hide-details
                    @change="$emit('change-element')"
                  />
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-sheet>
    </div>
    <div class="px-6">
      <v-btn
        text
        color="primary"
        class="pl-0 caption"
        @click="removeColumnMapping()"
      >
        eliminar ASIGNACIÓN DE COLUMNAS
      </v-btn>
    </div>
  </div>
</template>

<script>
import validationMixin from '@/mixins/validation/validationMixin'
import Tooltip from '@/components/util/Tooltip.vue'
import automationBffMixin from '@/mixins/services/automationBffMixin'

export default {
  name: 'DataConfiguration',
  components: { Tooltip },
  mixins: [validationMixin, automationBffMixin],
  props: {
    selectedActivity: {
      type: Object,
      default: () => ({}),
    },
    listVariablesTemplate: {
      type: Array,
      default: () => [],
    },
    clientId: {
      type: String,
      default: '',
    },
    processId: {
      type: String,
      default: '',
    },
    atomationId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      activateAssignColumns: false,
      listFilter: [],
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
    this.createListFilter()
  },
  methods: {
    async createListFilter() {
      const listF =
        await this.getListOfFiltersByClientIdProcessIdAndAtomationId(
          this.clientId,
          this.processId,
          this.atomationId
        )
      this.listFilter = listF.listFilter
    },
    removeColumnMapping() {
      this.selectedActivity.config.dataConfiguration.listColumns.forEach(
        (item) => {
          item.column = ''
        }
      )
    },
  },
}
</script>
