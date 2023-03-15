<template>
  <v-container fluid fill-height>
    <v-col class="fill-height">
      <div>
        <v-row no-gutters>
          <v-col cols="7">
            <h1>Plantillas</h1>
          </v-col>
          <v-col cols="5">
            <div class="d-flex justify-end">
              <v-btn
                color="primary"
                @click="$router.push({ name: 'CreateTemplates' })"
              >
                <v-icon> mdi-plus </v-icon>CREAR PLANTILLAS
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <P class="my-2">
              Aquí podras encontrar tus plantillas y crear nuevas.
            </P>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <templates-table
              :loading="loading"
              :templates-list="templatesList"
              :headers="headers"
              :total-elements="totalElements"
              @filter-inputs="filterInputs"
              @clean-inputs="cleanFilters"
              @update-list="updateTable"
            />
          </v-col>
        </v-row>
      </div>
    </v-col>
  </v-container>
</template>

<script>
import whatsappBffMixin from '@/mixins/services/whatsappBffMixin'
import templateBffMixin from '@/mixins/services/whatsapp/templateBffMixin'
import TemplatesTable from '@/components/modules/whatsapp/settings/TemplatesTable.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'TemplatesSettings',
  components: { TemplatesTable },
  mixins: [whatsappBffMixin, templateBffMixin],
  data() {
    return {
      loading: false,
      headers: [
        { text: 'Nombre', align: 'start', value: 'name' },
        { text: 'Remitente', value: 'sender.phone' },
        { text: 'Idioma', value: 'languages.name' },
        { text: 'Estado', value: 'status' },
        { text: 'Fecha de Creacion', value: 'createdAt' },
        {
          text: 'Ver plantilla',
          align: 'center',
          value: 'watch',
          sortable: false,
        },
        { text: 'Acciones', align: 'center', value: 'menu', sortable: false },
      ],
      templatesList: [],
      filters: { name: null },
      sort: {
        sortBy: '',
        sortDesc: false,
      },
      totalElements: 0,
      itemsPerPage: 10,
      actualPage: 1,
    }
  },
  computed: {
    ...mapGetters(['clientId']),
  },
  mounted() {
    this.loading = true
  },
  methods: {
    async getTemplatesList() {
      let name = '-1'
      let sender = '-1'
      let sortBy = '-1'
      let sortDesc = '-1'
      this.loading = true
      if (this.sort !== undefined) {
        sortBy = this.sort.sortBy
        sortDesc = this.sort.sortDesc
      }
      if (this.filters !== undefined) {
        if (this.filters.name !== '') {
          name = this.filters.name
        }
        if (this.filters.sender !== '') {
          sender = this.filters.sender
        }
      }
      const filterService = {
        clientId: this.clientId,
        name,
        sender,
        page: this.actualPage - 1,
        limit: this.itemsPerPage,
        sortBy,
        sortDesc,
      }

      const templatesListTMP = await this.getTemplates(filterService)
      this.templatesList = templatesListTMP.dataList
      this.totalElements = templatesListTMP.totalElements
      this.loading = false
    },
    async filterInputs(filters) {
      this.filters = filters
      await this.getTemplatesList()
    },
    async updateTable(event) {
      this.actualPage = event.actualPage
      this.itemsPerPage = event.itemsPerPage
      if (event.sortBy === undefined) {
        this.sort.sortBy = '-1'
      } else {
        this.sort.sortBy = event.sortBy
      }
      this.sort.sortDesc = event.sortDesc
      await this.getTemplatesList()
    },
    async cleanFilters(event) {
      this.filters = event
      this.filters = { name: '', sender: '' }
      await this.getTemplatesList()
    },
  },
}
</script>
