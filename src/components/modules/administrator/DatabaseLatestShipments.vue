<template>
  <div>
    <div class="pa-2">
      <v-card
        :height="filterDrawer ? 185 : 0"
        width="730"
        :style="filterDrawer ? '' : 'display: none'"
        class="mt-2 ml-auto"
      >
        <v-row class="px-4">
          <v-col cols="4">
            <v-text-field
              v-model="filter.key"
              dense
              outlined
              hide-details
              label="KEY"
              placeholder="Ingresar KEY"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="filter.addressee"
              dense
              outlined
              hide-details
              label="Destinatario"
              placeholder="Ingresar destinatario"
            />
          </v-col>
          <v-col cols="4">
            <v-select
              v-model="filter.firstList"
              dense
              :items="firstList"
              label="Primeros en la lista"
              hide-details
              placeholder="Selecciona"
              outlined
            />
          </v-col>
        </v-row>
        <v-row class="px-4">
          <v-col cols="4">
            <v-select
              v-model="filter.source"
              dense
              :items="sourceList"
              label="Origen"
              hide-details
              placeholder="Seleccionar"
              outlined
            />
          </v-col>
          <v-col cols="4">
            <v-select
              v-model="filter.status"
              dense
              :items="statusList"
              label="Estado"
              hide-details
              placeholder="Seleccionar"
              outlined
            />
          </v-col>
          <v-col cols="4">
            <v-select
              v-model="filter.typeContent"
              dense
              :items="typeContentList"
              label="Tipo de contenido"
              hide-details
              placeholder="Selecciona"
              outlined
            />
          </v-col>
        </v-row>
        <v-btn text color="primary" class="mt-4 ml-4" @click="cleanFilters()">
          limpiar filtros
        </v-btn>
      </v-card>
    </div>
    <v-skeleton-loader v-if="loading" type="table" />
    <div v-else>
      <v-row>
        <v-col cols="6"></v-col>
        <v-col cols="6">
          <div class="d-flex justify-end">
            <v-btn text color="primary" @click="reorderDataTable()">
              <v-icon left>mdi-pencil</v-icon>
              reordenar columnas
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="databasesList"
        dense
        class="striped-table"
        :footer-props="{
          'show-current-page': true,
          'show-first-last-page': true,
          'items-per-page-text': 'Elementos por página',
          'items-per-page-options': [5, 10, 15, 20, 25],
        }"
      >
        <template v-slot:[`item.status`]="{ item }">
          <div>
            {{ item.status }}
          </div>
        </template>
        <template v-slot:[`item.message`]="{ item }">
          <div class="datatable-col" style="max-width: 100px !important">
            {{ item.message }}
          </div>
        </template>
      </v-data-table>
    </div>
    <reorder-columns-dialog
      v-model="activeReorder"
      :item-database="headersClone"
      @primary-btn-action="reorderDataTableList"
      @primary-btn-cancel="activeReorder = false"
      @move-down="moveDown"
      @move-up="moveUp"
    />
  </div>
</template>

<script>
import administratorBffMixin from '@/mixins/services/administratorBffMixin'
import whatsappReportBffMixin from '@/mixins/services/whatsapp/reportBffMixin'
import ReorderColumnsDialog from '@/components/modules/administrator/ReorderColumnsDialog.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'DatabaseLatestShipments',
  components: { ReorderColumnsDialog },
  mixins: [administratorBffMixin, whatsappReportBffMixin],
  data() {
    return {
      databasesList: [],
      headers: [
        { text: 'Origen', value: 'source', align: '', width: '100' },
        { text: 'KEY', value: 'responseKey', align: '' },
        {
          text: 'Destinatario',
          value: 'destinationPhone',
          align: '',
          width: '100',
        },
        { text: 'Remitente', value: 'sender.phone', align: '', width: '100' },
        { text: 'Fecha encolado', value: 'queuedAt', align: '' },
        { text: 'Fecha envío', value: 'sendAt', align: '' },
        { text: 'Fecha recepción', value: 'deliveredAt', align: '' },
        { text: 'Mensaje', value: 'content', class: 'datatable-col' },
        { text: 'Estado', value: 'status', align: '' },
        { text: 'Cliente', value: 'client.name', align: '' },
      ],
      loading: false,
      firstList: ['10', '25', '40', '100', '200'],
      filterDrawer: false,
      filter: [
        { clientName: '' },
        { key: '' },
        { addressee: '' },
        { firstList: '' },
        { source: '' },
        { status: '' },
        { typeContent: '' },
      ],
      conditionFilter: '',
      sourceList: [
        'Todos',
        'WEB',
        'API',
        'FORM',
        'MASS',
        'FTP',
        'AUTORESPONDER',
      ],
      statusList: ['LEIDO', 'NO LEIDO', 'EN COLA'],
      headersClone: [],
      activeReorder: false,
      typeContentList: ['Todos', 'Texto', 'Imagen', 'Link', 'Archivo'],
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  mounted() {
    this.activateFilter()
  },
  methods: {
    menuActions(menuItem) {
      console.log('menu: ', menuItem)
    },
    async activateFilter() {
      this.loading = true
      let sortBy = 'queuedAt'
      let sortDesc = true
      if (this.sort !== undefined) {
        sortBy = this.sort.sortBy
        sortDesc = this.sort.sortDesc
      }
      const filterService = {
        page: -1,
        limit: 50,
        sortBy,
        sortDesc,
        filter: this.filter,
      }
      const messages = await this.getMessagesDetail(filterService)
      this.databasesList = messages.dataList
      this.filterDrawer = false
      this.loading = false
    },
    changeName(filterName) {
      this.filter.clientName = filterName
    },
    reorderDataTable() {
      this.activeReorder = true
      this.headersClone = JSON.parse(JSON.stringify(this.headers))
      this.headersClone.forEach((item) => {
        if (item.align === ' d-none') {
          item.check = false
        } else {
          item.check = true
        }
      })
    },
    reorderDataTableList(listHeaders) {
      const newHearders = []
      listHeaders.forEach((item) => {
        let ver = ' d-none'
        if (item.check === true) {
          ver = ''
        }
        const newItem = {
          text: item.text,
          value: item.value,
          align: ver,
        }
        newHearders.push(newItem)
      })
      this.headers = newHearders
      this.activeReorder = false
      console.log(newHearders)
    },
    moveUp(item) {
      const index = this.headersClone.indexOf(item)
      if (index > 0) {
        const newList = []
        this.headersClone.forEach((itemI, indexI) => {
          if (indexI !== index) {
            if (indexI === index - 1) {
              newList.push(item)
            }
            newList.push(itemI)
          }
        })
        this.headersClone = newList
      }
    },
    moveDown(item) {
      const index = this.headersClone.indexOf(item)
      if (index + 1 <= this.headersClone.length - 1) {
        const newList = []
        this.headersClone.forEach((itemI, indexI) => {
          if (indexI !== index) {
            newList.push(itemI)
            if (indexI === index + 1) {
              newList.push(item)
            }
          }
        })
        this.headersClone = newList
      }
    },
    cleanFilters() {
      this.filter.clientName = ''
      this.filter.key = ''
      this.filter.addressee = ''
      this.filter.firstList = ''
      this.filter.source = ''
      this.filter.status = ''
      this.filter.typeContent = ''
    },
  },
}
</script>
<style scoped>
.datatable-col {
  max-width: 100px;
}
</style>
