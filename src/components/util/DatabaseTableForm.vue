<template>
  <v-card>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card-title>
        <p class="text-center">Importar base de datos</p>
      </v-card-title>
      <v-card-text v-if="!loading">
        Ingresa nombre y configura columnas para importar base de datos .
      </v-card-text>
      <v-container v-if="!loading">
        <v-row class="pl-4">
          <v-col class="py-0" cols="5">
            <v-text-field
              v-model="customTable.name"
              :rules="nameRules"
              label="Nombre"
              placeholder="Ingresar nombre de base de datos"
              dense
              outlined
            />
          </v-col>
        </v-row>
      </v-container>

      <v-data-table
        v-if="!loading"
        :headers="headers"
        :items="customTableData.jsonDataRow"
        :items-per-page="10"
        class="mx-8 rounded-sm striped-table"
        style="border: 2px solid gray300"
        hide-default-header
        hide-default-footer
      >
        <template v-slot:header="{ props }">
          <tr>
            <!-- <td
              v-for="(header, index) in customTable.headerConfig.fields"
              :key="index"
              class="pt-6 px-3 text-caption"
            > -->
            <td
              v-for="(header, index) in customTable.headerConfigList"
              :key="index"
              class="pt-6 px-3 text-caption"
            >
              <v-select
                v-model="header['type']"
                :items="items[index]"
                :rules="columnRules"
                label="Configuración columna"
                dense
                outlined
                return-object
                item-text="1.type"
              />
            </td>
          </tr>
          <tr>
            <td
              v-for="header in props.headers"
              :key="header.value"
              class="pa-4 text-caption header-lines"
            >
              {{ header.text }}
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-container v-if="loading">
        <v-row justify="center">
          <v-col cols="12">
            <v-card color="gray100" min-height="90" width="90%" flat>
              <v-row justify="space-around">{{ customTable.name }}</v-row>
              <v-row justify="space-around">
                <v-col cols="11">
                  <v-progress-linear
                    v-model="uploadPercentage"
                    color="gray300"
                    height="20"
                  >
                    <template v-slot:default="{ value }">
                      <strong>{{ Math.ceil(value) }}%</strong>
                    </template>
                  </v-progress-linear>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <v-row justify="center" class="px-6 mt-8">
          <v-alert outlined type="info">
            El envio o programación de la campaña de email podría variar de
            acuerdo al tiempo de importación de base de datos.
          </v-alert>
        </v-row>
      </v-container>

      <v-card-actions>
        <v-container>
          <v-checkbox
            v-if="!loading"
            v-model="customTable.singleUse"
            label="Usar solo por esta vez"
          />
          <v-col cols="12">
            <v-btn
              class="ma-2"
              color="primary"
              outlined
              @click="$emit('input', false)"
            >
              cancelar
            </v-btn>
            <v-btn
              class="ma-2"
              color="primary"
              @click="
                loading ? $emit('input', false) : submitCustomTable(customTable)
              "
            >
              {{
                loading ? 'CONTINUAR MIENTRAS SE IMPORTA ARCHIVO' : 'importar'
              }}
            </v-btn>
          </v-col>
        </v-container>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import generalMixin from '@/mixins/util/generalMixin'
import validationMixin from '@/mixins/validation/validationMixin'

export default {
  name: 'DatabaseForm',
  mixins: [generalMixin, validationMixin],
  props: {
    customTableData: {
      type: Object,
      default: () => ({ jsonDataRow: [], disabled: false, deleted: false }),
    },
    basePath: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      valid: false,
      loading: false,
      uploadPercentage: 0,
      items: [],
      headers: [],
      customTable: {
        name: '',
        headerConfig: { fields: [] },
        singleUse: false,
        clientId: '',
        numberRows: 0,
        numberEmailTypeRow: 0,
        numberPhoneTypeRow: 0,
        typeId: 'string',
        verified: false,
        disabled: false,
        deleted: false,
      },
    }
  },
  computed: {
    ...mapGetters(['clientId']),
    nameRules() {
      return [(v) => this.isRequired(v, 'Nombre'), (v) => this.minLength(v, 5)]
    },
    columnRules() {
      return [
        (v) => this.isRequired(v, 'Columna'),
        (v) => this.isValidColumn(v, this.customTableData.jsonDataRow),
      ]
    },
  },
  mounted() {
    this.getDataTypesList()
    this.setHeaders()
    this.setClientId()
    this.setNumberRows()
  },
  methods: {
    async getDataTypesList() {
      const types = await this.getDataTypes(this.basePath)
      Object.keys(this.customTableData.jsonDataRow[0]).forEach((header) => {
        const items = []
        types.forEach((datatype) => {
          items.push([
            header,
            {
              type: datatype.name,
              required: false,
              validate: false,
            },
          ])
        })
        this.items.push(items)
      })
    },
    setHeaders() {
      Object.keys(this.customTableData.jsonDataRow[0]).forEach((header) => {
        this.headers.push({
          text: header,
          value: header,
        })
        // this.customTable.headerConfig.fields.push({
        this.customTable.headerConfigList.push({
          field: header,
          type: null,
          required: false,
          validate: false,
        })
      })
    },
    setNumberRows() {
      this.customTable.numberRows = this.customTableData.jsonDataRow.length
    },
    setClientId() {
      this.customTable.clientId = this.clientId
    },
    onProgress(progressEvent) {
      this.uploadPercentage = progressEvent
    },
    cleanHeaderConfig(header) {
      for (let index = 0; index < header.fields.length; index += 1) {
        const element = header.fields[index]
        header.fields[index].type = element.type[1].type
      }
    },
    async submitCustomTable(table) {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.cleanHeaderConfig(table.headerConfig)
        await this.createCustomTable(this.basePath, table)
          .then((result) => {
            this.customTableData.customTableId = result.data.id
            this.$emit('upload-database', result.data, true)
            this.createCustomTableData(
              this.basePath,
              this.customTableData,
              this.onProgress
            )
              .then(() => {
                this.$emit('upload-database', result.data, false)
                this.$emit('input', false)
                this.loading = false
                this.uploadPercentage = 0
              })
              .catch((err) => {
                console.error(err)
              })
          })
          .catch((err) => {
            console.error(err)
          })
      }
    },
  },
}
</script>
<style scoped>
.striped-table :deep(tbody tr) {
  color: var(--v-accent-base);
}
.striped-table :deep(tbody tr:nth-of-type(even)) {
  background-color: rgba(196, 196, 196, 0.3);
}
.header-lines {
  border-top: thin solid rgba(0, 0, 0, 0.12);
  border-bottom: thin solid rgba(0, 0, 0, 0.12);
}
</style>
